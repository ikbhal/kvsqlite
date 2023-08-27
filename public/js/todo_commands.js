// Import the KVStore class from kvstore.js
// import KVStore from './kvstore.js';

class TodoList {
  constructor(kvStore) {
    this.todos = [];
    this.kvStore = kvStore;
  }

  async handleCommand(command, args) {
    switch (command) {
      case 'add':
        return this.handleAddTodo(args);
      case 'list':
        return this.handleListTodos();
      case 'completed':
        return this.handleMarkCompleted(args, true);
      case 'uncompleted':
        return this.handleMarkCompleted(args, false);
      case 'delete':
        return this.handleDeleteTodo(args);
      case 'help':
        return this.showHelp();
      default:
        return 'Unknown command.';
    }
  }

  showHelp() {
    const helpMessage = [
      '/todo add <text> - Add a new todo.',
      '/todo list - List all todos.',
      '/todo completed <index> - Mark a todo as completed.',
      '/todo uncompleted <index> - Mark a todo as uncompleted.',
      '/todo delete <index> - Delete a todo.',
      '/todo help - Show this help message.'
    ].join('<br>');

    return helpMessage;
  }

  async handleAddTodo(args) {
    const todoText = args.join(' ');
    this.todos.push({ text: todoText, completed: false });

    // Store todos in KVStore
    await this.kvStore.setKeyValue('todos', JSON.stringify(this.todos));

    return `Todo added: ${todoText}`;
  }

  async handleListTodos() {
    try {
      const todosData = await this.kvStore.getKeyValue('todos');
      const storedTodos = JSON.parse(todosData);

      if (!Array.isArray(storedTodos)) {
        throw new Error('Invalid data format in KVStore.');
      }

      this.todos = storedTodos;

      if (this.todos.length === 0) {
        return 'No todos available.';
      } else {
        const todosList = this.todos.map((todo, index) => {
          const status = todo.completed ? 'completed' : 'uncompleted';
          return `${index + 1}. ${todo.text} (${status})`;
        });
        return todosList.join('<br>');
      }
    } catch (error) {
      return 'Error while retrieving todos from KVStore.';
    }
  }


  async handleMarkCompleted(args, completed) {
    const index = parseInt(args[0]) - 1;
    if (isNaN(index) || index < 0 || index >= this.todos.length) {
      return 'Invalid todo index.';
    }

    this.todos[index].completed = completed;

    // Update and store todos in KVStore
    await this.kvStore.setKeyValue('todos', JSON.stringify(this.todos));

    const status = completed ? 'completed' : 'uncompleted';
    return `Todo ${index + 1} marked as ${status}.`;
  }

  async handleDeleteTodo(args) {
    const index = parseInt(args[0]) - 1;
    if (isNaN(index) || index < 0 || index >= this.todos.length) {
      return 'Invalid todo index.';
    }

    const deletedTodo = this.todos.splice(index, 1)[0];

    // Update and store todos in KVStore
    await this.kvStore.setKeyValue('todos', JSON.stringify(this.todos));

    return `Todo ${index + 1} deleted: ${deletedTodo.text}`;
  }

  // ... other methods ...
}

// Instantiate the KVStore class
// const kvStore = new KVStore();

// Instantiate the TodoList class with the KVStore instance
const todoList = new TodoList(kvStoreInstance);
