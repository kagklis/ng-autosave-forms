import { Component } from '@angular/core';
import { Log } from '../model/log';
import { LoggingService } from '../services/logging.service';

@Component({
  selector: 'app-logs-history',
  templateUrl: './logs-history.component.html',
  styleUrls: ['./logs-history.component.scss'],
})
export class LogsHistoryComponent {
  public loggingHistory: Log[];

  constructor(private loggingService: LoggingService) {
    this.loggingHistory = this.loggingService.loggingHistory;
  }
}
