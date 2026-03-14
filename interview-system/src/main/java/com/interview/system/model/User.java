package com.interview.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Role {
        ADMIN, HR, INTERVIEWER, CANDIDATE
    }

    public User() {}

    public User(Long id, String name, String email, String password,
                Role role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private Role role;
        private LocalDateTime createdAt;

        public Builder id(Long id)                        { this.id = id; return this; }
        public Builder name(String name)                  { this.name = name; return this; }
        public Builder email(String email)                { this.email = email; return this; }
        public Builder password(String password)          { this.password = password; return this; }
        public Builder role(Role role)                    { this.role = role; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public User build() {
            User u = new User();
            u.id        = this.id;
            u.name      = this.name;
            u.email     = this.email;
            u.password  = this.password;
            u.role      = this.role;
            u.createdAt = this.createdAt;
            return u;
        }
    }

    public Long getId()                               { return id; }
    public void setId(Long id)                        { this.id = id; }

    public String getName()                           { return name; }
    public void setName(String name)                  { this.name = name; }

    public String getEmail()                          { return email; }
    public void setEmail(String email)                { this.email = email; }

    public void setPassword(String password)          { this.password = password; }

    public Role getRole()                             { return role; }
    public void setRole(Role role)                    { this.role = role; }

    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override public String getPassword()              { return password; }
    @Override public String getUsername()              { return email; }
    @Override public boolean isAccountNonExpired()     { return true; }
    @Override public boolean isAccountNonLocked()      { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled()               { return true; }
}