console.log("expense comamnds");

class ExpenseCommands {
    constructor(kvstore) {
      this.kvstore = kvstore;
      this.expenses = {};
    }
  
    async handleCommand(command, args) {
      switch (command) {
        case 'a':
        case 'add':
          return this.handleAddExpense(args);
        case 't':
        case 'total':
          return this.handleTotal();
        case 'help':
        case 'h':
            return this.showHelp();
        default:
          return 'Unknown command.';
      }
    }

    showHelp() {
        const helpMessage = [
          '/expense or /e aliases',
          '/expense add <number> or /expense a  - Add an expense for the day.',
          '/expense total or /e t - Show total expenses for the current date.'
        ].join('<br>');
        return helpMessage;
      }
  
    async handleAddExpense(args) {
      const [expenseNumber] = args;
      if (!expenseNumber || isNaN(expenseNumber)) {
        return 'Invalid expense number.';
      }
  
      const currentDate = this.getCurrentDate();
      const key = `expense-${currentDate}`;
      
      try {
        if (!this.expenses[key]) {
          this.expenses[key] = 0;
        }
  
        const newExpense = parseInt(expenseNumber);
        this.expenses[key] += newExpense;
  
        await this.kvstore.setKeyValue(key, this.expenses[key].toString());
        return `Expense added: ${newExpense}`;
      } catch (error) {
        return 'Failed to add expense.';
      }
    }
  
    async handleTotal() {
      const currentDate = this.getCurrentDate();
      const key = `expense-${currentDate}`;
      
      try {
        const expenseTotal = await this.kvstore.getKeyValue(key);
        return `Total expense for ${currentDate}: ${expenseTotal || 0}`;
      } catch (error) {
        return 'Failed to get expense total.';
      }
    }
  
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
  
  // Instantiate the ExpenseCommands class with your kvstore instance
  const expenseCommands = new ExpenseCommands(kvStoreInstance);
  