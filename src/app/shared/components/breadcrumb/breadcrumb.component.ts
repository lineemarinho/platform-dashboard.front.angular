import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocalePipe } from '../../pipes/locale.pipe';

export interface BreadcrumbItem {
  label: string;
  route?: string;
  active?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, LocalePipe],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent {
  @Input() items: BreadcrumbItem[] = [];
  @Input() showBackButton = true;
  @Input() backRoute?: string;

  constructor(private router: Router) {}

  onBack(): void {
    if (this.backRoute) {
      this.router.navigate([this.backRoute]);
    } else {
      this.router.navigate(['..'], { relativeTo: this.router.routerState.root });
    }
  }

  onItemClick(item: BreadcrumbItem): void {
    if (item.route && !item.active) {
      this.router.navigate([item.route]);
    }
  }

  isLastItem(item: BreadcrumbItem): boolean {
    return this.items.indexOf(item) === this.items.length - 1;
  }
} 