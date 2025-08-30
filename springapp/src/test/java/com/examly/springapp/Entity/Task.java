package com.examly.springapp.Entity;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
@Entity
@Data
@Table(name="Task")
public class Task {
    @Id
    @Column(name="id")
    private int id;
    @Column(name="userid")
    private int userid;
    @Column(name="title")
    private String title;
    @Column(name="description")
    private String description;
    @Column(name="deadline")
    private LocalDate deadline;
    @Column(name="priority")
    private String priority;
    @Column(name="status")
    private String status;

}
