import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AmlsService } from "../../core/services/amls.service";
import { AppButtonComponent } from "../../shared/components/app-button/app-button.component";
import { AppInputComponent } from "../../shared/components/app-input/app-input.component";
import { AppSelectComponent } from "../../shared/components/app-select/app-select.component";
import { AppTableComponent } from "../../shared/components/app-table/app-table.component";
import { LoadingComponent } from "../../shared/components/loading/loading.component";
import { PageTitleComponent } from "../../shared/components/page-title/page-title.component";
import { PaginationComponent } from "../../shared/components/pagination/pagination.component";
import { Aml } from "../../shared/interfaces";
import { LocalePipe } from "../../shared/pipes";

@Component({
  selector: "app-amls",
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
  templateUrl: "./amls.component.html",
  styleUrl: "./amls.component.css",
})
export class AmlsComponent implements OnInit {
  isLoading = false;
  amls = signal<Aml[]>([]);
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
    { key: "company", label: "Company", type: "text" as const },
    { key: "currency", label: "Currency", type: "text" as const },
    { key: "userCreated", label: "User Created", type: "text" as const },
    { key: "createdAt", label: "Created At", type: "date" as const },
  ];

  constructor(
    private amlsService: AmlsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      type: [""],
      description: [""],
      status: [""],
      company: [""],
      currency: [""],
    });
  }

  ngOnInit(): void {
    this.loadAmls();
  }

  get tableRows() {
    return this.amls();
  }

  mapRowToColumns = (aml: Aml) => [
    aml.id,
    aml.type,
    aml.description,
    aml.status,
    aml.company?.name || "N/A",
    aml.currency,
    aml.userCreated,
    aml.createdAt ? new Date(aml.createdAt).toLocaleDateString("pt-BR") : "N/A",
  ];

  onViewDetails(aml: Aml): void {
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadAmls();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadAmls();
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
    this.loadAmls();
  }

  loadAmls(): void {
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    this.amlsService.getAmls(skip, take).subscribe({
      next: (response) => {
        this.amls.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
      },
    });
  }
}
