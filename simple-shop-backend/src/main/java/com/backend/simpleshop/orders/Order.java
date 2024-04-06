package com.backend.simpleshop.orders;
import com.backend.simpleshop.book.Book;
import com.backend.simpleshop.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders") // "order" is a reserved keyword in SQL
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "user_id")
    private Integer userId;  // Store the user ID directly

    @Column(name = "book_id")
    private Integer bookId;

    private String studentId;
    private String userName;
    private String cardNumber;
    private String cardHoldersName;
    private String cvv;
    private String expiryDate;
    private String billingAddress;
    private String bookName;
    private String isbn;
    private float totalPrice;
    private int orderCount;

    private LocalDateTime createDate = LocalDateTime.now();
}

