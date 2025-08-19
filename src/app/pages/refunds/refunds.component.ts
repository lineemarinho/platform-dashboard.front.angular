import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { RefundsService } from "../../core/services/refunds.service";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { AppInputComponent } from "../../shared/components/app-input/app-input.component";
import { AppTableComponent } from "../../shared/components/app-table/app-table.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { Refund } from "../../shared/interfaces";
import { LocalePipe } from "../../shared/pipes";
import {
  FilterBuilderUtil,
  FilterCondition,
  FilterGroup,
} from "../../shared/utils/filter-builder.util";

@Component({
  selector: "app-refunds",
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
  ],
  templateUrl: "./refunds.component.html",
  styleUrl: "./refunds.component.css",
})
export class RefundsComponent implements OnInit {
  isLoading = false;
  refunds = signal<Refund[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  tableColumns = [
    { key: "id", label: "ID", type: "id" as const },
    { key: "orderId", label: "Order ID", type: "id" as const },
    { key: "company", label: "Company", type: "text" as const },
    { key: "provider", label: "Provider", type: "text" as const },
    { key: "channel", label: "Channel", type: "text" as const },
    { key: "requester", label: "Requester", type: "text" as const },
    { key: "status", label: "Status", type: "status" as const },
    { key: "amount", label: "Amount", type: "money" as const },
    { key: "reason", label: "Reason", type: "text" as const },
    { key: "createdAt", label: "Created At", type: "date" as const },
  ];

  constructor(
    private refundsService: RefundsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      startDate: [""],
      endDate: [""],
      refundId: [""],
      refundE2E: [""],
      orderId: [""],
      orderE2E: [""],
    });
  }

  ngOnInit(): void {
    this.loadRefunds();
  }

  get tableRows() {
    return this.refunds();
  }

  mapRowToColumns = (refund: Refund) => [
    refund.id,
    refund.order?.id || "N/A",
    refund.order?.company?.name || "N/A",
    refund.provider,
    refund.channel,
    refund.requester?.name || "N/A",
    refund.status,
    `${refund.order?.amount?.currency || "N/A"} ${
      refund.order?.amount?.value || "N/A"
    }`,
    refund.reason,
    refund.createdAt
      ? new Date(refund.createdAt).toLocaleDateString("pt-BR")
      : "N/A",
  ];

  onViewDetails(refund: Refund): void {
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadRefunds();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadRefunds();
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
    this.loadRefunds();
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

    if (formValue.refundId) {
      const refundIdFilter = FilterBuilderUtil.buildTextFilter(
        "id",
        formValue.refundId
      );
      if (refundIdFilter) filters.push(refundIdFilter);
    }

    if (formValue.refundE2E) {
      const refundE2EFilter = FilterBuilderUtil.buildTextFilter(
        "e2eId",
        formValue.refundE2E
      );
      if (refundE2EFilter) filters.push(refundE2EFilter);
    }

    if (formValue.orderId) {
      const orderIdFilter = FilterBuilderUtil.buildTextFilter(
        "orderId",
        formValue.orderId
      );
      if (orderIdFilter) filters.push(orderIdFilter);
    }

    if (formValue.orderE2E) {
      const orderE2EFilter = FilterBuilderUtil.buildTextFilter(
        "order.e2eId",
        formValue.orderE2E
      );
      if (orderE2EFilter) filters.push(orderE2EFilter);
    }

    return FilterBuilderUtil.buildFinalFilters(filters);
  }

  loadRefunds(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    const apiFilters = this.buildApiFilters();

    this.refundsService.getRefunds(skip, take, apiFilters).subscribe({
      next: (response) => {
        this.refunds.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
}
