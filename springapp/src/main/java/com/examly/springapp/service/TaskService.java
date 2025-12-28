package com.examly.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.Task;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.TaskRepository;
import com.examly.springapp.repository.UserRepository;

@Service
public class TaskService {
    @Autowired
    TaskRepository taskrepo;
    @Autowired
    UserRepository userRepo;
    public List<Task> fetchTasking()
    {
        return taskrepo.findAll();
    } 
    public Task creatingTask(Task data)
    {
        Long userId = data.getUser().getId(); // ID is passed from frontend
        User user = userRepo.findById(userId)
                  .orElseThrow(() -> new RuntimeException("User not found"));

    data.setUser(user);
    return taskrepo.save(data);
    }
    public String deletingTask(long id)
    {
        if(taskrepo.existsById(id))
        {
              taskrepo.deleteById(id);
              return "id deleted succefully";
        }
        else
        {
            return id+ "Data not found";
        }
    }
    public String updatingTask(long id,Task data2)
    {
        if(taskrepo.existsById(id))
        {
            taskrepo.save(data2);
            return "Data updated Succesfully";
        }
        else{
            return id+"Data not found";
        }
    }


}
