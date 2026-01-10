package com.libstack.controller;

import com.libstack.dto.LoanDTO;
import com.libstack.dto.UserDTO;
import com.libstack.service.LoanService;
import com.libstack.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final LoanService loanService;

    public AdminController(UserService userService, LoanService loanService) {
        this.userService = userService;
        this.loanService = loanService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(@PathVariable String id, @RequestBody String role) {
        UserDTO user = userService.updateUserRole(id, role);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/loans")
    public ResponseEntity<Page<LoanDTO>> getAllLoans(@PageableDefault(size = 20) Pageable pageable) {
        Page<LoanDTO> loans = loanService.getAllLoans(pageable);
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/loans/overdue")
    public ResponseEntity<List<LoanDTO>> getOverdueLoans() {
        List<LoanDTO> loans = loanService.getOverdueLoans();
        return ResponseEntity.ok(loans);
    }
}
