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
import lombok.Data;

@Entity
@Data
@Table(name="reminder")
public class Remainder {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "taskId", nullable = false) 
    private Task task;
    
    @Column(name="reminderDate")
    private String remainderDate;
    // @Column(name="status")
    // private String status;
    @Enumerated(EnumType.STRING)
     private EnumStatus status;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public String getRemainderDate() {
        return remainderDate;
    }

    public void setRemainderDate(String remainderDate) {
        this.remainderDate = remainderDate;
    }

    public EnumStatus getStatus() {
        return status;
    }

    public void setStatus(EnumStatus status) {
        this.status = status;
    }
    
    
}
