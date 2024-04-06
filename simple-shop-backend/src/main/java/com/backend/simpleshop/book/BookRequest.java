package com.backend.simpleshop.book;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BookRequest {

    private Integer id;
    @NotNull(message = "Name is required")
    @Size(max = 255, message = "Name must be less than 255 characters")
    private String name;

    @NotNull(message = "Author is required")
    @Size(max = 255, message = "Author must be less than 255 characters")
    private String author;

    @NotNull(message = "ISBN is required")
    @Size(max = 255, message = "ISBN must be less than 255 characters")
    private String isbn;

    @NotNull(message = "description is required")
    @Size(max = 255, message = "Description must be less than 255 characters")
    private String description;

    @NotNull(message = "Price is required")
    private float price;
}
