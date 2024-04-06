package com.backend.simpleshop.demo;

import com.backend.simpleshop.auth.AuthenticationService;
import com.backend.simpleshop.auth.RegisterRequest;
import com.backend.simpleshop.book.BookRequest;
import com.backend.simpleshop.book.BookService;
import io.swagger.v3.oas.annotations.Hidden;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final AuthenticationService authService;
    private final BookService bookService;

    @PostMapping("/add-book")
    public ResponseEntity<?> addBook(
            @RequestBody BookRequest request
    ) {
        bookService.save(request);
        return ResponseEntity.accepted().build();
    }
    @PostMapping("/create-account")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request
    ) {
        try{
            return ResponseEntity.ok(authService.register(request));
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Cannot create this user");
        }

    }

    @GetMapping("/valid")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> isAdmin() {
        return ResponseEntity.ok().body(true);
    }

    @DeleteMapping("/book/{id}")
    @PreAuthorize("hasAuthority('admin:delete')")
    @Hidden
    public ResponseEntity<?> deleteBook(@PathVariable("id") Integer bookId) {
        try{
            bookService.deleteById(bookId);
            return ResponseEntity.ok().body("done");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Cannot delete this book");
        }

    }
    @GetMapping
    @PreAuthorize("hasAuthority('admin:read')")
    public String get() {
        return "GET:: admin controller";
    }
    @PostMapping
    @PreAuthorize("hasAuthority('admin:create')")
    @Hidden
    public String post() {
        return "POST:: admin controller";
    }
    @PutMapping
    @PreAuthorize("hasAuthority('admin:update')")
    @Hidden
    public String put() {
        return "PUT:: admin controller";
    }
    @DeleteMapping
    @PreAuthorize("hasAuthority('admin:delete')")
    @Hidden
    public String delete() {
        return "DELETE:: admin controller";
    }
}
