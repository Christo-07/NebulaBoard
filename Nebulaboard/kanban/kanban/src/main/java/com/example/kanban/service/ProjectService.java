// backend/src/main/java/com/example/kanban/service/ProjectService.java
package com.example.kanban.service;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

import com.example.kanban.model.Project;
import com.example.kanban.repository.ProjectRepository;
import com.example.kanban.repository.TaskRepository;

@Service
public class ProjectService {

    private final ProjectRepository repo;
    private final TaskRepository taskRepo;

    // Spring will inject both repositories
    public ProjectService(ProjectRepository repo, TaskRepository taskRepo) {
        this.repo = repo;
        this.taskRepo = taskRepo;
    }

    public Project create(Project p) {
        return repo.save(p);
    }

    public List<Project> getAll() {
        return repo.findAll();
    }

    public Optional<Project> getById(Long id) {
        return repo.findById(id);
    }

    /**
     * Delete a project and all its tasks.
     * Uses TaskRepository.deleteByProjectId(...) (you added in A1).
     */
    public void deleteById(Long id) {
        // 1) delete tasks of this project
        taskRepo.deleteByProjectId(id);
        // 2) delete the project
        repo.deleteById(id);
    }
}
