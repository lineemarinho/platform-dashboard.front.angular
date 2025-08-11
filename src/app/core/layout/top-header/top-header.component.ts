import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SidebarService } from "../../services/sidebar.service";
import { TranslationService } from "../../services/translation.service";

@Component({
  selector: "app-top-header",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./top-header.component.html",
  styleUrls: ["./top-header.component.css"],
})
export class TopHeaderComponent implements OnInit {
  showLanguageMenu = false;

  constructor(
    private translationService: TranslationService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit() {}

  get availableLocales() {
    return this.translationService.getAvailableLocales();
  }

  get currentLocale() {
    return this.translationService.getCurrentLocale();
  }

  get currentLocaleInfo() {
    return this.availableLocales.find(
      (locale) => locale.code === this.currentLocale
    );
  }

  toggleLanguageMenu(): void {
    this.showLanguageMenu = !this.showLanguageMenu;
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  selectLanguage(locale: string): void {
    this.translationService.setLocale(locale);
    this.showLanguageMenu = false;
  }
}
