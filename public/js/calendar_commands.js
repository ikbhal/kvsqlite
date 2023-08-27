class CalendarCommands {
    constructor(kvStoreInstance) {
      this.kvStore = kvStoreInstance;
    }
  
    async handleCommand(command, args) {
      switch (command) {
        case 'add':
          return this.handleAddEvent(args);
        case 'delete':
          return this.handleDeleteEvent(args);
        case 'get':
          return this.handleGetEvent(args);
        case 'help':
          return this.showHelp();
        default:
          return 'Unknown command.';
      }
    }
  

    async handleAddEvent(args) {
      const [name, date, hour, eventnote] = args;
    
      // Validate input
      if (!name || !date || !hour || !eventnote) {
        return 'Invalid input. Please provide all required parameters.';
      }

      let calendarKey = this.getCalendarKey(name,date, hour);

      try {
        await kvStoreInstance.setKeyValue(calendarKey, eventnote);
        return 'Event added successfully.';
      } catch (error) {
        return 'Failed to add event.';
      }
    }
    showHelp() {
      const helpMessage = [
        '/calendar add <name> <date> <hour> <eventnote> - Add an event to the calendar.',
        '/calendar delete <name> <date> <hour> - Delete an event from the calendar.',
        '/calendar get <name> <date> <hour> - Get details of a specific event.',
      ].join('<br>');
      return helpMessage;
    }
  
    async handleDeleteEvent(args) {
      const [name, date, hour] = args;
    
      // Validate input
      if (!name || !date || !hour) {
        return 'Invalid input. Please provide all required parameters.';
      }

      // Update the calendar data in the KVStore using your KVStore instance
      let calendarKey = this.getCalendarKey(name, date, hour);

      try {
        return await kvStoreInstance.deleteKey(calendarKey);
        // return 'Event deleted successfully.';
      } catch (error) {
        return 'Failed to delete event.';
      }
    }

    getCalendarKey(name, date, hour){
      return `calendar-${name}-date-${date}-hour-${hour}`;
    }
    
  
    async handleGetEvent(args) {
      // Parse arguments and validate input
      // Retrieve and return details of the specified event
      const [name, date, hour] = args;
      if (!name || !date || !hour) {
        return 'Invalid input. Please provide all required parameters.';
      }
      let calendarKey = this.getCalendarKey(name, date, hour);
      try {
        return await kvStoreInstance.getKeyValue(calendarKey);
        // return 'Event deleted successfully.';
      } catch (error) {
        return 'Failed to delete event.';
      }
    }
  }
  
  // Instantiate the CalendarCommands class with your kvstore instance
  const calendarCommands = new CalendarCommands(kvStoreInstance);
  