class TodoList {
  constructor() {
    this.todos = [];
  }

  handleCommand(command, args) {
    switch (command) {
      case 'add':
        return this.handleAddTodo(args);
      case 'list':
        return this.handleListTodos();
      // Implement other cases...
      case 'completed':
        return this.handleMarkCompleted(args, true);
      case 'uncompleted':
        return this.handleMarkCompleted(args, false);
      case 'delete':
        return this.handleDeleteTodo(args);

      default:
        return 'Unknown command.';
    }
  }

  handleAddTodo(args) {
    const todoText = args.join(' ');
    this.todos.push({ text: todoText, completed: false });
    return `Todo added: ${todoText}`;
  }

  handleListTodos() {
    if (this.todos.length === 0) {
      return 'No todos available.';
    } else {
      const todosList = this.todos.map((todo, index) => {
        const status = todo.completed ? 'completed' : 'uncompleted';
        return `${index + 1}. ${todo.text} (${status})`;
      });
      return todosList.join('\n');
    }
  }

  handleMarkCompleted(args, completed) {
    const index = parseInt(args[0]) - 1;
    if (isNaN(index) || index < 0 || index >= this.todos.length) {
      return 'Invalid todo index.';
    }

    this.todos[index].completed = completed;
    const status = completed ? 'completed' : 'uncompleted';
    return `Todo ${index + 1} marked as ${status}.`;
  }

  handleDeleteTodo(args) {
    const index = parseInt(args[0]) - 1;
    if (isNaN(index) || index < 0 || index >= this.todos.length) {
      return 'Invalid todo index.';
    }

    const deletedTodo = this.todos.splice(index, 1)[0];
    return `Todo ${index + 1} deleted: ${deletedTodo.text}`;
  }

  // Implement other methods for handling todo commands...
}

  // Export the class
//   export default TodoCommands;
