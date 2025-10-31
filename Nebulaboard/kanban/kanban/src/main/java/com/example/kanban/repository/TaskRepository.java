package com.example.kanban.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.kanban.model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProjectIdAndStatusOrderByPositionAsc(Long projectId, Task.Status status);

    List<Task> findByProjectId(Long projectId);

    // ✅ NEW: bulk delete all tasks of a given project
    void deleteByProjectId(Long projectId);
}
