import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Log } from '../model/log';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private loggingHistorySubject = new BehaviorSubject<Log[]>([]);
  public loggingHistory$ = this.loggingHistorySubject.asObservable();

  constructor() {}

  public addLog(data: User | null, system: boolean): void {
    this.loggingHistorySubject.next([
      ...this.loggingHistorySubject.value,
      {
        timestamp: Date.now(),
        data,
        system,
        error: !data ? 'Failed to save user. Please try again...' : '',
      },
    ]);
  }

  public clearLogs(): void {
    this.loggingHistorySubject.next([]);
  }
}
