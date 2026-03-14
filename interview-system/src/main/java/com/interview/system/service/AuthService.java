package com.interview.system.service;

import com.interview.system.dto.AuthResponse;
import com.interview.system.dto.LoginRequest;
import com.interview.system.dto.RegisterRequest;
import com.interview.system.exception.ResourceNotFoundException;
import com.interview.system.model.User;
import com.interview.system.repository.UserRepository;
import com.interview.system.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(
            jwtUtil.generateToken(user),
            user.getEmail(),
            user.getRole().name(),
            user.getName()
        );
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new IllegalStateException("Email already in use: " + request.getEmail());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);

        return new AuthResponse(
            jwtUtil.generateToken(user),
            user.getEmail(),
            user.getRole().name(),
            user.getName()
        );
    }
}