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

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        String email = null;
        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauth2Token = (OAuth2AuthenticationToken) authentication;
            Object principal = oauth2Token.getPrincipal();
            if (principal instanceof CustomOAuth2User) {
                email = ((CustomOAuth2User) principal).getUser().getEmail();
            } else {
                // Fallback to attribute if not our custom user (shouldn't happen but good for
                // safety)
                email = ((org.springframework.security.oauth2.core.user.OAuth2User) principal).getAttribute("email");
            }
        } else {
            email = authentication.getName();
        }

        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}
