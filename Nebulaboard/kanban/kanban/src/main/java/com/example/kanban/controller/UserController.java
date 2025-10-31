package com.example.kanban.controller;

import com.example.kanban.model.User;                    // <-- explicit entity import
import com.example.kanban.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
public class UserController {

    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }

    @GetMapping("/users")
    public List<User> list() {
        return service.findAll();
    }

    @GetMapping("/users/{id}")
    public User get(@PathVariable Long id) {
        return service.findById(id).orElse(null);
    }
}
