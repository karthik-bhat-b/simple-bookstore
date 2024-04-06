package com.backend.simpleshop.auth;

import com.backend.simpleshop.config.JwtService;
import com.backend.simpleshop.token.Token;
import com.backend.simpleshop.token.TokenRepository;
import com.backend.simpleshop.token.TokenType;
import com.backend.simpleshop.user.Role;
import com.backend.simpleshop.user.User;
import com.backend.simpleshop.user.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationService {
  private final UserRepository repository;
  private final TokenRepository tokenRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final UserRepository userRepository;
  // Constants
  private static final int MAX_FAILED_ATTEMPTS = 5;
  private static final long LOCK_TIME_DURATION = 15; // minutes
  public AuthenticationResponse register(RegisterRequest request) {

    // Check if the user email already exists in the database
    var existingUser = repository.findByEmail(request.getEmail());
    if (existingUser.isPresent()) {
      // If a user with the email already exists, throw an exception
      throw new RuntimeException("Email already taken.");
    }

    var user = User.builder()
        .firstname(request.getFirstname())
        .lastname(request.getLastname())
        .email(request.getEmail())
        .password(passwordEncoder.encode(request.getPassword()))
        .role(Role.CUSTOMER)
        .build();
    var savedUser = repository.save(user);
    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    saveUserToken(savedUser, jwtToken);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
            .refreshToken(refreshToken)
        .build();
  }

  public AuthenticationResponse authenticate(AuthenticationRequest request) {

    var user = repository.findByEmail(request.getEmail())
            .orElseThrow();

    if (isAccountLocked(user)) {
      throw new LockedException("Account is locked");
    }

    try {
      authenticationManager.authenticate(
              new UsernamePasswordAuthenticationToken(
                      request.getEmail(),
                      request.getPassword()
              )
      );
      // Reset failed attempts after successful authentication
      userRepository.resetFailedAttemptsAndUnlockAccount(user.getId());
    } catch (BadCredentialsException e){
      userRepository.incrementFailedAttempts(user.getId());
      int remainingAttempts = MAX_FAILED_ATTEMPTS-user.getFailedLoginAttempts() ;
      if (user.getFailedLoginAttempts() + 1 >= MAX_FAILED_ATTEMPTS) {
        userRepository.lockAccount(user.getId(), LocalDateTime.now().plusMinutes(LOCK_TIME_DURATION));
      }

      log.info(e.getMessage() + " user email: " + request.getEmail());
      throw new BadCredentialsException("Bad Credential, Remaining attempts: "+remainingAttempts);
    }


    var jwtToken = jwtService.generateToken(user);
    var refreshToken = jwtService.generateRefreshToken(user);
    revokeAllUserTokens(user);
    saveUserToken(user, jwtToken);
    return AuthenticationResponse.builder()
        .accessToken(jwtToken)
            .refreshToken(refreshToken)
        .build();
  }

  private void saveUserToken(User user, String jwtToken) {
    var token = Token.builder()
        .user(user)
        .token(jwtToken)
        .tokenType(TokenType.BEARER)
        .expired(false)
        .revoked(false)
        .build();
    tokenRepository.save(token);
  }

  private void revokeAllUserTokens(User user) {
    var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
    if (validUserTokens.isEmpty())
      return;
    validUserTokens.forEach(token -> {
      token.setExpired(true);
      token.setRevoked(true);
    });
    tokenRepository.saveAll(validUserTokens);
  }

  public void refreshToken(
          HttpServletRequest request,
          HttpServletResponse response
  ) throws IOException {
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    final String refreshToken;
    final String userEmail;
    if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
      return;
    }
    refreshToken = authHeader.substring(7);
    userEmail = jwtService.extractUsername(refreshToken);
    if (userEmail != null) {
      var user = this.repository.findByEmail(userEmail)
              .orElseThrow();
      if (jwtService.isTokenValid(refreshToken, user)) {
        var accessToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, accessToken);
        var authResponse = AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
      }
    }
  }
  private boolean isAccountLocked(User user) {
    return user.getLockoutTime() != null && user.getLockoutTime().isAfter(LocalDateTime.now());
  }
}
