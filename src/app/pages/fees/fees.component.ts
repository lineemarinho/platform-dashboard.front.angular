import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { FeesService } from "../../core/services/fees.service";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { AppInputComponent } from "../../shared/components/app-input/app-input.component";
import { AppSelectComponent } from "../../shared/components/app-select/app-select.component";
import { AppTableComponent } from "../../shared/components/app-table/app-table.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { Fee } from "../../shared/interfaces";
import { LocalePipe } from "../../shared/pipes";

@Component({
  selector: "app-fees",
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
  templateUrl: "./fees.component.html",
  styleUrl: "./fees.component.css",
})
export class FeesComponent implements OnInit {
  isLoading = false;
  fees = signal<Fee[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  tableColumns = [
    { key: "id", label: "ID", type: "id" as const },
    { key: "type", label: "Type", type: "text" as const },
    { key: "description", label: "Description", type: "text" as const },
    { key: "status", label: "Status", type: "status" as const },
    { key: "currency", label: "Currency", type: "text" as const },
    { key: "operationType", label: "Operation Type", type: "text" as const },
    { key: "companyName", label: "Company", type: "text" as const },
    { key: "startDatetime", label: "Start Date", type: "date" as const },
    { key: "endDatetime", label: "End Date", type: "date" as const },
  ];

  constructor(
    private feesService: FeesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      type: [""],
      description: [""],
      status: [""],
      currency: [""],
      operationType: [""],
      companyName: [""],
    });
  }

  ngOnInit(): void {
    this.loadFees();
  }

  get tableRows() {
    return this.fees();
  }

  mapRowToColumns = (fee: Fee) => [
    fee.id,
    fee.type,
    fee.description,
    fee.status,
    fee.currency,
    fee.operationType,
    fee.companyName || "N/A",
    new Date(fee.startDatetime).toLocaleDateString("pt-BR"),
    new Date(fee.endDatetime).toLocaleDateString("pt-BR"),
  ];

  onViewDetails(fee: Fee): void {}

  onFilter(): void {
    this.currentPage = 1;
    this.loadFees();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadFees();
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
    this.loadFees();
  }

  loadFees(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    this.feesService.getFees(skip, take).subscribe({
      next: (response) => {
        this.fees.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar fees:", error);
        this.isLoading = false;
      },
    });
  }
}
