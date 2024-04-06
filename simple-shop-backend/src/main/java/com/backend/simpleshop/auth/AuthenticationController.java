package com.backend.simpleshop.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {

  private final AuthenticationService service;

  @PostMapping("/register")

  public ResponseEntity<?> register(
          @Valid @RequestBody RegisterRequest request
  ) {
    try{
      return ResponseEntity.ok(service.register(request));
    }catch (Exception e){
      return ResponseEntity.badRequest().body("Cannot create this user: " + e.getMessage());
    }

  }
  @PostMapping("/authenticate")
  public ResponseEntity<?> authenticate(
          @Valid @RequestBody AuthenticationRequest request
  ) {

    try{
      return ResponseEntity.ok(service.authenticate(request));
    }catch (LockedException e){
      log.info(e.getMessage() + " Failed login for email: " + request.getEmail());
      return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Too many requests, Account locked");
    }
    catch (BadCredentialsException e){
      log.info(e.getMessage() + " Failed login for email: " + request.getEmail());
      return ResponseEntity.badRequest().body(e.getMessage());
    }
    catch (Exception e){
      log.info(e.getMessage() + " user email: " + request.getEmail());
      return ResponseEntity.badRequest().body("Cannot Login with given credentials");
    }
  }

  @PostMapping("/refresh-token")
  public void refreshToken(
      HttpServletRequest request,
      HttpServletResponse response
  ) throws IOException {
    service.refreshToken(request, response);
  }


}
