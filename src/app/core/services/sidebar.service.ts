import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SidebarService {
  private isCollapsedSubject = new BehaviorSubject<boolean>(false);
  private isMobileSubject = new BehaviorSubject<boolean>(false);

  isCollapsed$ = this.isCollapsedSubject.asObservable();
  isMobile$ = this.isMobileSubject.asObservable();

  get isCollapsed(): boolean {
    return this.isCollapsedSubject.value;
  }

  get isMobile(): boolean {
    return this.isMobileSubject.value;
  }

  toggleSidebar(): void {
    console.log(
      "Service toggle. Current collapsed:",
      this.isCollapsedSubject.value
    );
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
    console.log(
      "Service toggle. New collapsed:",
      this.isCollapsedSubject.value
    );
  }

  closeSidebar(): void {
    this.isCollapsedSubject.next(true);
  }

  openSidebar(): void {
    this.isCollapsedSubject.next(false);
  }

  setMobile(isMobile: boolean): void {
    this.isMobileSubject.next(isMobile);
    if (isMobile && !this.isCollapsed) {
      this.closeSidebar();
    }
  }
}
