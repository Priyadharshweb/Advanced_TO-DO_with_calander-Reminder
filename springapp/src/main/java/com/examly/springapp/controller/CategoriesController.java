package com.examly.springapp.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.dto.CategoriesDTO;
import com.examly.springapp.model.Categories;
import com.examly.springapp.service.CategoriesService;

@RestController
@RequestMapping("api/categories")
public class CategoriesController {
    @Autowired
    CategoriesService catser;
    @GetMapping
    public List<Categories> getAllTask()
    {
        return catser.fetchCategory();
       
    }
    @PostMapping
    public Categories createTask (@Valid @RequestBody CategoriesDTO data)
    {
        return catser.creatingCategories(data);
    }
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable long id)
    {
        return catser.deleteCategories(id);
    }
    @PutMapping("/{id}")
    public String updateTask(@PathVariable long id,@RequestBody Categories data2)
    {
        return catser.updatingCategories(id,data2);
    }
    
}
