package com.backend.simpleshop.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationRequest {
  @NotBlank(message = "Email must not be blank")
  private String email;

  @NotBlank(message = "Password must not be blank")
  @Pattern(regexp = "^[a-zA-Z0-9!&()@]{8,}$", message = "Password must be at least 8 characters long and contain only a-z, A-Z, 0-9, and the special characters !&()@")
  @Size(max = 255, message = "Password must be less than 255 characters")
  String password;
}
