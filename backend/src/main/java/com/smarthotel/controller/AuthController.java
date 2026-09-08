package com.smarthotel.controller;

import com.smarthotel.model.User;
import com.smarthotel.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password!");
        }

        User user = userOpt.get();
        if (user.getRole() == User.Role.GUEST) {
            if (loginRequest.getRoomNumber() == null || !loginRequest.getRoomNumber().equals(user.getRoomNumber())) {
                return ResponseEntity.status(401).body("Invalid room number!");
            }
        }

        return ResponseEntity.ok(user);
    }

    @PutMapping("/update/{username}")
    public ResponseEntity<?> updateProfile(@PathVariable String username, @RequestBody User updateRequest) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Username not found!");
        }
        User existingUser = userOpt.get();
        existingUser.setFullName(updateRequest.getFullName());
        existingUser.setEmail(updateRequest.getEmail());
        existingUser.setPhone(updateRequest.getPhone());
        existingUser.setCheckIn(updateRequest.getCheckIn());
        existingUser.setCheckOut(updateRequest.getCheckOut());
        
        userRepository.save(existingUser);
        return ResponseEntity.ok(existingUser);
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody User resetRequest) {
        Optional<User> userOpt = userRepository.findByUsername(resetRequest.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Username not found!");
        }
        User existingUser = userOpt.get();
        existingUser.setPassword(resetRequest.getPassword());
        userRepository.save(existingUser);
        return ResponseEntity.ok("Password updated successfully!");
    }

    @GetMapping("/staff")
    public ResponseEntity<?> getStaffMembers() {
        return ResponseEntity.ok(
            userRepository.findByRole(User.Role.STAFF)
                .stream()
                .map(user -> java.util.Map.of("id", user.getId(), "username", user.getUsername()))
                .collect(java.util.stream.Collectors.toList())
        );
    }
}
