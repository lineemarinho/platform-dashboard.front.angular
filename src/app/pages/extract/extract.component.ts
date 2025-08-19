import { CommonModule } from "@angular/common";
import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Subject } from "rxjs";
import { TranslationService } from "../../core/services/translation.service";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { AppTableComponent } from "../../shared/components/app-table/app-table.component";
import {
  BalanceCard,
  BalanceCardsComponent,
} from "../../shared/components/balance-cards/balance-cards.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { LocalePipe } from "../../shared/pipes/locale.pipe";
import {
  ReceiptComponent,
  ReceiptData,
} from "./components/receipt/receipt.component";

export interface ExtractRow {
  id: string;
  date: string;
  description: string;
  type: string;
  value: number;
  balance: number;
  detailedDescription?: string;
  referenceId?: string;
  accountType?: string;
  bank?: string;
  operationType?: string;
}

export interface ExpandedRowData {
  [key: string]: string | number;
}

export interface FilterOption {
  key: string;
  label: string;
  checked: boolean;
}

export interface DateOption {
  key: string;
  label: string;
  days?: number;
}

@Component({
  selector: "app-extract",
  templateUrl: "./extract.component.html",
  styleUrls: ["./extract.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    PageTitleComponent,
    AppButtonComponent,
    AppTableComponent,
    BalanceCardsComponent,
    LocalePipe,
    FormsModule,
    ReceiptComponent,
  ],
})
export class ExtractComponent implements OnInit, OnDestroy {
  tableColumns: any[] = [];
  tableRows: ExtractRow[] = [];
  showFiltersDropdown = false;
  showDateDropdown = false;
  showCustomDateInputs = false;
  selectedDateOption = "last60Days";
  customStartDate = "";
  customEndDate = "";
  selectedBalanceCardId = "brl";
  balanceCards: BalanceCard[] = [
    {
      id: "brl",
      currency: "BRL",
      amount: "R$ 104.159,94",
      icon: "assets/flags/brl.svg",
      isActive: true,
    },
    {
      id: "usdt",
      currency: "USDT",
      amount: "USDT 3.890,86",
      icon: "assets/flags/usdt.svg",
      isActive: false,
    },
    {
      id: "ars",
      currency: "ARS",
      amount: "ARS 598.532,00",
      icon: "assets/flags/ars.svg",
      isActive: false,
    },
  ];
  filterOptions: FilterOption[] = [
    { key: "receipts", label: "Comprovantes", checked: true },
    { key: "payments", label: "Pagamentos", checked: false },
    { key: "pix", label: "Pix", checked: false },
    { key: "outflows", label: "Saídas", checked: false },
    { key: "inflows", label: "Entradas", checked: false },
    { key: "transfers", label: "Transferências", checked: false },
  ];
  dateOptions: DateOption[] = [
    { key: "last15Days", label: "Últimos 15 dias", days: 15 },
    { key: "last30Days", label: "Últimos 30 dias", days: 30 },
    { key: "last60Days", label: "Últimos 60 dias", days: 60 },
    { key: "last90Days", label: "Últimos 90 dias", days: 90 },
    { key: "last180Days", label: "Últimos 180 dias", days: 180 },
    { key: "last365Days", label: "Últimos 365 dias", days: 365 },
    { key: "customPeriod", label: "Personalizar período" },
  ];
  private destroy$ = new Subject<void>();
  isReceiptOpen = false;
  currentReceiptData: ReceiptData | null = null;

  constructor(private translationService: TranslationService) {}

  ngOnInit(): void {
    this.loadSampleData();
    this.updateTableColumns();

    this.translationService.currentLocale$.subscribe(() => {
      this.updateTableColumns();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateTableColumns(): void {
    this.tableColumns = [
      {
        key: "date",
        label: this.translationService.translate("date"),
        type: "text",
      },
      {
        key: "description",
        label: this.translationService.translate("description"),
        type: "text",
      },
      {
        key: "type",
        label: this.translationService.translate("type"),
        type: "text",
      },
      {
        key: "value",
        label: this.translationService.translate("value"),
        type: "money",
      },
      {
        key: "balance",
        label: this.translationService.translate("balance"),
        type: "money",
      },
    ];
  }

  loadSampleData(): void {
    this.tableRows = [
      {
        id: "1",
        date: "2024-01-15",
        description: "Transferência PIX recebida",
        type: "Crédito",
        value: 1500.0,
        balance: 104159.94,
        detailedDescription: "Transferência PIX de João Silva",
        referenceId: "PIX123456789",
        accountType: "Conta Corrente",
        bank: "Banco do Brasil",
        operationType: "PIX",
      },
      {
        id: "2",
        date: "2024-01-14",
        description: "Pagamento de boleto",
        type: "Débito",
        value: -250.0,
        balance: 102659.94,
        detailedDescription: "Pagamento de boleto - Conta de luz",
        referenceId: "BOL987654321",
        accountType: "Conta Corrente",
        bank: "Banco do Brasil",
        operationType: "Boleto",
      },
      {
        id: "3",
        date: "2024-01-13",
        description: "Saque em caixa eletrônico",
        type: "Débito",
        value: -500.0,
        balance: 102909.94,
        detailedDescription: "Saque realizado no caixa 24h",
        referenceId: "SAQ456789123",
        accountType: "Conta Corrente",
        bank: "Banco do Brasil",
        operationType: "Saque",
      },
    ];
  }

  columnMap(row: ExtractRow): any[] {
    return [row.date, row.description, row.type, row.value, row.balance];
  }

  expandedDataMap(row: ExtractRow): ExpandedRowData {
    return {
      detailedDescription: row.detailedDescription || "",
      referenceId: row.referenceId || "",
      accountType: row.accountType || "",
      bank: row.bank || "",
      operationType: row.operationType || "",
    };
  }

  openReceipt(row: ExtractRow): void {
    this.currentReceiptData = {
      transactionId: "E318724495202507171309E4cuMtdAKKJ",
      authenticationCode: "01KOC852NNQNNSHP9CX5APHPXC",
      transferValue: row.value,
      transactionDate: new Date(row.date),
      beneficiary: "Aline Marinho",
      key: "42124625837",
      bank: "33 - BCO SANTANDER (BRASIL) S.A.",
      reason: "Pagamento licença figma",
      originName: "Renato Asterio",
      originAgency: "***1",
      originAccount: "******2-0",
      originBank: "GOWD",
    };

    this.isReceiptOpen = true;
  }

  closeReceipt(): void {
    this.isReceiptOpen = false;
    this.currentReceiptData = null;
  }

  toggleFiltersDropdown(): void {
    this.showFiltersDropdown = !this.showFiltersDropdown;
  }

  toggleFilterOption(key: string): void {
    const option = this.filterOptions.find((opt) => opt.key === key);
    if (option) {
      option.checked = !option.checked;
    }
  }

  clearFilters(): void {
    this.filterOptions.forEach((option) => {
      option.checked = false;
    });
  }

  applyFilters(): void {
    const selectedFilters = this.filterOptions
      .filter((option) => option.checked)
      .map((option) => option.key);

    this.showFiltersDropdown = false;
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest(".filters-dropdown")) {
      this.showFiltersDropdown = false;
    }
    if (!target.closest(".date-dropdown")) {
      this.showDateDropdown = false;
    }
  }

  toggleDateDropdown(): void {
    this.showDateDropdown = !this.showDateDropdown;
  }

  selectDateOption(key: string): void {
    if (key === "customPeriod") {
      this.showCustomDateInputs = true;
      this.showDateDropdown = false;
      return;
    }

    this.selectedDateOption = key;
    this.showDateDropdown = false;
    this.showCustomDateInputs = false;

    const selectedOption = this.dateOptions.find(
      (option) => option.key === key
    );
    if (selectedOption) {
    }
  }

  applyCustomPeriod(): void {
    if (this.customStartDate && this.customEndDate) {
      this.showCustomDateInputs = false;
    }
  }

  cancelCustomPeriod(): void {
    this.showCustomDateInputs = false;
    this.customStartDate = "";
    this.customEndDate = "";
  }

  getSelectedDateLabel(): string {
    if (this.showCustomDateInputs) {
      return "Personalizar período";
    }

    const selectedOption = this.dateOptions.find(
      (option) => option.key === this.selectedDateOption
    );
    return selectedOption ? selectedOption.label : "Últimos 60 dias";
  }

  onBalanceCardSelected(cardId: string): void {
    this.selectedBalanceCardId = cardId;
  }
}
