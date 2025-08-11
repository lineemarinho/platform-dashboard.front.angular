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
    { key: "fullName", label: "Nome Completo", type: "text" as const },
    { key: "document", label: "Documento", type: "text" as const },
    { key: "email", label: "Email", type: "text" as const },
    { key: "country", label: "País", type: "text" as const },
    { key: "type", label: "Tipo", type: "text" as const },
    { key: "status", label: "Status", type: "status" as const },
    { key: "createdAt", label: "Data de Criação", type: "date" as const },
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
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.loadHoldings();
    this.setupDocumentTypeListener();
  }

  setupDocumentTypeListener(): void {
    // Escuta mudanças no tipo de documento para aplicar máscara
    this.filterForm
      .get("documentType")
      ?.valueChanges.subscribe((documentType) => {
        const documentControl = this.filterForm.get("document");
        if (documentControl && documentControl.value) {
          // Aplica a máscara quando o tipo muda
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

    if (documentType) {
      const maskedValue = MaskUtil.applyDocumentMask(inputValue, documentType);
      this.filterForm.get("document")?.setValue(maskedValue);
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

  loadHoldings(): void {
    console.log("Iniciando carregamento...");
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    console.log("Parâmetros:", { skip, take });

    this.holdingsService.getHoldings(skip, take).subscribe({
      next: (response) => {
        console.log("Dados recebidos:", response);
        this.holdings.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
        console.log("Loading finalizado, dados:", this.holdings());
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
    accountHolder.country,
    accountHolder.type,
    accountHolder.active ? "Ativo" : "Inativo",
    accountHolder.createdAt
      ? new Date(accountHolder.createdAt).toLocaleDateString("pt-BR")
      : "N/A",
  ];

  onViewDetails(accountHolder: AccountHolder): void {
    this.router.navigate(["/account-holders", accountHolder.id]);
  }

  onFilter(): void {
    // Implementar filtros
    this.loadHoldings();
  }

  onClear(): void {
    this.filterForm.reset();
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
    this.currentPage = page;
    this.loadHoldings();
  }
}
