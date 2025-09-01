package com.examly.springapp.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="task")
public class Task {
    @Id 
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @Column(name="title")
    private String title;
    @Column(name="description")
    private String description;
    @Column(name="date")
    private String date;
    // @Column(name="priority")
    // private String priority;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    @Column(name="status")
    private String status;

    public long getId(){return id;}
    public void setId(long id){this.id=id;}

    public User getUser(){return user;}
    public void setUser(User user){this.user=user;}

    public String getTitle(){return title;}
    public void setTitle(String title){this.title=title;}

    public String getDescription(){return description;}
    public void setDescription(String description){this.description=description;}

    public String getDate(){return date;}
    public void setDate(String date){this.date=date;}

    public Priority getPriority(){return priority;}
    public void setPriority(Priority priority){this.priority=priority;}

    public String getStatus(){return status;}
    public void setStatus(String status){this.status=status;}
}
