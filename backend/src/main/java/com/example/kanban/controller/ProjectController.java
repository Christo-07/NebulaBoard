package com.example.kanban.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.example.kanban.model.Project;
import com.example.kanban.service.ProjectService;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @PostMapping
    public Project create(@RequestBody Project p) {
        return service.create(p);
    }

    @GetMapping
    public List<Project> list() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Project get(@PathVariable Long id) {
        return service.getById(id).orElse(null);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }

}
