// backend/src/main/java/com/example/kanban/controller/TaskController.java
package com.example.kanban.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import com.example.kanban.model.Task;
import com.example.kanban.service.TaskService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @PostMapping("/projects/{projectId}/tasks")
    public Task createTask(@PathVariable Long projectId, @RequestBody Task t) {
        return service.createTask(projectId, t);
    }

    @GetMapping("/projects/{projectId}/tasks")
    public Map<String, List<Task>> getTasksByStatus(@PathVariable Long projectId) {
        return service.getTasksByStatus(projectId);
    }

    @PutMapping("/tasks/{taskId}")
    public Task updateTask(@PathVariable Long taskId, @RequestBody Task body) {
        return service.updateTask(taskId, body).orElse(null);
    }

    @PatchMapping("/tasks/{taskId}/move")
    public Task moveTask(@PathVariable Long taskId, @RequestBody Map<String, Object> body) {
        return service.moveTask(taskId, body).orElse(null);
    }

    @DeleteMapping("/tasks/{taskId}")
    public void delete(@PathVariable Long taskId) {
        service.deleteTask(taskId);
    }

    @GetMapping("/projects/{projectId}/alerts/summary")
    public Map<String, Long> alerts(@PathVariable Long projectId) {
        return service.alertSummary(projectId);
    }

    // ---------- CSV EXPORT ----------
    @GetMapping(value = "/projects/{projectId}/tasks/export", produces = "text/csv")
    public ResponseEntity<byte[]> exportCsv(@PathVariable Long projectId) {
        var tasks = service.getAllByProject(projectId);

        StringBuilder sb = new StringBuilder();
        // header
        sb.append("id,title,description,priority,status,assigneeName,dueDate,createdAt,updatedAt\n");

        for (var t : tasks) {
            sb.append(csv(t.getId()))
              .append(',').append(csv(t.getTitle()))
              .append(',').append(csv(t.getDescription()))
              .append(',').append(csv(val(t.getPriority())))
              .append(',').append(csv(val(t.getStatus())))
              .append(',').append(csv(t.getAssigneeName()))
              .append(',').append(csv(val(t.getDueDate())))
              .append(',').append(csv(val(t.getCreatedAt())))
              .append(',').append(csv(val(t.getUpdatedAt())))
              .append('\n');
        }

        byte[] bytes = sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=project-" + projectId + "-tasks.csv");
        headers.setContentType(MediaType.valueOf("text/csv; charset=UTF-8"));

        return ResponseEntity.ok().headers(headers).body(bytes);
    }

    // helpers
    private static String val(Object o) { return o == null ? "" : o.toString(); }
    private static String csv(Object o) {
        String s = val(o);
        String esc = s.replace("\"", "\"\"");
        return "\"" + esc + "\"";
    }
}
