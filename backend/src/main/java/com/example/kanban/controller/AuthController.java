package com.example.kanban.controller;

import com.example.kanban.model.User;
import com.example.kanban.service.AuthService;
import com.example.kanban.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestParam;

import java.net.URI;
import java.util.List;

record RegisterRequest(String username, String password) {}
record RegisterResponse(Long id, String username, String role) {}
record LoginRequest(String username, String password) {}
record TokenResponse(String token) {}
record MeResponse(String username, List<String> roles) {}

@RestController
@RequestMapping("/api/auth")

public class AuthController {

  private final AuthService auth;
  private final AuthenticationManager authenticationManager;
  private final UserDetailsService userDetailsService;
  private final JwtService jwtService;

  public AuthController(AuthService auth,
                        AuthenticationManager authenticationManager,
                        UserDetailsService userDetailsService,
                        JwtService jwtService) {
    this.auth = auth;
    this.authenticationManager = authenticationManager;
    this.userDetailsService = userDetailsService;
    this.jwtService = jwtService;
  }

  @PostMapping("/register")
  public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest req) {
    User u = auth.register(req.username(), req.password()); // default role USER
    var body = new RegisterResponse(u.getId(), u.getUsername(), u.getRole());
    return ResponseEntity.created(URI.create("/api/auth/users/" + u.getId())).body(body);
  }

  @PostMapping("/login")
  public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
    var authToken = new UsernamePasswordAuthenticationToken(req.username(), req.password());
    authenticationManager.authenticate(authToken); // throws if invalid
    var details = userDetailsService.loadUserByUsername(req.username());
    var jwt = jwtService.generateToken(details);
    return ResponseEntity.ok(new TokenResponse(jwt));
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(org.springframework.security.core.Authentication auth) {
    if (auth == null || !auth.isAuthenticated() || auth.getAuthorities() == null) {
      return ResponseEntity.status(401).body("Unauthorized");
    }
    var roles = auth.getAuthorities().stream().map(a -> a.getAuthority()).toList();
    return ResponseEntity.ok(new MeResponse(auth.getName(), roles));
  }

  @GetMapping("/health")
  public String health() { return "ok"; }
  
  @PostMapping(value = "/login", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
  public ResponseEntity<TokenResponse> loginForm(
      @RequestParam String username,
      @RequestParam String password
  ) {
    var authToken = new UsernamePasswordAuthenticationToken(username, password);
    authenticationManager.authenticate(authToken); // throws if invalid
    var details = userDetailsService.loadUserByUsername(username);
    var jwt = jwtService.generateToken(details);
    return ResponseEntity.ok(new TokenResponse(jwt));
  }
}
