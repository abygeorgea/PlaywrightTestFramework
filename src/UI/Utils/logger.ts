type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export class Logger {
  constructor(private readonly context: string) {}

  private log(level: LogLevel, message: string, ...args: unknown[]) {
    const line = `${new Date().toISOString()} [${level}] [${this.context}] ${message}`;
    if (level === 'ERROR') {
      console.error(line, ...args);
    } else if (level === 'WARN') {
      console.warn(line, ...args);
    } else {
      console.log(line, ...args);
    }
  }

  debug(message: string, ...args: unknown[]) {
    if (process.env.LOG_LEVEL === 'debug') {
      this.log('DEBUG', message, ...args);
    }
  }

  info(message: string, ...args: unknown[]) {
    this.log('INFO', message, ...args);
  }

  warn(message: string, ...args: unknown[]) {
    this.log('WARN', message, ...args);
  }

  error(message: string, ...args: unknown[]) {
    this.log('ERROR', message, ...args);
  }
}
