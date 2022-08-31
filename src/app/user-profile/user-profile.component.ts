import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { distinctUntilChanged, pairwise, tap, filter, debounceTime, switchMap, finalize, Subscription, BehaviorSubject } from 'rxjs';
import { User } from '../model/user';
import { SnackbarService } from '../services/snackbar.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnChanges, OnDestroy {
  @Input() autoSaveEnabled: boolean = false;
  @ViewChild('userForm') form!: NgForm;

  private changesSubscription: Subscription;
  private statusSubscription: Subscription;
  private isAutoSavingSubject = new BehaviorSubject<boolean>(false);

  public isAutoSaving$ = this.isAutoSavingSubject.asObservable();

  constructor(
    private usersService: UsersService,
    private snackbarService: SnackbarService
  ) {
    this.changesSubscription = new Subscription();
    this.statusSubscription = new Subscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['autoSaveEnabled'] || changes['autoSaveEnabled'].firstChange) {
      return;
    }

    if (changes['autoSaveEnabled'].currentValue) {
      this.enableAutoSaving();
      this.enableStatusWatching();
      this.snackbarService.openSnackbar('Auto-saving enabled');
    } else {
      this.disableAutoSaving();
      this.disableStatusWatching();
      this.snackbarService.openSnackbar('Auto-saving disabled');
    }
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

  private enableStatusWatching(): void {
    this.statusSubscription = this.form
      .statusChanges!.pipe(
        distinctUntilChanged(),
        pairwise(),
        tap(([previous, current]) => {
          // console.log('Status (previous, current): ', previous, current);
          if (previous === 'VALID' && current === 'INVALID') {
            this.disableAutoSaving();
          }

          if (current === 'VALID' && this.changesSubscription.closed) {
            this.enableAutoSaving();
            this.form.form.updateValueAndValidity();
          }
        })
      )
      .subscribe();
  }

  private disableStatusWatching(): void {
    this.statusSubscription.unsubscribe();
  }

  private enableAutoSaving(): void {
    this.changesSubscription = this.form
      .valueChanges!.pipe(
        filter(() => !this.form.invalid),
        tap(() => this.isAutoSavingSubject.next(true)),
        debounceTime(1_000),
        switchMap((value: User) =>
          this.usersService
            .saveUser(value, 'system')
            .pipe(finalize(() => this.isAutoSavingSubject.next(false)))
        )
      )
      .subscribe();
  }

  private disableAutoSaving(): void {
    this.isAutoSavingSubject.next(false);
    this.changesSubscription.unsubscribe();
  }
}
