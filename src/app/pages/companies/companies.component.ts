import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { CompaniesService } from "../../core/services/companies.service";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { AppInputComponent } from "../../shared/components/app-input/app-input.component";
import { AppSelectComponent } from "../../shared/components/app-select/app-select.component";
import { AppTableComponent } from "../../shared/components/app-table/app-table.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { Company } from "../../shared/interfaces";
import { LocalePipe } from "../../shared/pipes";

@Component({
  selector: "app-companies",
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
  templateUrl: "./companies.component.html",
  styleUrl: "./companies.component.css",
})
export class CompaniesComponent implements OnInit {
  isLoading = false;
  companies = signal<Company[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  tableColumns = [
    { key: "id", label: "ID", type: "id" as const },
    { key: "name", label: "Name", type: "text" as const },
    { key: "status", label: "Status", type: "status" as const },
    { key: "country", label: "Country", type: "text" as const },
    { key: "document", label: "Document", type: "text" as const },
    { key: "accounts", label: "Accounts", type: "text" as const },
    { key: "holding", label: "Holding", type: "id" as const },
    { key: "createdAt", label: "Created At", type: "date" as const },
  ];

  constructor(
    private companiesService: CompaniesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      name: [""],
      status: [""],
      country: [""],
      document: [""],
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  get tableRows() {
    return this.companies();
  }

  mapRowToColumns = (company: Company) => [
    company.id,
    company.name,
    company.status,
    company.country,
    `${company.document?.type || "N/A"}: ${company.document?.number || "N/A"}`,
    `${company.accounts?.length || 0} accounts`,
    company.holding?.id || "N/A",
    company.createdAt
      ? new Date(company.createdAt).toLocaleDateString("pt-BR")
      : "N/A",
  ];

  onViewDetails(company: Company): void {
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadCompanies();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadCompanies();
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
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    this.companiesService.getCompanies(skip, take).subscribe({
      next: (response) => {
        this.companies.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
}
