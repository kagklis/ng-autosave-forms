import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  debounceTime,
  filter,
  finalize,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { User } from './model/user';
import { SnackbarService } from './services/snackbar.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public form: FormGroup;
  public autoSaveEnabled = false;
  public autoSaving = false;
  private subscription: Subscription;

  constructor(
    fb: FormBuilder,
    private usersService: UsersService,
    private snackbarService: SnackbarService
  ) {
    this.form = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.subscription = new Subscription();
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }
    this.usersService.storeUser(this.form.value, 'user').subscribe();
  }

  public settingChanged(): void {
    this.autoSaveEnabled ? this.enableAutoSaving() : this.disableAutoSaving();
  }

  private enableAutoSaving(): void {
    this.snackbarService.openSnackbar('Auto-saving enabled');
    // TODO: Fix minor bug when deleting the last character of
    // a required field => form becomes invalid => should cancel
    // last request
    this.subscription = this.form.valueChanges
      .pipe(
        filter(() => !this.form.invalid),
        tap(() => (this.autoSaving = true)),
        debounceTime(1_000),
        switchMap((value: User) =>
          this.usersService
            .storeUser(value, 'system')
            .pipe(finalize(() => (this.autoSaving = false)))
        )
      )
      .subscribe();
  }

  private disableAutoSaving(): void {
    this.snackbarService.openSnackbar('Auto-saving disabled');
    this.subscription.unsubscribe();
  }
}
