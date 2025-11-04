package com.example.kanban.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

import com.example.kanban.model.Task;
import com.example.kanban.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepo;

    public TaskService(TaskRepository taskRepo) {
        this.taskRepo = taskRepo;
    }

    public Task createTask(Long projectId, Task t) {
        t.setProjectId(projectId);
        if (t.getPosition() == null) t.setPosition(1000.0);
        t.setCreatedAt(LocalDateTime.now());
        t.setUpdatedAt(LocalDateTime.now());
        return taskRepo.save(t);
    }

    public Map<String, List<Task>> getTasksByStatus(Long projectId) {
        Map<String, List<Task>> result = new HashMap<>();
        result.put("todo", taskRepo.findByProjectIdAndStatusOrderByPositionAsc(projectId, Task.Status.TODO));
        result.put("inProgress", taskRepo.findByProjectIdAndStatusOrderByPositionAsc(projectId, Task.Status.IN_PROGRESS));
        result.put("done", taskRepo.findByProjectIdAndStatusOrderByPositionAsc(projectId, Task.Status.DONE));
        return result;
    }

    public Optional<Task> updateTask(Long taskId, Task body) {
        return taskRepo.findById(taskId).map(t -> {
            t.setTitle(body.getTitle());
            t.setDescription(body.getDescription());
            t.setPriority(body.getPriority());
            t.setAssigneeName(body.getAssigneeName());
            t.setDueDate(body.getDueDate());
            t.setUpdatedAt(LocalDateTime.now());
            return taskRepo.save(t);
        });
    }

    public Optional<Task> moveTask(Long taskId, Map<String, Object> body) {
        return taskRepo.findById(taskId).map(t -> {
            if (body.containsKey("status")) {
                t.setStatus(Task.Status.valueOf(body.get("status").toString()));
            }
            if (body.containsKey("position")) {
                t.setPosition(Double.valueOf(body.get("position").toString()));
            }
            t.setUpdatedAt(LocalDateTime.now());
            return taskRepo.save(t);
        });
    }

    public void deleteTask(Long taskId) {
        taskRepo.deleteById(taskId);
    }
    
    public Map<String, Long> alertSummary(Long projectId) {
    	  var all = taskRepo.findByProjectId(projectId);

    	  long overdue = all.stream().filter(t ->
    	      t.getDueDate() != null &&
    	      t.getStatus() != com.example.kanban.model.Task.Status.DONE &&
    	      t.getDueDate().isBefore(java.time.LocalDate.now())
    	  ).count();

    	  long dueSoon = all.stream().filter(t ->
    	      t.getDueDate() != null &&
    	      t.getStatus() != com.example.kanban.model.Task.Status.DONE &&
    	      !t.getDueDate().isBefore(java.time.LocalDate.now()) &&
    	      !t.getDueDate().isAfter(java.time.LocalDate.now().plusDays(2))
    	  ).count();

    	  var m = new java.util.HashMap<String, Long>();
    	  m.put("overdueCount", overdue);
    	  m.put("dueSoonCount", dueSoon);
    	  return m;
    	}
 // fetch all tasks for a project (used by CSV export)
    public java.util.List<com.example.kanban.model.Task> getAllByProject(Long projectId) {
        return taskRepo.findByProjectId(projectId);
    }


}
