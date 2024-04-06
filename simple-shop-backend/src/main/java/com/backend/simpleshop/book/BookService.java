package com.backend.simpleshop.book;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository repository;

    public void save(BookRequest request) {
        var book = Book.builder()
                .author(request.getAuthor())
                .isbn(request.getIsbn())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .build();
        repository.save(book);
    }
    @Transactional
    public void deleteById(Integer id) {
        // Optional step: Check if the book exists before attempting to delete
        Optional<Book> book = repository.findById(id);
        if (book.isPresent()) {
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Book not found with id: " + id);
        }
    }
    public List<Book> findAll() {
        return repository.findAll();
    }
}
