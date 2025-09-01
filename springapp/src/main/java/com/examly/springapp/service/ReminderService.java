package com.examly.springapp.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.ReminderDTO;
import com.examly.springapp.model.Remainder;
import com.examly.springapp.model.Task;
import com.examly.springapp.repository.ReminderRepository;
import com.examly.springapp.repository.TaskRepository;

@Service
public class ReminderService {
    
    @Autowired
    ReminderRepository reminderRepo;
    @Autowired
    private TaskRepository taskRepository;
    public List<Remainder> fetchReminder() {
        // TODO Auto-generated method stub
        return reminderRepo.findAll();
    }

    public Remainder creatingReminder(ReminderDTO dto) {
        // TODO Auto-generated method stub
        // return reminderRepo.save(data);
        // Fetch the task
        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Remainder reminder = new Remainder();
        reminder.setTask(task);
        reminder.setRemainderDate(dto.getReminderDate());
        reminder.setStatus(dto.getStatus());

        return reminderRepo.save(reminder);
    }

    public String deleteReminder(long id) {
        // TODO Auto-generated method stub
        if(reminderRepo.existsById(id))
        {
              reminderRepo.deleteById(id);
              return "id deleted succefully";
        }
        else
        {
            return id+ "Data not found";
        }
    }

    public String updatingReminder(long id, Remainder data2) {
        // TODO Auto-generated method stub
        if(reminderRepo.existsById(id))
        {
            reminderRepo.save(data2);
            return "Data updated Succesfully";
        }
        else{
            return id+"Data not found";
        }
    }


    

}
