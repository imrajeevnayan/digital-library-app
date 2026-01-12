package com.libstack.service;

import com.libstack.dto.UserDTO;
import com.libstack.model.User;
import com.libstack.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDTO getUserById(String id) {
        return userRepository.findById(id)
            .map(this::toUserDTO)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .map(this::toUserDTO)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::toUserDTO)
            .collect(Collectors.toList());
    }

    public UserDTO updateUserRole(String id, String role) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setRole(role);
        User updatedUser = userRepository.save(user);
        return toUserDTO(updatedUser);
    }

    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public UserDTO registerUser(com.libstack.dto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode(request.getPassword()));
        user.setRole("USER");
        user.setProvider("LOCAL");
        return toUserDTO(userRepository.save(user));
    }
    
    public UserDTO loginUser(com.libstack.dto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
            
        if (user.getProvider() != null && !user.getProvider().equals("LOCAL")) {
             throw new RuntimeException("Please login with " + user.getProvider());
        }
            
        if (!new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return toUserDTO(user);
    }

    private UserDTO toUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setProvider(user.getProvider());
        dto.setRole(user.getRole());
        return dto;
    }
}
