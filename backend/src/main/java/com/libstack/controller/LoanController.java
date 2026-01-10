package com.libstack.controller;

import com.libstack.dto.LoanDTO;
import com.libstack.service.LoanService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loans")
public class LoanController {

    private final LoanService loanService;

    public LoanController(LoanService loanService) {
        this.loanService = loanService;
    }

    @GetMapping("/my-loans")
    public ResponseEntity<List<LoanDTO>> getMyActiveLoans(Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        List<LoanDTO> loans = loanService.getActiveLoansByUserId(userId);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/my-history")
    public ResponseEntity<Page<LoanDTO>> getMyLoanHistory(
            Authentication authentication,
            @PageableDefault(size = 10) Pageable pageable) {
        String userId = getUserIdFromAuthentication(authentication);
        Page<LoanDTO> loans = loanService.getLoansByUserId(userId, pageable);
        return ResponseEntity.ok(loans);
    }

    @PostMapping("/borrow/{bookId}")
    public ResponseEntity<LoanDTO> borrowBook(
            @PathVariable String bookId,
            Authentication authentication) {
        String userId = getUserIdFromAuthentication(authentication);
        LoanDTO loan = loanService.borrowBook(userId, bookId);
        return ResponseEntity.ok(loan);
    }

    @PostMapping("/return/{loanId}")
    public ResponseEntity<LoanDTO> returnBook(@PathVariable String loanId) {
        LoanDTO loan = loanService.returnBook(loanId);
        return ResponseEntity.ok(loan);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<LoanDTO>> getOverdueLoans() {
        List<LoanDTO> loans = loanService.getOverdueLoans();
        return ResponseEntity.ok(loans);
    }

    private String getUserIdFromAuthentication(Authentication authentication) {
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;
            String email = oauth2Token.getPrincipal().getAttribute("email");
            // In a real application, you'd fetch this from your UserService
            // For now, we'll return a placeholder
            return email;
        }
        return authentication.getName();
    }
}
