import { Injectable } from '@angular/core';
import { Log } from '../model/log';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private _loggingHistory: Log[] = [];
  constructor() {}

  get loggingHistory(): Log[] {
    return this._loggingHistory;
  }

  public addLog(data: User | null, system: boolean): void {
    this._loggingHistory.push({
      timestamp: Date.now(),
      data,
      system,
      error: !data ? 'Failed to save user. Please try again...' : '',
    } as Log);
  }
}
