import { CommonModule } from "@angular/common";
import { Component, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { CompaniesService } from "../../core/services/companies.service";
import { HoldingsService } from "../../core/services/holdings.service";
import {
  AppButtonComponent,
  AppInputComponent,
  AppSelectComponent,
  AppTableComponent,
  LoadingComponent,
  PageTitleComponent,
  PaginationComponent,
} from "../../shared/components";
import { DocumentType } from "../../shared/enums";
import { AccountHolder, Company } from "../../shared/interfaces";
import { LocalePipe } from "../../shared/pipes/locale.pipe";
import {
  FilterBuilderUtil,
  FilterCondition,
  FilterGroup,
} from "../../shared/utils/filter-builder.util";
import { MaskUtil } from "../../shared/utils/mask.util";

@Component({
  selector: "app-holdings",
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
  templateUrl: "./holdings.component.html",
  styleUrl: "./holdings.component.css",
})
export class HoldingsComponent implements OnInit {
  isLoading = false;
  holdings = signal<AccountHolder[]>([]);
  companies = signal<Company[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  documentTypes = Object.values(DocumentType).map((type) => ({
    value: type,
    label: type,
  }));

  tableColumns = [
    { key: "fullName", label: "Nome completo", type: "text" as const },
    { key: "document", label: "Documento", type: "text" as const },
    { key: "email", label: "Email", type: "text" as const },
    { key: "birthdate", label: "Data de nascimento", type: "date" as const },
    {
      key: "active",
      label: "Status",
      type: "status" as const,
      statusMapping: (status: string) =>
        status === "Ativo" ? "active" : "inactive",
    },
    { key: "phone", label: "Telefone", type: "text" as const },
    { key: "type", label: "Tipo", type: "text" as const },
    { key: "companyId", label: "ID Empresa", type: "id" as const },
    { key: "country", label: "País", type: "country" as const },
    { key: "createdAt", label: "Data de criação", type: "date" as const },
    { key: "updatedAt", label: "Última atualização", type: "date" as const },
  ];

  constructor(
    private holdingsService: HoldingsService,
    private companiesService: CompaniesService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      companyId: [""],
      email: [""],
      documentType: [""],
      document: [""],
      fullName: [""],
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.loadHoldings();
    this.setupDocumentTypeListener();
  }

  setupDocumentTypeListener(): void {
    this.filterForm
      .get("documentType")
      ?.valueChanges.subscribe((documentType) => {
        const documentControl = this.filterForm.get("document");
        if (documentControl && documentControl.value) {
          const maskedValue = MaskUtil.applyDocumentMask(
            documentControl.value,
            documentType
          );
          documentControl.setValue(maskedValue, { emitEvent: false });
        }
      });
  }

  onDocumentInput(event: any): void {
    const documentType = this.filterForm.get("documentType")?.value;
    const inputValue = event.target.value;

    if (documentType && inputValue) {
      const maskedValue = MaskUtil.applyDocumentMask(inputValue, documentType);
      const documentControl = this.filterForm.get("document");
      if (documentControl && documentControl.value !== maskedValue) {
        documentControl.setValue(maskedValue, { emitEvent: false });
      }
    }
  }

  loadCompanies(): void {
    this.companiesService.getCompanies(0, 100).subscribe({
      next: (response) => {
        this.companies.set(response.data);
      },
      error: (error) => {
        console.error("Erro ao carregar companies:", error);
      },
    });
  }

  get companyOptions() {
    return this.companies().map((company) => ({
      value: company.id,
      label: company.name,
    }));
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadHoldings();
  }

  private buildApiFilters(): (FilterCondition | FilterGroup)[] {
    const formValue = this.filterForm.value;
    const filters: (FilterCondition | FilterGroup)[] = [];

    if (formValue.companyId && formValue.companyId !== "") {
      const companyFilter = FilterBuilderUtil.buildSelectFilter(
        "companyId",
        formValue.companyId
      );
      if (companyFilter) filters.push(companyFilter);
    }

    if (formValue.email && formValue.email.trim() !== "") {
      const emailFilter = FilterBuilderUtil.buildTextFilter(
        "email",
        formValue.email
      );
      if (emailFilter) filters.push(emailFilter);
    }

    if (formValue.fullName && formValue.fullName.trim() !== "") {
      const nameFilter = FilterBuilderUtil.buildTextFilter(
        "fullName",
        formValue.fullName
      );
      if (nameFilter) filters.push(nameFilter);
    }

    if (formValue.documentType || formValue.document) {
      const documentFilters = FilterBuilderUtil.buildDocumentFilter(
        formValue.documentType,
        formValue.document
      );
      filters.push(...documentFilters);
    }

    return FilterBuilderUtil.buildFinalFilters(filters);
  }

  loadHoldings(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;
    const apiFilters = this.buildApiFilters();

    this.holdingsService.getHoldings(skip, take, apiFilters).subscribe({
      next: (response) => {
        this.holdings.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar holdings:", error);
        this.isLoading = false;
      },
    });
  }

  get tableRows(): AccountHolder[] {
    return this.holdings();
  }

  mapRowToColumns = (accountHolder: AccountHolder) => [
    accountHolder.fullName,
    `${accountHolder.document.type}: ${accountHolder.document.number}`,
    accountHolder.email,
    accountHolder.birthdate
      ? new Date(accountHolder.birthdate).toLocaleDateString("pt-BR")
      : "N/A",
    accountHolder.active ? "Ativo" : "Inativo",
    accountHolder.phone || "N/A",
    accountHolder.type,
    accountHolder.companyId,
    accountHolder.country,
    accountHolder.createdAt
      ? new Date(accountHolder.createdAt).toLocaleDateString("pt-BR")
      : "N/A",
    accountHolder.updatedAt
      ? new Date(accountHolder.updatedAt).toLocaleDateString("pt-BR")
      : "N/A",
  ];

  onViewDetails(accountHolder: AccountHolder): void {
    this.router.navigate(["/account-holders", accountHolder.id]);
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadHoldings();
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
    const values = this.filterForm.value;
    return Object.values(values).some(
      (value) => value !== "" && value !== null
    );
  }

  getActiveFiltersCount(): number {
    const values = this.filterForm.value;
    return Object.values(values).filter(
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
    if (this.currentPage !== page) {
      this.currentPage = page;
      this.loadHoldings();
    }
  }
}
