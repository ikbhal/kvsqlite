class AlarmCommands {
  constructor() {
    // Initialize alarms array to store alarms
    this.alarms = [];
  }

  handleCommand(command, args) {
    switch (command) {
      case 'add':
        return this.handleAddAlarm(args);
      case 'list':
        return this.handleListAlarms();
      case 'delete':
        return this.handleDeleteAlarm(args);
      case 'start':
        return this.handleStartAlarm(args);
      case 'stop':
        return this.handleStopAlarm(args);
      case 'status':
        return this.handleStatusAlarm(args);
      default:
        return 'Unknown command.';
    }
  }

  handleAddAlarm(args) {
    const [time] = args;

    // Validate time format (hh:mm:ss am/pm)
    if (!isValidTimeFormat(time)) {
      return 'Invalid time format. Use hh:mm:ss am/pm format.';
    }

    // Add the alarm to the alarms array
    const alarm = { time, intervalHandle: null };
    this.alarms.push(alarm);

    // Use API to save the alarm to kvsqlite using set
    // TODO body json , no need to send alarm intervalhandle
    $.post('/set', { key: 'alarm_' + this.alarms.length, value: JSON.stringify(alarm) }, function (data) {
      console.log(data);
    });

    // Return success message
    return 'Alarm added successfully.';
  }


  // TODO not optimise 
  handleListAlarms() {
    // Use API to get the list of alarm keys from kvsqlite using get
    $.get('/keys', function (data) {
      const alarmKeys = data.keys.filter(key => key.startsWith('alarm_'));
      if (alarmKeys.length === 0) {
        console.log('No alarms found.');
        return;
      }
  
      console.log('List of alarms:');
      alarmKeys.forEach((key, index) => {
        console.log(`${index + 1}. ${key}`);
      });
    }).fail(function (jqXHR) {
      console.log(jqXHR.responseJSON.error);
    });
  }
  

  handleDeleteAlarm(args) {
    const [indexStr] = args;
    const index = parseInt(indexStr);

    // Validate index
    if (isNaN(index) || index < 1 || index > this.alarms.length) {
      return 'Invalid alarm index.';
    }

    // Remove the alarm from the alarms array
    const deletedAlarm = this.alarms.splice(index - 1, 1)[0];

    // Use API to delete the alarm from kvsqlite using delete
    const alarmKey = 'alarm_' + index;
    $.ajax({
      url: `/delete/${alarmKey}`,
      type: 'DELETE',
      success: function (data) {
        console.log(data);
      },
      error: function (jqXHR) {// TODO not sure about responseJSON.error
        console.log(jqXHR.responseJSON.error);
      }
    });

    // Return success message
    return 'Alarm deleted successfully.';
  }


  handleStartAlarm(args) {
    const [indexStr] = args;
    const index = parseInt(indexStr);

    // Validate index
    if (isNaN(index) || index < 1 || index > this.alarms.length) {
      return 'Invalid alarm index.';
    }

    const alarm = this.alarms[index - 1];

    // Check if the alarm is already running
    if (alarm.intervalHandle) {
      return 'Alarm is already running.';
    }

    // Convert time to milliseconds and calculate the delay
    const now = new Date();
    const [hour, minute, second] = alarm.time.split(':');
    const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hour), parseInt(minute), parseInt(second));
    const delay = alarmTime - now;

    // Check if the delay is valid (positive)
    if (delay <= 0) {
      return 'Invalid alarm time.';
    }

    // Use setInterval to trigger the alarm
    const alarmInterval = setInterval(() => {
      // Play a sound or show an alert to indicate the alarm
      // You can implement playing a sound or showing a message here

      // Clear the interval and update the alarm object
      clearInterval(alarm.intervalHandle);
      alarm.intervalHandle = null;
    }, delay);

    // Update the interval handle in the alarm object
    alarm.intervalHandle = alarmInterval;

    return 'Alarm started successfully.';
  }


  handleStopAlarm(args) {
    const [indexStr] = args;
    const index = parseInt(indexStr);
  
    // Validate index
    if (isNaN(index) || index < 1 || index > this.alarms.length) {
      return 'Invalid alarm index.';
    }
  
    // Get the alarm object associated with the specified index
    const alarm = this.alarms[index - 1];
  
    // Check if the alarm is currently running
    if (alarm.intervalHandle) {
      clearInterval(alarm.intervalHandle);
      alarm.intervalHandle = null;
      return 'Alarm stopped.';
    } else {
      return 'Alarm is not currently running.';
    }
  }

  handleStatusAlarm(args) {
    const [indexStr] = args;
    const index = parseInt(indexStr);
  
    // Validate index
    if (isNaN(index) || index < 1 || index > this.alarms.length) {
      return 'Invalid alarm index.';
    }
  
    // Get the alarm object associated with the specified index
    const alarm = this.alarms[index - 1];
  
    if (alarm.intervalHandle) {
      // Calculate time left until the alarm rings
      const now = new Date();
      const alarmTime = new Date(alarm.time);
      const timeLeftInSeconds = Math.max((alarmTime - now) / 1000, 0);
      const hours = Math.floor(timeLeftInSeconds / 3600);
      const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
      const seconds = Math.floor(timeLeftInSeconds % 60);
  
      return `Alarm is running. Time left: ${hours}h ${minutes}m ${seconds}s`;
    } else {
      return 'Alarm is not currently running.';
    }
  }
  
  isValidTimeFormat(time) {
    // Regular expression for 24-hour format (hh:mm:ss)
    const regex24Hour = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  
    // Regular expression for 12-hour format with AM/PM (hh:mm:ss am|pm)
    const regex12Hour = /^(1[0-2]|0?[1-9]):([0-5]\d):([0-5]\d) (am|pm)$/i;
  
    return regex24Hour.test(time) || regex12Hour.test(time);
  }
  
  
}

// Create an instance of AlarmCommands
const alarmCommands = new AlarmCommands();
