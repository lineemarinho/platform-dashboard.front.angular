import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastService } from "../../core/services/toast.service";
import { TranslationService } from "../../core/services/translation.service";
import { WithdrawalsService } from "../../core/services/withdrawals.service";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { AppInputComponent } from "../../shared/components/app-input/app-input.component";
import {
  AppSelectComponent,
  SelectOption,
} from "../../shared/components/app-select/app-select.component";
import {
  AppTableComponent,
  TableColumn,
} from "../../shared/components/app-table/app-table.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { LocalePipe } from "../../shared/pipes/locale.pipe";
import {
  FilterBuilderUtil,
  FilterCondition,
  FilterGroup,
} from "../../shared/utils/filter-builder.util";

@Component({
  selector: "app-withdrawals",
  templateUrl: "./withdrawals.component.html",
  styleUrls: ["./withdrawals.component.css"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageTitleComponent,
    AppInputComponent,
    AppSelectComponent,
    AppButtonComponent,
    AppTableComponent,
    LocalePipe,
  ],
})
export class WithdrawalsComponent implements OnInit {
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  isLoading = false;

  withdrawals = [] as WithdrawalRow[];

  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  statusOptions: SelectOption[] = [
    { value: "approved", label: "approved" },
    { value: "pending", label: "pending" },
    { value: "rejected", label: "rejected" },
    { value: "cancelled", label: "cancelled" },
  ];

  sortOptions: SelectOption[] = [];
  paymentMethodOptions: SelectOption[] = [];

  tableColumns: TableColumn[] = [
    { key: "id", label: "id", type: "id" },
    { key: "fullName", label: "fullName", type: "text" },
    { key: "status", label: "status", type: "status" },
    { key: "operationType", label: "operationType", type: "text" },
    { key: "currency", label: "currency", type: "currency" },
    { key: "requestedValue", label: "requestedValue", type: "money" },
    { key: "value", label: "value", type: "money" },
    { key: "createdAt", label: "createdAt", type: "text" },
  ];

  get tableRows(): WithdrawalRow[] {
    return this.withdrawals;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private translationService: TranslationService,
    private toastService: ToastService,
    private withdrawalsService: WithdrawalsService
  ) {
    this.filterForm = this.fb.group({
      startDate: [""],
      endDate: [""],
      status: [""],
      sortBy: [""],
      document: [""],
      paymentMethod: [""],
      e2eId: [""],
    });
  }

  ngOnInit(): void {
    this.updateAllOptions();
    this.updateTableColumns();

    this.translationService.currentLocale$.subscribe(() => {
      this.updateAllOptions();
      this.updateTableColumns();
    });

    this.loadWithdrawals();
  }

  updateAllOptions(): void {
    this.updateStatusOptions();
    this.updateSortOptions();
    this.updatePaymentMethodOptions();
  }

  updateStatusOptions(): void {
    this.statusOptions = [
      {
        value: "approved",
        label: this.translationService.translate("approved"),
      },
      { value: "pending", label: this.translationService.translate("pending") },
      {
        value: "rejected",
        label: this.translationService.translate("rejected"),
      },
      {
        value: "cancelled",
        label: this.translationService.translate("cancelled"),
      },
    ];
  }

  updateSortOptions(): void {
    this.sortOptions = [
      {
        value: "dateDesc",
        label: this.translationService.translate("dateDesc"),
      },
      {
        value: "dateAsc",
        label: this.translationService.translate("dateAsc"),
      },
      {
        value: "valueDesc",
        label: this.translationService.translate("valueDesc"),
      },
      {
        value: "valueAsc",
        label: this.translationService.translate("valueAsc"),
      },
      {
        value: "nameAsc",
        label: this.translationService.translate("nameAsc"),
      },
      {
        value: "nameDesc",
        label: this.translationService.translate("nameDesc"),
      },
    ];
  }

  updatePaymentMethodOptions(): void {
    this.paymentMethodOptions = [
      {
        value: "all",
        label: this.translationService.translate("all"),
      },
      {
        value: "pix",
        label: this.translationService.translate("pix"),
      },
      {
        value: "bankTransfer",
        label: this.translationService.translate("bankTransfer"),
      },
      {
        value: "creditCard",
        label: this.translationService.translate("creditCard"),
      },
      {
        value: "debitCard",
        label: this.translationService.translate("debitCard"),
      },
      {
        value: "boleto",
        label: this.translationService.translate("boleto"),
      },
    ];
  }

  updateTableColumns(): void {
    this.tableColumns = [
      { key: "id", label: this.translationService.translate("id"), type: "id" },
      {
        key: "fullName",
        label: this.translationService.translate("fullName"),
        type: "text",
      },
      {
        key: "status",
        label: this.translationService.translate("status"),
        type: "status",
      },
      {
        key: "operationType",
        label: this.translationService.translate("operationType"),
        type: "text",
      },
      {
        key: "currency",
        label: this.translationService.translate("currency"),
        type: "currency",
      },
      {
        key: "requestedValue",
        label: this.translationService.translate("requestedValue"),
        type: "money",
      },
      {
        key: "value",
        label: this.translationService.translate("value"),
        type: "money",
      },
      {
        key: "createdAt",
        label: this.translationService.translate("createdAt"),
        type: "text",
      },
    ];
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadWithdrawals();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadWithdrawals();
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }

  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return Object.values(formValue).some(
      (value) => value !== null && value !== "" && value !== undefined
    );
  }

  getActiveFiltersCount(): number {
    const formValue = this.filterForm.value;
    return Object.values(formValue).filter(
      (value) => value !== null && value !== "" && value !== undefined
    ).length;
  }

  onViewDetails = (row: WithdrawalRow): void => {
    this.router.navigate(["/withdrawals", row.id]).then(
      (success) => {},
      (error) => {}
    );
  };

  mapRowToColumns = (row: WithdrawalRow): string[] => {
    const result = [
      row.id,
      row.fullName,
      row.status,
      row.operationType,
      row.currency,
      row.requestedValue,
      row.value,
      row.createdAt,
    ];

    return result;
  };

  private buildApiFilters(): (FilterCondition | FilterGroup)[] {
    const formValue = this.filterForm.value as any;
    const filters: (FilterCondition | FilterGroup)[] = [];

    if (formValue.startDate || formValue.endDate) {
      const dateFilters = FilterBuilderUtil.buildDateRangeFilter(
        "createdAt",
        "createdAt",
        formValue.startDate,
        formValue.endDate
      );
      filters.push(...dateFilters);
    }

    if (formValue.status) {
      const statusValue = String(formValue.status).toUpperCase();
      const statusFilter = FilterBuilderUtil.buildSelectFilter(
        "status",
        statusValue
      );
      if (statusFilter) filters.push(statusFilter);
    }

    return FilterBuilderUtil.buildFinalFilters(filters);
  }

  private loadWithdrawals(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;
    const apiFilters = this.buildApiFilters();

    this.withdrawalsService.getWithdrawals(skip, take, apiFilters).subscribe({
      next: (response) => {
        this.withdrawals = response.data as unknown as WithdrawalRow[];
        this.totalItems = response.data.length;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.toastService.error(
          this.translationService.translate("errorLoadingData") ||
            "Erro ao carregar withdrawals"
        );
      },
    });
  }
}
