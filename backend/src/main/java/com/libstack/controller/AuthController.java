package com.libstack.controller;

import com.libstack.dto.UserDTO;
import com.libstack.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import com.libstack.config.CustomOAuth2User;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody @jakarta.validation.Valid com.libstack.dto.RegisterRequest request) {
        return ResponseEntity.ok(userService.registerUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody @jakarta.validation.Valid com.libstack.dto.LoginRequest request) {
        // In a real app, you would issue a JWT here. 
        // For now, we return UserDTO. Since basic auth is requested, we might need Basic Auth header support or just custom login.
        // Given the prompt "add basic register and login", I will implement a custom endpoint that verifies password.
        return ResponseEntity.ok(userService.loginUser(request));
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = authentication.getName();
        if (authentication.getPrincipal() instanceof org.springframework.security.oauth2.core.user.OAuth2User) {
             // Keep this just in case they revert, but strictly speaking we are removing oauth support
             email = ((org.springframework.security.oauth2.core.user.OAuth2User) authentication.getPrincipal()).getAttribute("email");
        }
        
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}
