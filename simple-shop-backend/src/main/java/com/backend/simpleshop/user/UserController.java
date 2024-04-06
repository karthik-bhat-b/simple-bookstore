package com.backend.simpleshop.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    @PostMapping("/change-password")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<?> changePassword(
          @RequestBody ChangePasswordRequest request,
          Principal connectedUser
    ) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MODERATOR')")
    public ResponseEntity<List<UserDTO>> findAll(){
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-store, max-age=0, must-revalidate");
        headers.add("Pragma", "no-cache"); // For HTTP 1.0 backward compatibility
        headers.add("Expires", "0"); // Proxies
        return ResponseEntity.ok().headers(headers).body(service.findAllUsers());
    }
}
