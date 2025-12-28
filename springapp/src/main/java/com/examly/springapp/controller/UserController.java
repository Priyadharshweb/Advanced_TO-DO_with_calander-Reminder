package com.examly.springapp.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.examly.springapp.model.User;
import com.examly.springapp.security.JwtService;
import com.examly.springapp.service.UserService;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:8081"})
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    UserService userSer;
    
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    JwtService jwtService;
    // public List<User> getAllUsers()
    // {
        //     List<User> users = userSer.fetchUser();
        //     System.out.println("Total users in database: " + users.size());
        //     for (User user : users) {
            //         System.out.println("User: " + user.getEmail() + ", Role: " + user.getRole());
            //     }
            //     return users;
            // }
    //    @PreAuthorize("hasRole('ADMIN')") // ⛔ Only Admin can access
       @GetMapping
       public List<User> getAllUsers() {
       return userSer.fetchUser(); // Call your existing service
}

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable long id) {
        User user = userSer.findById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userSer.findByEmail(email);
    }

    @PostMapping
    // public User createUser (@RequestBody User data)
    // {
    //     // Encode password before saving
    //     data.setPassword(passwordEncoder.encode(data.getPassword()));
    //     return userSer.creatingUser(data);
    // }
    public ResponseEntity<User> addUser(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userSer.creatingUser(user);
        return ResponseEntity.ok(saved);
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User userData) {
        if (userSer.findByEmail(userData.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        userData.setPassword(passwordEncoder.encode(userData.getPassword()));
        User savedUser = userSer.creatingUser(userData);
        return ResponseEntity.ok("User registered successfully");
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
    System.out.println("Login attempt for email: " + loginData.getEmail());
    User existingUser = userSer.findByEmail(loginData.getEmail());

    if (existingUser == null) {
        System.out.println("User not found for email: " + loginData.getEmail());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
    }

    boolean passwordMatch = passwordEncoder.matches(loginData.getPassword(), existingUser.getPassword());

    if (passwordMatch) {
        String token = jwtService.generateToken(existingUser); // ✅ generate token
        System.out.println("Login successful. Token: " + token);
        return ResponseEntity.ok(token); // ✅ return only token string or a JSON object with token
    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
}

    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable long id)
    {
        return userSer.deletingUser(id);
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> updateTask(@PathVariable long id, @RequestBody User data2) {
        String result = userSer.updatingUser(id, data2);
        if (result.contains("successfully")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

}
