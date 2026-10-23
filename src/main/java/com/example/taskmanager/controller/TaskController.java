package com.example.taskmanager.controller;

import com.example.taskmanager.dto.TaskCreateRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.dto.TaskUpdateRequest;
import com.example.taskmanager.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 * 任务接口控制器。
 *
 * <p>所有接口都以 /api/tasks 开头，共 5 个：</p>
 * <ul>
 *   <li>POST   /api/tasks       新增</li>
 *   <li>GET    /api/tasks       查询全部</li>
 *   <li>GET    /api/tasks/{id}  查询单个</li>
 *   <li>PUT    /api/tasks/{id}  更新</li>
 *   <li>DELETE /api/tasks/{id}  删除</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * 新增任务。
     * 成功返回 201 Created，并在 Location 响应头里告诉客户端新资源的地址。
     */
    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskCreateRequest request) {
        TaskResponse created = taskService.create(request);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.getId())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    /** 查询全部任务，返回 JSON 数组。 */
    @GetMapping
    public List<TaskResponse> findAll() {
        return taskService.findAll();
    }

    /** 查询单个任务，id 不存在时返回 404。 */
    @GetMapping("/{id}")
    public TaskResponse findById(@PathVariable Long id) {
        return taskService.findById(id);
    }

    /** 更新任务，成功返回 200 和更新后的数据。 */
    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable Long id,
                               @Valid @RequestBody TaskUpdateRequest request) {
        return taskService.update(id, request);
    }

    /** 删除任务，成功返回 204 No Content（没有响应体）。 */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        taskService.delete(id);
    }
}
