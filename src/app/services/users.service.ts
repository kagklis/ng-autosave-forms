import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { User } from '../model/user';
import { LoggingService } from './logging.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private loggingService: LoggingService,
    private snackbarService: SnackbarService,
    private http: HttpClient
  ) {}

  storeUser(user: User, savedBy: 'system' | 'user'): Observable<User> {
    const isSystem = savedBy === 'system';
    // Http post request here, e.g. this.http.post<User>('url', {})
    // TODO: Add db.json ???
    return of(user).pipe(
      tap((value) => {
        this.snackbarService.openSnackbar('Changes saved');
        this.loggingService.addLog(value, isSystem);
      }),
      catchError(() => {
        this.loggingService.addLog(null, isSystem);
        return EMPTY;
      })
    );
  }
}
