package com.examly.springapp.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    UserRepository userRepo;

    public List<User> fetchUser() {
        // TODO Auto-generated method stub
        return userRepo.findAll();
    }

    public User creatingUser(User data) {
        // TODO Auto-generated method stub
        return userRepo.save(data);
    }

    public String deletingUser(long id) {
        if(userRepo.existsById(id))
        {
              userRepo.deleteById(id);
              return "id deleted succefully";
        }
        else
        {
            return id+ "Data not found";
        }
    }

    public String updatingUser(long id, User data2) {
    return userRepo.findById(id).map(existingUser -> {
        existingUser.setName(data2.getName());
        existingUser.setEmail(data2.getEmail());
        existingUser.setRole(data2.getRole());
        userRepo.save(existingUser);
        return "Data updated successfully";
    }).orElse(id + " Data not found");
}


    public User findByEmail(String email) {
        // TODO Auto-generated method stub
        return userRepo.findByEmail(email).orElse(null);

    }

    public User findById(long id) {
        return userRepo.findById(id).orElse(null);
    }
    
}
