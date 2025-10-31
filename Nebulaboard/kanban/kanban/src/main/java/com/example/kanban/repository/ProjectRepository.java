package com.example.kanban.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.example.kanban.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {}
