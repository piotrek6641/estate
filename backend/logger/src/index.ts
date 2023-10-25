const chalk = require("chalk")
export class Logger {
    log(message: any, logLevel = 'info') {
      const timestamp = new Date().toISOString();
      const logEntry = `[${timestamp}] [${logLevel.toUpperCase()}] ${message}`;

      let colorFunction;
      switch (logLevel) {
        case 'info':
          colorFunction = chalk.blue;
          break;
        case 'warning':
          colorFunction = chalk.yellow;
          break;
        case 'error':
          colorFunction = chalk.red;
          break;
        default:
          colorFunction = chalk.white;
      }

      console.log(colorFunction(logEntry));
    }
  }


