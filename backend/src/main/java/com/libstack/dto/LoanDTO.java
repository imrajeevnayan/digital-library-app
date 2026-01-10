package com.libstack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoanDTO {
    private String id;
    private String userId;
    private String userName;
    private String bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookCoverUrl;
    private LocalDateTime borrowedAt;
    private LocalDate dueDate;
    private LocalDateTime returnedAt;
    private String status;
    private boolean overdue;
}
