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
