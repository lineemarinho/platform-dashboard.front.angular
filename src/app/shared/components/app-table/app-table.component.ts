import { KeyValuePipe, NgFor, NgIf, NgTemplateOutlet } from "@angular/common";
import { Component, Input, TemplateRef } from "@angular/core";
import { ToastService } from "../../../core/services/toast.service";
import { TranslationService } from "../../../core/services/translation.service";
import { LocalePipe } from "../../pipes/locale.pipe";
import { StatusUtil } from "../../utils/status.util";
import { StatusBadgeComponent } from "../status-badge/status-badge.component";

export interface TableColumn {
  key: string;
  label: string;
  type?:
    | "text"
    | "status"
    | "currency"
    | "money"
    | "date"
    | "id"
    | "actions"
    | "country";
  statusMapping?: (
    status: string
  ) =>
    | "approved"
    | "pending"
    | "rejected"
    | "cancelled"
    | "processing"
    | "paid"
    | "failed"
    | "completed"
    | "active"
    | "inactive";
}

export interface ExpandedRowData {
  [key: string]: string | number;
}

@Component({
  selector: "app-table",
  templateUrl: "./app-table.component.html",
  styleUrls: ["./app-table.component.css"],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgTemplateOutlet,
    KeyValuePipe,
    StatusBadgeComponent,
    LocalePipe,
  ],
})
export class AppTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() columnMap: (row: any) => any[] = () => [];
  @Input() expandedDataMap?: (row: any) => ExpandedRowData;
  @Input() expandedContentTemplate?: TemplateRef<any>;
  @Input() onViewDetails?: (row: any) => void;
  @Input() showActions: boolean = false;

  expandedRows: Set<number> = new Set();

  constructor(
    private toastService: ToastService,
    private translationService: TranslationService
  ) {}

  hasExpandedData(): boolean {
    return this.expandedDataMap !== undefined && this.expandedDataMap !== null;
  }

  toggleExpansion(index: number): void {
    if (this.expandedRows.has(index)) {
      this.expandedRows.delete(index);
    } else {
      this.expandedRows.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedRows.has(index);
  }

  getExpandedData(row: any): ExpandedRowData {
    if (!this.expandedDataMap) {
      return {};
    }
    return this.expandedDataMap(row);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.toastService.success(
          this.translationService.translate("copiedToClipboard"),
          2000
        );
      })
      .catch(() => {
        this.toastService.error(
          this.translationService.translate("copyError"),
          3000
        );
      });
  }

  getRowData(row: any): any[] {
    return this.columnMap(row);
  }

  getStatusType(
    status: string
  ):
    | "approved"
    | "pending"
    | "rejected"
    | "cancelled"
    | "paid"
    | "failed"
    | "processing"
    | "completed"
    | "active"
    | "inactive" {
    return StatusUtil.getStatusType(status);
  }

  getStatusClass(status: string): string {
    return StatusUtil.getStatusClass(status);
  }

  handleViewDetails(row: any, event: Event): void {
    if (this.onViewDetails) {
      event.stopPropagation();
      this.onViewDetails(row);
    }
  }

  getCurrencyIcon(currency: string): string {
    switch (currency.toUpperCase()) {
      case "BRL":
        return "assets/flags/brl.svg";
      case "USD":
        return "assets/flags/usd.svg";
      case "EUR":
        return "assets/flags/eur.svg";
      case "CLP":
        return "assets/flags/clp.svg";
      case "USDT":
        return "assets/flags/usdt.svg";
      case "ARS":
        return "assets/flags/ars.svg";
      case "PEN":
        return "assets/flags/pen.svg";
      case "MXN":
        return "assets/flags/mxn.svg";
      case "COB":
        return "assets/flags/cop.svg";
      default:
        return "assets/flags/usd.svg";
    }
  }

  getCountryFlag(countryCode: string): string {
    switch (countryCode.toUpperCase()) {
      case "BRA":
        return "assets/flags/brl.svg";
      case "ARG":
        return "assets/flags/ars.svg";
      case "CHL":
        return "assets/flags/clp.svg";
      case "COL":
        return "assets/flags/cop.svg";
      case "MEX":
        return "assets/flags/mxn.svg";
      case "PER":
        return "assets/flags/pen.svg";
      case "USA":
        return "assets/flags/usd.svg";
      case "EUR":
        return "assets/flags/eur.svg";
      default:
        return "assets/flags/usd.svg";
    }
  }

  formatId(id: string): string {
    if (!id || id.length < 10) return id;
    return `${id.substring(0, 5)}...${id.substring(id.length - 6)}`;
  }

  shouldShowCopyButton(columnKey: string | undefined): boolean {
    if (!columnKey) return false;
    const copyableFields = [
      "id",
      "email",
      "document",
      "phone",
      "documento",
      "telefone",
      "companyid",
    ];
    return copyableFields.includes(columnKey.toLowerCase());
  }
}
