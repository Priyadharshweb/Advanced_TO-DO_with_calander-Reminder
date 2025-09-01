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
        if(userRepo.existsById(id))
        {
            userRepo.save(data2);
            return "Data updated Succesfully";
        }
        else{
            return id+"Data not found";
        }
    }
    
}
