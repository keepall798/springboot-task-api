package com.example.taskmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 程序入口。
 *
 * <p>@SpringBootApplication 相当于把三个常用注解合在一起：
 * @Configuration + @EnableAutoConfiguration + @ComponentScan。</p>
 *
 * <p>启动后会扫描 com.example.taskmanager 及其子包里的 Controller、
 * Service、Repository，并自动配置 Tomcat、Spring MVC、JPA 等。</p>
 */
@SpringBootApplication
public class TaskManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskManagerApplication.class, args);
    }
}
