package com.backend.simpleshop.orders;

import com.backend.simpleshop.book.Book;
import com.backend.simpleshop.book.BookRepository;
import com.backend.simpleshop.user.User;
import com.backend.simpleshop.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static java.rmi.server.LogStream.log;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository; // Assuming you have this repository
    private final BookRepository bookRepository;
    public void createOrder(OrderRequest orderRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalStateException("User not found"));
        Book book = bookRepository.findById(orderRequest.getBookId()).orElseThrow(()-> new IllegalStateException("Book not found"));
        Order order = Order.builder()
                .userId(user.getId())
                .bookId(book.getId())
                .studentId(orderRequest.getStudentId())
                .cardNumber(orderRequest.getCardNumber())
                .cardHoldersName(orderRequest.getCardHoldersName())
                .cvv(orderRequest.getCvv())
                .expiryDate(orderRequest.getExpiryDate())
                .billingAddress(orderRequest.getBillingAddress())
                .orderCount(orderRequest.getOrderCount())
                .createDate(LocalDateTime.now())
                .totalPrice(orderRequest.getOrderCount()*book.getPrice())
                .bookName(book.getName())
                .isbn(book.getIsbn())
                .userName(user.getFirstname()+ " "+user.getLastname())
                .build();

        orderRepository.save(order);
    }

    public List<Order> getOrdersForUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println(authentication.getName());
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalStateException("User not found"));
        return orderRepository.findAllByUserId(user.getId());
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}

