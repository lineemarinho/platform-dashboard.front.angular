import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { messages } from '../../shared/locale';
import { LOCALE_CODE } from '../../shared/locale/locale.constant';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLocale = new BehaviorSubject<string>(LOCALE_CODE.PT_BR);
  public currentLocale$ = this.currentLocale.asObservable();

  constructor() {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && Object.values(LOCALE_CODE).includes(savedLocale)) {
      this.currentLocale.next(savedLocale);
    }
  }

  getCurrentLocale(): string {
    return this.currentLocale.value;
  }

  setLocale(locale: string): void {
    if (Object.values(LOCALE_CODE).includes(locale)) {
      this.currentLocale.next(locale);
      localStorage.setItem('locale', locale);
    }
  }

  translate(key: string): string {
    const locale = this.currentLocale.value;
    const localeMessages = messages[locale] || messages[LOCALE_CODE.PT_BR];
    return (localeMessages as any)[key] || key;
  }

  getAvailableLocales() {
    return [
      {
        code: LOCALE_CODE.PT_BR,
        name: 'Português',
        flag: 'assets/images/br.png',
      },
      { code: LOCALE_CODE.EN, name: 'English', flag: 'assets/images/en.png' },
    ];
  }
}
