import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, of, tap } from 'rxjs';
import { User } from '../model/user';
import { LoggingService } from './logging.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  logs = inject(LoggingService);

  constructor(
    private snackbarService: SnackbarService,
    private http: HttpClient
  ) {}

  saveUser(user: User, savedBy: 'system' | 'user'): Observable<User> {
    const isSystem = savedBy === 'system';
    // Http post request here, e.g. this.http.post<User>('API-URL', user)
    // For our demo we simply return the passed user.
    return of(user).pipe(
      tap((value) => {
        this.snackbarService.openSnackbar('Changes saved');
        this.logs.add(value, isSystem);
      }),
      catchError(() => {
        this.snackbarService.openSnackbar('Failed to save changes');
        this.logs.add(null, isSystem);
        return EMPTY;
      })
    );
  }
}
