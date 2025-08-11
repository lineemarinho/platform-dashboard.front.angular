import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { TranslationService } from "../../../core/services/translation.service";

export type StatusType =
  | "approved"
  | "pending"
  | "rejected"
  | "paid"
  | "failed"
  | "cancelled"
  | "processing"
  | "completed"
  | "active"
  | "inactive";

@Component({
  selector: "app-status-badge",
  templateUrl: "./status-badge.component.html",
  styleUrls: ["./status-badge.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class StatusBadgeComponent implements OnInit, OnDestroy {
  @Input() status: StatusType = "pending";
  @Input() size: "sm" | "md" | "lg" = "md";
  @Input() showIcon: boolean = false;

  private localeSubscription: Subscription | null = null;

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.localeSubscription = this.translationService.currentLocale$.subscribe(
      () => {}
    );
  }

  ngOnDestroy(): void {
    if (this.localeSubscription) {
      this.localeSubscription.unsubscribe();
    }
  }

  getStatusConfig() {
    const configs = {
      approved: {
        label: this.translationService.translate("approved"),
        classes: "bg-emerald-50 text-emerald-700 ",
      },
      pending: {
        label: this.translationService.translate("pending"),
        classes: "bg-amber-50 text-amber-700 ",
      },
      rejected: {
        label: this.translationService.translate("rejected"),
        classes: "bg-red-50 text-red-700 ",
      },
      paid: {
        label: this.translationService.translate("paid"),
        classes: "bg-green-50 text-green-700 ",
      },
      failed: {
        label: this.translationService.translate("failed"),
        classes: "bg-red-50 text-red-700 ",
      },
      cancelled: {
        label: this.translationService.translate("cancelled"),
        classes: "bg-slate-50 text-slate-600 ",
      },
      processing: {
        label: this.translationService.translate("processing"),
        classes: "bg-blue-50 text-blue-700",
      },
      completed: {
        label: this.translationService.translate("completed"),
        classes: "bg-green-50 text-green-700 ",
      },
      active: {
        label: this.translationService.translate("active"),
        classes: "bg-emerald-50 text-emerald-700 ",
      },
      inactive: {
        label: this.translationService.translate("inactive"),
        classes: "bg-red-50 text-red-700 ",
      },
    };

    return configs[this.status] || configs.pending;
  }

  getSizeClasses() {
    const sizes = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-3 py-1.5 text-xs",
      lg: "px-4 py-2 text-sm",
    };
    return sizes[this.size];
  }

  getBaseClasses(): string {
    const config = this.getStatusConfig();
    const sizeClasses = this.getSizeClasses();
    return `inline-flex items-center gap-1.5  rounded-full font-semibold ${config.classes} ${sizeClasses}`;
  }
}
