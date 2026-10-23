package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskCreateRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.dto.TaskUpdateRequest;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.exception.TaskNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 业务层：负责处理“新增/查询/更新/删除”的具体逻辑。
 *
 * <p>Controller 只负责接收 HTTP 请求，Repository 只负责数据库操作，
 * 中间的业务规则（例如默认状态、找不到任务时抛异常）放在 Service。</p>
 */
@Service
public class TaskService {

    private final TaskRepository taskRepository;

    /** 构造器注入：Spring 会自动把 TaskRepository 对象传进来。 */
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * 查询全部任务，按创建时间倒序（最新的在最前面）。
     * 如果创建时间相同，再按 id 倒序，保证顺序稳定。
     */
    @Transactional(readOnly = true)
    public List<TaskResponse> findAll() {
        Sort sort = Sort.by(
                Sort.Order.desc("createdAt"),
                Sort.Order.desc("id")
        );
        return taskRepository.findAll(sort)
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    /** 根据 id 查询单个任务，不存在时抛出 404 异常。 */
    @Transactional(readOnly = true)
    public TaskResponse findById(Long id) {
        return TaskResponse.from(getTaskOrThrow(id));
    }

    /**
     * 新增任务。
     * 如果请求没有传 status，默认设为 TODO。
     */
    @Transactional
    public TaskResponse create(TaskCreateRequest request) {
        TaskStatus status = request.getStatus() == null
                ? TaskStatus.TODO
                : request.getStatus();

        Task task = new Task(request.getTitle().trim(), status);
        Task saved = taskRepository.save(task);
        return TaskResponse.from(saved);
    }

    /**
     * 整体更新任务。
     * 先查询，找不到就抛 404；找到后修改字段，事务提交时会自动执行 UPDATE。
     */
    @Transactional
    public TaskResponse update(Long id, TaskUpdateRequest request) {
        Task task = getTaskOrThrow(id);
        task.setTitle(request.getTitle().trim());
        task.setStatus(request.getStatus());
        return TaskResponse.from(task);
    }

    /** 删除任务，不存在时抛出 404。 */
    @Transactional
    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }
        taskRepository.deleteById(id);
    }

    private Task getTaskOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
    }
}
