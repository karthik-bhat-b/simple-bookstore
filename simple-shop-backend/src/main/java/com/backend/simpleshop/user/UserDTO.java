package com.backend.simpleshop.user;

import lombok.Value;

@Value
public class UserDTO {
    Integer id;
    String firstname;
    String lastname;
    String email;
    String role;
}
