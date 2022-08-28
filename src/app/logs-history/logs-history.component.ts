import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Log } from '../model/log';
import { LoggingService } from '../services/logging.service';

@Component({
  selector: 'app-logs-history',
  templateUrl: './logs-history.component.html',
  styleUrls: ['./logs-history.component.scss'],
})
export class LogsHistoryComponent {
  public loggingHistory$: Observable<Log[]>;

  constructor(private loggingService: LoggingService) {
    this.loggingHistory$ = this.loggingService.loggingHistory$;
  }

  clearHistory(): void {
    this.loggingService.clearLogs();
  }
}
