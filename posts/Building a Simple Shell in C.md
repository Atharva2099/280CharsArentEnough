---
title: Building a Shell in C
date: 2024-10-28
categories: [Programming, C, Operating Systems]
image: "/images/building-a-shell-in-c.png"
---

# Building a shell with pipes in C 

Command-line shells are an essential part of operating systems, allowing users to interact with the system via commands. While modern operating systems have powerful, feature-rich shells, understanding how they work at a low level provides crucial insight into process management, input/output operations, and more. In this post, we’ll take a closer look at building a simple shell in C, particularly focusing on three key phases: **Read**, **Parse**, and **Execute**.

<div class="video-container">
  <iframe
    width="100%"
    height="500"
    src="https://www.youtube.com/embed/2J7g3KcZJ3I"
    title="Building a Simple Shell in C"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen>
  </iframe>
</div>

### 1. The Shell Process Lifecycle

The shell can be broken down into three distinct phases:

- **Read Phase**: The shell reads the user’s command.

- **Parse Phase**: The shell breaks the command into individual tokens (like command and arguments) and prepares for execution.

- **Execute Phase**: The shell forks a new process to execute the command.

Let’s explore each phase in more detail.

-----------
### 2. **Read Phase**

In the **Read Phase**, the shell waits for user input. This input could be a simple command like `ls` or something more complex, involving pipes (`|`) and redirection (`>`, `<`). The input is typically read as a single string, which the shell will process further.

In C, this can be achieved using functions like `fgets()` or `read()` to capture input from the user.

#### Example:

```c

char input[1024];

printf("shell> ");

fgets(input, sizeof(input), stdin);

```

This code snippet captures user input of up to 1024 characters. Once the input is read, the shell proceeds to the **Parse Phase**.

-----
### 3. **Parse Phase**

The **Parse Phase** involves breaking down the user’s input into smaller components, known as **tokens**. These tokens are typically the command (like `ls`) and its arguments (like `-l`, `| grep .c`).

In C, functions like `strtok()` are useful for breaking the input string into tokens based on delimiters (like spaces or pipe symbols).

#### Example:

```c

char *token;

token = strtok(input, " \n");

while (token != NULL) {

    printf("%s\n", token);  // Process each token

    token = strtok(NULL, " \n");

}

```

This will break the user’s input into individual tokens. For example, if the user types `ls -l | grep .c`, the tokens will be `ls`, `-l`, `|`, and `grep .c`.

The shell needs to handle each of these tokens appropriately, determining what the user wants to achieve (e.g., if there’s a pipe, we need to split the command into two processes).

--------
### 4. **Execute Phase**

Finally, the **Execute Phase** is where the shell runs the command. In most cases, this involves creating a new child process using `fork()`, and then using `execvp()` or similar system calls to replace the child process’s memory with the new command’s memory.

For commands involving pipes or redirection, this phase becomes slightly more complex, as the shell needs to manage file descriptors and direct output from one process to another.

#### Example:

```c

pid_t pid = fork();

if (pid == 0) {

    // Child process

    execvp(command[0], command);

    perror("execvp");

    exit(EXIT_FAILURE);

} else if (pid > 0) {

    // Parent process

    wait(NULL);

} else {

    perror("fork");

    exit(EXIT_FAILURE);

}

```

This simple fork/exec pattern allows the shell to run commands. The parent process waits for the child to complete using `wait()`, ensuring that commands are executed sequentially unless the user requests background execution.

---

### 5. **Advanced Features**

Building a fully functional shell also requires adding advanced features like:

- **Piping**: Sending the output of one command as input to another (e.g., `ls | grep .c`).

- **Redirection**: Redirecting output to a file or input from a file (e.g., `ls > output.txt`).

- **Signal Handling**: Handling interrupts (e.g., `Ctrl+C`) to terminate running processes or commands.

While these features add complexity, they are also what make a shell useful. Understanding the basics of process control and inter-process communication (pipes) will help you implement these features.

---

### Conclusion

Building a shell from scratch is an excellent way to learn about process management, system calls, and low-level programming in C. By breaking the problem down into the **Read**, **Parse**, and **Execute** phases, you can focus on each aspect individually and build up to more complex features like piping and redirection.

Once you understand how these phases interact, you can experiment with adding more functionality and customization to your shell. And who knows? You might end up building a command-line interface that fits your workflow better than existing ones.

---
GitHub: [@FullMLAlchemist](https://github.com/Atharva2099)
Twitter: [@Attharave](https://x.com/attharave)
