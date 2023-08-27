class PeriodCommands {
    constructor() {
      this.timerHandle = null;
      this.periods = [];
    }
  
    handleCommand(command, args) {
      switch (command) {
        case 'start':
          this.handleStart(args);
          break;
        case 'stop':
          this.handleStop();
          break;
        case 'status':
          this.handleStatus();
          break;
        case 'help':
          return 'Available commands: /period start, /period stop, /period status';
        default:
          return 'Unknown command.';
      }
    }
  
    handleStart(args) {
      if (this.timerHandle) {
        return 'A period is already running.';
      }
  
      // Start a new period
      const periodNumber = this.periods.length + 1;
      const startTime = new Date();
  
      // Implement starting the period and setting up the timer using setInterval
      // You can use the this.timerHandle to store the interval ID
      this.timerHandle = setInterval(() => {
        // Play sound using text-to-speech
        const message = `Period ${periodNumber}. It's time to take a break.`;
        this.speakMessage(message);
      }, 2700000);
  
      // Save the period information
      this.periods.push({ periodNumber, startTime });
  
      return `Period ${periodNumber} started.`;
    }
  
    handleStop() {
      if (!this.timerHandle) {
        return 'No active period to stop.';
      }
  
      // Implement stopping the period by clearing the interval using clearInterval
      clearInterval(this.timerHandle);
      this.timerHandle = null;
  
      return 'Period stopped.';
    }
  
    handleStatus() {
      if (this.periods.length === 0) {
        return 'No periods started yet.';
      }
  
      const lastPeriod = this.periods[this.periods.length - 1];
      const periodNumber = lastPeriod.periodNumber;
      const startTime = lastPeriod.startTime.toTimeString(); // Display the start time
  
      return `Current period: ${periodNumber}, started at ${startTime}`;
    }

    // Method to play a text-to-speech message
    speakMessage(message) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = message;
        speech.lang = 'en-US';
        speech.volume = 1; // Volume (0 to 1)
        speech.rate = 1;   // Speaking rate (0.1 to 10)
        speech.pitch = 1;  // Pitch (0 to 2)
  
        speechSynthesis.speak(speech);
      }
  }
  
  // Create an instance of the PeriodCommands class
  const periodCommands = new PeriodCommands();
  