package com.examly.springapp.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.examly.springapp.dto.ReminderDTO;
import com.examly.springapp.model.Remainder;
import com.examly.springapp.service.ReminderService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/remainders")
public class ReminderController {
    @Autowired
    ReminderService remser;
    @GetMapping
    public List<Remainder> getAllTask()
    {
        return remser.fetchReminder();
       
    }
    @PostMapping
    public Remainder createTask (@Valid @RequestBody ReminderDTO data)
    {
        return remser.creatingReminder(data);
    }
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable long id)
    {
        return remser.deleteReminder(id);
    }
    @PutMapping("/{id}")
    public String updateTask(@PathVariable long id,@RequestBody Remainder data2)
    {
        return remser.updatingReminder(id,data2);
    }

    
}
