package com.interview.system.dto;

public class AuthResponse {

    private Long id;
    private String token;
    private String email;
    private String role;
    private String name;

    public AuthResponse() {}

    public AuthResponse(Long id, String token, String email, String role, String name) {
        this.id = id;
        this.token = token;
        this.email = email;
        this.role = role;
        this.name = name;
    }

    public Long getId()                   { return id; }
    public void setId(Long id)            { this.id = id; }
    public String getToken()              { return token; }
    public void setToken(String token)    { this.token = token; }
    public String getEmail()              { return email; }
    public void setEmail(String email)    { this.email = email; }
    public String getRole()               { return role; }
    public void setRole(String role)      { this.role = role; }
    public String getName()               { return name; }
    public void setName(String name)      { this.name = name; }
}