import { Injectable, signal } from '@angular/core';
import { Log } from '../model/log';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  history = signal<Log[]>([]);

  public add(data: User | null, system: boolean): void {
    this.history.update((currentHistory: Log[]) => [
      ...currentHistory,
      {
        timestamp: Date.now(),
        data,
        system,
        error: !data ? 'Failed to save user. Please try again...' : '',
      },
    ]);
  }

  public clear(): void {
    this.history.set([]);
  }
}
