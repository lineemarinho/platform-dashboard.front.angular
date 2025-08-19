import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ProviderRoutingService } from "../../core/services/provider-routing.service";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { AppInputComponent } from "../../shared/components/app-input/app-input.component";
import { AppSelectComponent } from "../../shared/components/app-select/app-select.component";
import { AppTableComponent } from "../../shared/components/app-table/app-table.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { ProviderRouting } from "../../shared/interfaces";
import { LocalePipe } from "../../shared/pipes";

@Component({
  selector: "app-provider-routing",
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
  templateUrl: "./provider-routing.component.html",
  styleUrl: "./provider-routing.component.css",
})
export class ProviderRoutingComponent implements OnInit {
  isLoading = false;
  providerRoutings = signal<ProviderRouting[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  tableColumns = [
    { key: "id", label: "ID", type: "id" as const },
    { key: "company", label: "Company", type: "text" as const },
    { key: "provider", label: "Provider", type: "text" as const },
    { key: "ruleId", label: "Rule ID", type: "id" as const },
    { key: "paymentMethod", label: "Payment Method", type: "text" as const },
    { key: "accountCode", label: "Account Code", type: "id" as const },
    { key: "priority", label: "Priority", type: "text" as const },
    { key: "enabled", label: "Enabled", type: "status" as const },
    { key: "operationType", label: "Operation Type", type: "text" as const },
    { key: "currency", label: "Currency", type: "text" as const },
    { key: "createdAt", label: "Created At", type: "date" as const },
  ];

  constructor(
    private providerRoutingService: ProviderRoutingService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      company: [""],
      provider: [""],
      paymentMethod: [""],
      operationType: [""],
      currency: [""],
      enabled: [""],
    });
  }

  ngOnInit(): void {
    this.loadProviderRoutings();
  }

  get tableRows() {
    return this.providerRoutings();
  }

  mapRowToColumns = (routing: ProviderRouting) => [
    routing.id,
    routing.company?.name || "N/A",
    routing.provider?.name || "N/A",
    routing.ruleId,
    routing.paymentMethod,
    routing.accountCode,
    routing.priority.toString(),
    routing.enabled ? "Ativo" : "Inativo",
    routing.operationType,
    routing.currency,
    routing.createdAt
      ? new Date(routing.createdAt).toLocaleDateString("pt-BR")
      : "N/A",
  ];

  onViewDetails(routing: ProviderRouting): void {
    console.log("Ver detalhes do provider routing:", routing);
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadProviderRoutings();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadProviderRoutings();
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
    this.loadProviderRoutings();
  }

  loadProviderRoutings(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    this.providerRoutingService.getProviderRoutings(skip, take).subscribe({
      next: (response) => {
        this.providerRoutings.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar provider routings:", error);
        this.isLoading = false;
      },
    });
  }
}
