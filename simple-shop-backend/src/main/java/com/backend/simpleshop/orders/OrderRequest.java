package com.backend.simpleshop.orders;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Getter
@Setter
public class OrderRequest {

    @NotBlank(message = "Student ID is required")
    @Pattern(regexp = "^[0-9]{7}$", message = "Student ID must be 7 digits")
    private String studentId;

    @NotBlank(message = "Card Number is required")
    @Pattern(regexp = "^[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}$", message = "Card number must be in the format xxxx xxxx xxxx xxxx")
    private String cardNumber;

    @NotBlank(message = "Cardholder's name is required")
    @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Cardholder's name must only contain letters")
    private String cardHoldersName;

    @NotBlank(message = "CVV is required")
    @Pattern(regexp = "^[0-9]{3}$", message = "CVV must be 3 digits")
    private String cvv;

    @NotBlank(message = "Expiry Date is required")
    private String expiryDate;

    @NotNull(message = "Book ID is required")
    private Integer bookId;

    @NotBlank(message = "Billing Address is required")
    private String billingAddress;

    @NotNull(message = "Order count is required")
    @Min(value = 1, message = "Must order at least one")
    @Max(value = 5, message = "Cannot order more than 5")
    private Integer orderCount;
}


