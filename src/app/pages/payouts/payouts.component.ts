import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { PayoutsService } from "../../core/services/payouts.service";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { AppInputComponent } from "../../shared/components/app-input/app-input.component";
import { AppSelectComponent } from "../../shared/components/app-select/app-select.component";
import { AppTableComponent } from "../../shared/components/app-table/app-table.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { Payout } from "../../shared/interfaces";
import { LocalePipe } from "../../shared/pipes";
import {
  FilterBuilderUtil,
  FilterCondition,
  FilterGroup,
} from "../../shared/utils/filter-builder.util";
import { StatusUtil } from "../../shared/utils/status.util";

@Component({
  selector: "app-payouts",
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
  templateUrl: "./payouts.component.html",
  styleUrl: "./payouts.component.css",
})
export class PayoutsComponent implements OnInit {
  isLoading = false;
  payouts = signal<Payout[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  tableColumns = [
    { key: "id", label: "ID", type: "id" as const },
    { key: "code", label: "Code", type: "id" as const },
    {
      key: "status",
      label: "Status",
      type: "status" as const,
      statusMapping: (status: string) => this.getStatusTypeForBadge(status),
    },
    { key: "company", label: "Company", type: "text" as const },
    { key: "senderAccount", label: "Sender Account", type: "text" as const },
    {
      key: "receiverAccount",
      label: "Receiver Account",
      type: "text" as const,
    },
    { key: "paymentMethod", label: "Payment Method", type: "text" as const },
    { key: "amount", label: "Amount", type: "money" as const },
    {
      key: "financialPartner",
      label: "Financial Partner",
      type: "text" as const,
    },
    { key: "origin", label: "Origin", type: "text" as const },
    { key: "createdAt", label: "Created At", type: "date" as const },
  ];

  searchByOptions = [
    { value: "code", label: "Código" },
    { value: "company", label: "Empresa" },
    { value: "senderAccount", label: "Conta remetente" },
    { value: "receiverAccount", label: "Conta destinatário" },
    { value: "paymentMethod", label: "Método de pagamento" },
    { value: "financialPartner", label: "Parceiro financeiro" },
  ];

  statusOptions = StatusUtil.getPaymentStatusOptions();

  constructor(
    private payoutsService: PayoutsService,
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
    this.loadPayouts();
  }

  get tableRows() {
    return this.payouts();
  }

  get viewDetailsHandler() {
    return (payout: Payout) => this.onViewDetails(payout);
  }

  mapRowToColumns = (payout: Payout) => {
    const createdAt = payout.createdAt
      ? new Date(payout.createdAt).toLocaleDateString("pt-BR")
      : "N/A";

    console.log("Payout createdAt:", payout.createdAt, "Formatted:", createdAt);

    return [
      payout.id,
      payout.code,
      payout.status,
      payout.company?.name || "N/A",
      payout.senderAccount?.fullName || "N/A",
      payout.receiverAccount?.fullName || "N/A",
      payout.paymentMethod,
      `${payout.amount?.currency || "N/A"} ${payout.amount?.value || "N/A"}`,
      payout.financialPartner || "N/A",
      payout.origin || "N/A",
      createdAt,
    ];
  };

  onViewDetails(payout: Payout): void {
    if (!payout || !payout.id) {
      console.error("Payout ou ID inválido:", payout);
      return;
    }

    this.router.navigate(["/payouts/details", payout.id]);
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadPayouts();
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

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadPayouts();
  }

  private getStatusTypeForBadge(
    status: string
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
      PAID: "completed",
      PENDING: "pending",
      PROCESSING: "processing",
      COMPLETED: "completed",
      CANCELLED: "cancelled",
      FAILED: "rejected",
      ERROR: "rejected",
      REFUNDED: "cancelled",
      PARTIAL_REFUNDED: "processing",
      EXPIRED: "rejected",
      ANALYSIS: "processing",
      INITIAL: "pending",
    };

    return statusMap[status?.toUpperCase()] || "pending";
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
    this.loadPayouts();
  }

  loadPayouts(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    const apiFilters = this.buildApiFilters();

    this.payoutsService.getPayouts(skip, take, apiFilters).subscribe({
      next: (response) => {
        this.payouts.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
}
