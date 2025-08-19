import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { PayinsService } from "../../core/services/payins.service";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { AppInputComponent } from "../../shared/components/app-input/app-input.component";
import { AppSelectComponent } from "../../shared/components/app-select/app-select.component";
import { AppTableComponent } from "../../shared/components/app-table/app-table.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";

import { Payin } from "../../shared/interfaces/payin.interface";
import { LocalePipe } from "../../shared/pipes";
import {
  FilterBuilderUtil,
  FilterCondition,
  FilterGroup,
} from "../../shared/utils/filter-builder.util";

@Component({
  selector: "app-payins",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LocalePipe,
    AppTableComponent,
    PaginationComponent,
    PageTitleComponent,
    LoadingComponent,
    AppButtonComponent,
    AppInputComponent,
    AppSelectComponent,
  ],
  templateUrl: "./payins.component.html",
  styleUrl: "./payins.component.css",
})
export class PayinsComponent implements OnInit {
  isLoading = false;
  payins = signal<Payin[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;
  private isInitialLoad = true;

  tableColumns = [
    { key: "id", label: "ID", type: "text" as const },
    { key: "code", label: "Code", type: "text" as const },
    {
      key: "status",
      label: "Status",
      type: "status" as const,
      statusMapping: (status: string) => this.getStatusTypeForBadge(status),
    },
    { key: "company", label: "Company", type: "text" as const },
    { key: "customer", label: "Customer", type: "text" as const },
    { key: "paymentMethod", label: "Payment Method", type: "text" as const },
    { key: "amount", label: "Amount", type: "text" as const },
    {
      key: "financialPartner",
      label: "Financial Partner",
      type: "text" as const,
    },
    { key: "origin", label: "Origin", type: "text" as const },
    { key: "createdAt", label: "Created At", type: "text" as const },
  ];

  searchByOptions = [
    { value: "code", label: "Código" },
    { value: "company", label: "Empresa" },
    { value: "customer", label: "Cliente" },
    { value: "paymentMethod", label: "Método de pagamento" },
    { value: "financialPartner", label: "Parceiro financeiro" },
  ];

  statusOptions = [
    { value: "ANALYSIS", label: "Análise" },
    { value: "CANCELED", label: "Cancelado" },
    { value: "ERROR", label: "Erro" },
    { value: "EXPIRED", label: "Expirado" },
    { value: "INITIAL", label: "Inicial" },
    { value: "PAID", label: "Pago" },
    { value: "PARTIAL_REFUNDED", label: "Reembolso Parcial" },
    { value: "PENDING", label: "Pendente" },
    { value: "REFUNDED", label: "Reembolsado" },
  ];

  constructor(
    private payinsService: PayinsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      startDate: [""],
      endDate: [""],
      searchBy: [""],
      status: [""],
      idempotencyKey: [""],
      e2eId: [""],
    });
  }

  ngOnInit(): void {
    this.loadPayins();
  }

  get tableRows() {
    return this.payins();
  }

  get viewDetailsHandler() {
    return (payin: Payin) => this.onViewDetails(payin);
  }

  mapRowToColumns = (payin: Payin) => {
    return [
      payin.id,
      payin.code,
      this.getStatusDisplay(payin.status),
      payin.company?.name || "N/A",
      payin.customer?.fullName || "N/A",
      payin.paymentMethod,
      `${payin.amount?.currency || ""} ${payin.amount?.value || "N/A"}`.trim(),
      payin.financialPartner || "N/A",
      payin.origin || "N/A",
      payin.createdAt || "N/A",
    ];
  };

  onViewDetails(payin: Payin): void {
    this.router.navigate(["/payins/details", payin.id]);
  }

  onFilter(): void {
    if (this.isInitialLoad) {
      this.isInitialLoad = false;
      return;
    }

    this.currentPage = 1;
    this.loadPayins();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.isInitialLoad = false;
    this.loadPayins();
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }

  onFilterAndClose(): void {
    this.onFilter();
    this.isMobileFiltersOpen = false;
  }

  onClearAndClose(): void {
    this.onClear();
    this.isMobileFiltersOpen = false;
  }

  hasActiveFilters(): boolean {
    return Object.values(this.filterForm.value).some(
      (value) => value !== "" && value !== null
    );
  }

  getActiveFiltersCount(): number {
    return Object.values(this.filterForm.value).filter(
      (value) => value !== "" && value !== null
    ).length;
  }

  get paginationInfo() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    return {
      currentPage: this.currentPage,
      totalItems: this.totalItems,
      itemsPerPage: this.itemsPerPage,
      totalPages,
      hasNextPage: this.currentPage < totalPages,
      hasPreviousPage: this.currentPage > 1,
    };
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPayins();
  }

  private buildApiFilters(): (FilterCondition | FilterGroup)[] {
    const formValue = this.filterForm.value;
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

    if (formValue.searchBy && formValue.searchBy !== "") {
      const searchFilter = FilterBuilderUtil.buildTextFilter(
        formValue.searchBy,
        formValue.searchBy
      );
      if (searchFilter) filters.push(searchFilter);
    }

    if (formValue.status) {
      const statusFilter = FilterBuilderUtil.buildSelectFilter(
        "status",
        formValue.status
      );
      if (statusFilter) filters.push(statusFilter);
    }

    if (formValue.idempotencyKey) {
      const idempotencyFilter = FilterBuilderUtil.buildTextFilter(
        "idempotencyKey",
        formValue.idempotencyKey
      );
      if (idempotencyFilter) filters.push(idempotencyFilter);
    }

    if (formValue.e2eId) {
      const e2eFilter = FilterBuilderUtil.buildTextFilter(
        "e2eId",
        formValue.e2eId
      );
      if (e2eFilter) filters.push(e2eFilter);
    }

    return FilterBuilderUtil.buildFinalFilters(filters);
  }

  private getStatusDisplay(status: string): string {
    const cleanStatus = status?.trim()?.toUpperCase();

    const statusMap: { [key: string]: string } = {
      ANALYSIS: "Análise",
      CANCELED: "Cancelado",
      ERROR: "Erro",
      EXPIRED: "Expirado",
      INITIAL: "Inicial",
      PAID: "Pago",
      PARTIAL_REFUNDED: "Reembolso Parcial",
      PENDING: "Pendente",
      REFUNDED: "Reembolsado",
    };

    return statusMap[cleanStatus] || status;
  }

  private getStatusTypeForBadge(
    statusPortuguese: string
  ):
    | "approved"
    | "pending"
    | "rejected"
    | "cancelled"
    | "processing"
    | "completed"
    | "active"
    | "inactive" {
    const statusMap: {
      [key: string]:
        | "approved"
        | "pending"
        | "rejected"
        | "cancelled"
        | "processing"
        | "completed"
        | "active"
        | "inactive";
    } = {
      Análise: "processing",
      Cancelado: "cancelled",
      Erro: "rejected",
      Expirado: "rejected",
      Inicial: "pending",
      Pago: "completed",
      "Reembolso Parcial": "processing",
      Pendente: "pending",
      Reembolsado: "cancelled",
    };

    return statusMap[statusPortuguese] || "pending";
  }

  loadPayins(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    const apiFilters = this.buildApiFilters();

    this.payinsService.getPayins(skip, take, apiFilters).subscribe({
      next: (response) => {
        this.payins.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar payins:", error);
        this.isLoading = false;
      },
    });
  }
}
