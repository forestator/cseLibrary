import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AuthentificationService} from '../../../services/firebase/authentification.service';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatInput, MatError } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Email ou mot de passe incorrect.',
  'auth/invalid-email': 'Adresse email invalide.',
  'auth/user-disabled': 'Ce compte est désactivé.',
  'auth/too-many-requests': 'Trop de tentatives, réessayez plus tard.',
  'auth/account-exists-with-different-credential': 'Un compte existe déjà avec cet email via un autre mode de connexion.',
  'auth/network-request-failed': 'Problème réseau, réessayez.',
};
const IGNORED_AUTH_ERRORS = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request'];
const DEFAULT_AUTH_ERROR = 'Connexion impossible.';

@Component({
    selector: 'app-admin-home',
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButton, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatError, AsyncPipe]
})
export class AdminHomeComponent {
  protected readonly auth = inject(AuthentificationService);

  protected readonly errorMessage = signal<string | undefined>(undefined);
  protected readonly loading = signal(false);

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
  });

  protected signInWithEmail() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const {email, password} = this.loginForm.getRawValue();
    this.run(() => this.auth.signInWithEmail(email, password));
  }

  protected signInWithGoogle() {
    this.run(() => this.auth.signInWithGoogle());
  }

  protected signInWithGithub() {
    this.run(() => this.auth.signInWithGithub());
  }

  protected logout() {
    this.auth.logout();
  }

  private async run(signIn: () => Promise<unknown>) {
    this.errorMessage.set(undefined);
    this.loading.set(true);
    try {
      await signIn();
    } catch (error) {
      const code = (error as {code?: string}).code ?? '';
      if (!IGNORED_AUTH_ERRORS.includes(code)) {
        this.errorMessage.set(AUTH_ERROR_MESSAGES[code] ?? DEFAULT_AUTH_ERROR);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
