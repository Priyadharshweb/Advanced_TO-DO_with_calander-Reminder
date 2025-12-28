package com.examly.springapp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.dto.CategoriesDTO;
import com.examly.springapp.model.Categories;
import com.examly.springapp.model.Remainder;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.CategoriesRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.TaskRepository;
import java.util.Optional;

@Service
public class CategoriesService {
    @Autowired
    CategoriesRepository catRepo;
     
    @Autowired
    UserRepository userRepo;
    
    @Autowired
    TaskRepository taskRepo;
    public List<Categories> fetchCategory() {
        return catRepo.findAll();
    }

    public Categories creatingCategories(CategoriesDTO data) {
       Categories category = new Categories();
        category.setName(data.getName());

        // Fetch the user by ID
        Optional<User> userOpt = userRepo.findById(data.getUserId());
        if (!userOpt.isPresent()) {
            throw new RuntimeException("User not found with ID: " + data.getUserId());
        }
        category.setUser(userOpt.get());

        // Save category
        return catRepo.save(category);
        
    }

    public String deleteCategories(long id) {
        if(catRepo.existsById(id))
        {
            // First, update all tasks that reference this category to have null category
            taskRepo.findAll().forEach(task -> {
                if(task.getCategory() != null && task.getCategory().getId() == id) {
                    task.setCategory(null);
                    taskRepo.save(task);
                }
            });
            
            // Then delete the category
            catRepo.deleteById(id);
            return "Category deleted successfully";
        }
        else
        {
            return "Category with id " + id + " not found";
        }
    }

    public String updatingCategories(long id, Categories data2) {
        if(catRepo.existsById(id))
        {
            catRepo.save(data2);
            return "Data updated Succesfully";
        }
        else{
            return id+"Data not found";
        }
    }
    
    
}
