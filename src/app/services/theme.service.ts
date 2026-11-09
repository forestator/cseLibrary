import {DOCUMENT} from '@angular/common';
import {Injectable, effect, inject, signal} from '@angular/core';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'cse.theme';
const NEXT_PREFERENCE: Record<ThemePreference, ThemePreference> = {system: 'light', light: 'dark', dark: 'system'};

@Injectable({providedIn: 'root'})
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  readonly preference = signal<ThemePreference>(this.stored());

  constructor() {
    effect(() => {
      const preference = this.preference();
      const root = this.document.documentElement;
      if (preference === 'system') {
        root.removeAttribute('data-theme');
      } else {
        root.setAttribute('data-theme', preference);
      }
      try {
        localStorage.setItem(STORAGE_KEY, preference);
      } catch {
        // Storage can be blocked (private browsing): the preference then only lasts for the session.
      }
    });
  }

  cycle(): void {
    this.preference.update(current => NEXT_PREFERENCE[current]);
  }

  private stored(): ThemePreference {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
      return 'system';
    }
  }
}
