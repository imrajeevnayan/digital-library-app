package com.libstack.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Loan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;
    
    @Column(nullable = false)
    private LocalDateTime borrowedAt;
    
    @Column(nullable = false)
    private LocalDate dueDate;
    
    private LocalDateTime returnedAt;
    
    @Column(nullable = false)
    private String status;
    
    @PrePersist
    protected void onCreate() {
        borrowedAt = LocalDateTime.now();
        if (dueDate == null) {
            dueDate = LocalDate.now().plusDays(14);
        }
        status = "ACTIVE";
    }
    
    public boolean isOverdue() {
        return status.equals("ACTIVE") && LocalDate.now().isAfter(dueDate);
    }
    
    public boolean isReturned() {
        return status.equals("RETURNED");
    }
}
