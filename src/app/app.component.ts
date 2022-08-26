import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public form: FormGroup;
  public autoSaveEnabled = false;
  public autoSaving = false;
  public loggingHistory: Log[] = [];

  constructor(fb: FormBuilder, private _snackBar: MatSnackBar) {
    this.form = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.loggingHistory.push({
      timestamp: Date.now(),
      system: false,
      data: this.form.value,
    } as Log);
  }

  settingChanged(): void {
    const message = this.autoSaveEnabled
      ? 'Auto-saving enabled'
      : 'Auto-saving disabled';
    this._snackBar.open(message, 'Close', { duration: 2_000 });
  }

  changeSaved(): void {
    this._snackBar.open('Changes saved', 'Close', { duration: 2_000 });
  }
}

interface Log {
  timestamp: number;
  system: boolean;
  data: UserInfo;
}

interface UserInfo {
  firstName: string;
  lastName: string;
}
