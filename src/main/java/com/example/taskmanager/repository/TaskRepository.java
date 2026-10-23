package com.example.taskmanager.repository;

import com.example.taskmanager.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 任务数据访问接口。
 *
 * <p>只要继承 JpaRepository，Spring Data JPA 就会自动帮我们生成
 * 常用的增删改查方法，例如 save、findAll、findById、deleteById、
 * existsById，完全不用自己写 SQL。</p>
 *
 * <p>泛型参数：Task 表示操作哪个实体，Long 表示主键类型。</p>
 */
public interface TaskRepository extends JpaRepository<Task, Long> {
}
