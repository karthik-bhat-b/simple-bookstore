package com.backend.simpleshop.auth;

import com.backend.simpleshop.user.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

  @NotBlank(message = "Firstname must not be blank")
  private String firstname;

  @NotBlank(message = "Lastname must not be blank")
  private String lastname;

  @NotBlank(message = "Email must not be blank")
  private String email;

  @NotBlank(message = "Password must not be blank")
  @Pattern(regexp = "^[a-zA-Z0-9!&()@]{8,}$", message = "Password must be at least 8 characters long and contain only a-z, A-Z, 0-9, and the special characters !&()@")
  private String password;

  private Role role; // Optional, no validation constraints
}
