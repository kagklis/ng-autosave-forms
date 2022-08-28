import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  Subscription,
  switchMap,
  tap,
  startWith,
  pairwise,
} from 'rxjs';
import { User } from './model/user';
import { SnackbarService } from './services/snackbar.service';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  public form: FormGroup;
  public autoSaveEnabled = false;
  public autoSaving = false;
  private changesSubscription: Subscription;
  private statusSubscription: Subscription;

  constructor(
    fb: FormBuilder,
    private usersService: UsersService,
    private snackbarService: SnackbarService
  ) {
    this.form = fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.changesSubscription = new Subscription();
    this.statusSubscription = new Subscription();
  }

  ngOnDestroy(): void {
    this.statusSubscription.unsubscribe();
    this.changesSubscription.unsubscribe();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.usersService.saveUser(this.form.value, 'user').subscribe();
  }

  public settingChanged(): void {
    if (this.autoSaveEnabled) {
      this.enableAutoSaving();
      this.enableStatusWatching();
      this.snackbarService.openSnackbar('Auto-saving enabled');
    } else {
      this.disableAutoSaving();
      this.disableStatusWatching();
      this.snackbarService.openSnackbar('Auto-saving disabled');
    }
  }

  private enableStatusWatching(): void {
    this.statusSubscription = this.form.statusChanges
      .pipe(
        distinctUntilChanged(),
        startWith(undefined),
        pairwise(),
        tap(([previous, current]) => {
          // console.log('Status (previous, current): ', previous, current);
          if (previous === 'VALID' && current === 'INVALID') {
            this.disableAutoSaving();
          }

          if (current === 'VALID' && this.changesSubscription.closed) {
            this.enableAutoSaving();
            this.form.updateValueAndValidity();
          }
        })
      )
      .subscribe();
  }

  private disableStatusWatching(): void {
    this.statusSubscription.unsubscribe();
  }

  private enableAutoSaving(): void {
    this.changesSubscription = this.form.valueChanges
      .pipe(
        filter(() => !this.form.invalid),
        tap(() => (this.autoSaving = true)),
        debounceTime(1_000),
        switchMap((value: User) =>
          this.usersService
            .saveUser(value, 'system')
            .pipe(finalize(() => (this.autoSaving = false)))
        )
      )
      .subscribe();
  }

  private disableAutoSaving(): void {
    this.autoSaving = false;
    this.changesSubscription.unsubscribe();
  }
}
