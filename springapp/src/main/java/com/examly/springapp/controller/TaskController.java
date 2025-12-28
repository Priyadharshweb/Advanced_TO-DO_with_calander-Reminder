package com.examly.springapp.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.model.Task;
import com.examly.springapp.service.TaskService;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    TaskService taskser;
    @GetMapping
    public List<Task> getAllTask()
    {
        return taskser.fetchTasking();
       
    }
    // @PostMapping
    // public Task createTask (@Valid @RequestBody Task data)
    // {
    //     return taskser.creatingTask(data);
    // }
    @PostMapping
public ResponseEntity<?> createTask(@Valid @RequestBody Task data) {
    try {
        Task created = taskser.creatingTask(data);
        return ResponseEntity.ok(created);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating task: " + e.getMessage());
    }
}

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable long id)
    {
        return taskser.deletingTask(id);
    }
    @PutMapping("/{id}")
    public String updateTask(@PathVariable long id,@RequestBody Task data2)
    {
        return taskser.updatingTask(id,data2);
    }


}
