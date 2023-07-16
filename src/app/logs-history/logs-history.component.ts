import { Component, inject } from '@angular/core';
import { LoggingService } from '../services/logging.service';

@Component({
  selector: 'app-logs-history',
  templateUrl: './logs-history.component.html',
  styleUrls: ['./logs-history.component.scss'],
})
export class LogsHistoryComponent {
  logs = inject(LoggingService);
}
