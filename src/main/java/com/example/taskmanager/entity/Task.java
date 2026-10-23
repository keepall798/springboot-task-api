package com.example.taskmanager.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * 任务实体，对应数据库中的 task 表。
 *
 * <p>JPA 会读取这些注解，把 Java 对象和数据库表建立映射：
 * <ul>
 *   <li>@Entity：告诉 JPA 这是一个实体类</li>
 *   <li>@Table(name = "task")：对应 task 表</li>
 *   <li>@Id + @GeneratedValue：主键由数据库自增生成</li>
 *   <li>@Column：字段名、长度、是否允许为空等</li>
 * </ul>
 */
@Entity
@Table(name = "task")
public class Task {

    /** 主键，数据库自增（AUTO_INCREMENT） */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 任务标题，不能为空，最长 200 个字符 */
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    /**
     * 任务状态。
     * EnumType.STRING 表示数据库保存 "TODO" 这样的字符串，
     * 而不是枚举的序号 0、1、2。
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private TaskStatus status;

    /** 创建时间。updatable = false 表示写入后不允许通过 JPA 修改。 */
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /** JPA 规范要求实体必须有一个无参构造方法（可以不是 public）。 */
    protected Task() {
    }

    public Task(String title, TaskStatus status) {
        this.title = title;
        this.status = status;
    }

    /**
     * 首次保存到数据库之前自动调用。
     * 这样即使调用方没有传时间/状态，也能得到合理默认值。
     */
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = TaskStatus.TODO;
        }
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
