package com.backend.simpleshop.book;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/books")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<Book>> findAllBooks() {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Cache-Control", "no-store, max-age=0, must-revalidate");
        headers.add("Pragma", "no-cache"); // For HTTP 1.0 backward compatibility
        headers.add("Expires", "0"); // Proxies
        return ResponseEntity.ok().headers(headers).body(bookService.findAll());
    }
}
