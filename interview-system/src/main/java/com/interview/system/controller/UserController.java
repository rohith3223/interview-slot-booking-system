package com.interview.system.controller;

import com.interview.system.model.User;
import com.interview.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User user : allUsers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getName());
            map.put("email", user.getEmail());
            map.put("role", user.getRole().toString());
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/interviewers")
    @PreAuthorize("hasAnyRole('ADMIN','HR','INTERVIEWER')")
    public ResponseEntity<List<Map<String, Object>>> getInterviewers() {
        List<User> interviewers = userRepository.findAll().stream()
                .filter(u -> u.getRole().name().equals("INTERVIEWER"))
                .collect(java.util.stream.Collectors.toList());

        List<Map<String, Object>> result = new ArrayList<>();
        for (User user : interviewers) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("name", user.getName());
            map.put("email", user.getEmail());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}