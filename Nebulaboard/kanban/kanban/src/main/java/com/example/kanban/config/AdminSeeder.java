package com.example.kanban.config;

import com.example.kanban.model.User;
import com.example.kanban.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminSeeder {

  @Bean
  CommandLineRunner seedAdmin(UserRepository users, PasswordEncoder encoder) {
    return args -> {
     
      final String username = "admin";
      final String password = "admin123"; 
      if (!users.existsByUsername(username)) {
        User admin = new User(username, encoder.encode(password), "ADMIN");
        users.save(admin);
        System.out.println("[AdminSeeder] Created default admin: " + username + " / " + password);
      } else {
        System.out.println("[AdminSeeder] Admin user already exists: " + username);
      }
    };
  }
}
