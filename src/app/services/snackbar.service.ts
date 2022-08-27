import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  public openSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 2_000 });
  }
}
