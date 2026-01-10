package com.libstack.service;

import com.libstack.dto.LoanDTO;
import com.libstack.model.Book;
import com.libstack.model.Loan;
import com.libstack.model.User;
import com.libstack.repository.BookRepository;
import com.libstack.repository.LoanRepository;
import com.libstack.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LoanService {

    private static final int MAX_ACTIVE_LOANS = 5;

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public LoanService(LoanRepository loanRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.loanRepository = loanRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public Page<LoanDTO> getLoansByUserId(String userId, Pageable pageable) {
        return loanRepository.findByUserId(userId, pageable).map(this::toLoanDTO);
    }

    public List<LoanDTO> getActiveLoansByUserId(String userId) {
        return loanRepository.findActiveLoansByUserId(userId).stream()
            .map(this::toLoanDTO)
            .collect(Collectors.toList());
    }

    public Page<LoanDTO> getAllLoans(Pageable pageable) {
        return loanRepository.findAll(pageable).map(this::toLoanDTO);
    }

    public List<LoanDTO> getOverdueLoans() {
        return loanRepository.findOverdueLoans().stream()
            .map(this::toLoanDTO)
            .collect(Collectors.toList());
    }

    public LoanDTO borrowBook(String userId, String bookId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Book book = bookRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));

        // Check if user already has this book borrowed
        if (loanRepository.existsByUserIdAndBookIdAndStatus(userId, bookId, "ACTIVE")) {
            throw new RuntimeException("User already has an active loan for this book");
        }

        // Check if user has reached max loans
        long activeLoansCount = loanRepository.countActiveLoansByUserId(userId);
        if (activeLoansCount >= MAX_ACTIVE_LOANS) {
            throw new RuntimeException("User has reached maximum number of active loans (" + MAX_ACTIVE_LOANS + ")");
        }

        // Check if book is available
        if (book.getStockQuantity() <= 0) {
            throw new RuntimeException("Book is not available for borrowing");
        }

        // Create loan
        Loan loan = new Loan();
        loan.setUser(user);
        loan.setBook(book);
        loan.setDueDate(LocalDate.now().plusDays(14));
        loan.setStatus("ACTIVE");

        // Decrement stock
        book.setStockQuantity(book.getStockQuantity() - 1);
        bookRepository.save(book);

        Loan savedLoan = loanRepository.save(loan);
        return toLoanDTO(savedLoan);
    }

    public LoanDTO returnBook(String loanId) {
        Loan loan = loanRepository.findById(loanId)
            .orElseThrow(() -> new RuntimeException("Loan not found with id: " + loanId));

        if (!"ACTIVE".equals(loan.getStatus())) {
            throw new RuntimeException("Book is already returned");
        }

        // Return book
        loan.setStatus("RETURNED");
        loan.setReturnedAt(java.time.LocalDateTime.now());

        // Increment stock
        Book book = loan.getBook();
        book.setStockQuantity(book.getStockQuantity() + 1);
        bookRepository.save(book);

        Loan updatedLoan = loanRepository.save(loan);
        return toLoanDTO(updatedLoan);
    }

    private LoanDTO toLoanDTO(Loan loan) {
        LoanDTO dto = new LoanDTO();
        dto.setId(loan.getId());
        dto.setUserId(loan.getUser().getId());
        dto.setUserName(loan.getUser().getName());
        dto.setBookId(loan.getBook().getId());
        dto.setBookTitle(loan.getBook().getTitle());
        dto.setBookAuthor(loan.getBook().getAuthor());
        dto.setBookCoverUrl(loan.getBook().getCoverUrl());
        dto.setBorrowedAt(loan.getBorrowedAt());
        dto.setDueDate(loan.getDueDate());
        dto.setReturnedAt(loan.getReturnedAt());
        dto.setStatus(loan.getStatus());
        dto.setOverdue(loan.isOverdue());
        return dto;
    }
}
