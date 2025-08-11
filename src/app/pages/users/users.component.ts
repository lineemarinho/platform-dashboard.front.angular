import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';
import { AppSelectComponent } from '../../shared/components/app-select/app-select.component';
import { AppTableComponent } from '../../shared/components/app-table/app-table.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { User } from '../../shared/interfaces';
import { LocalePipe } from '../../shared/pipes';

@Component({
  selector: 'app-users',
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
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit {
  isLoading = false;
  users = signal<User[]>([]);
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;

  tableColumns = [
    { key: 'id', label: 'ID', type: 'id' as const },
    { key: 'name', label: 'Name', type: 'text' as const },
    { key: 'email', label: 'Email', type: 'text' as const },
    { key: 'status', label: 'Status', type: 'status' as const },
    { key: 'origin', label: 'Origin', type: 'text' as const },
    { key: 'createdBy', label: 'Created By', type: 'text' as const },
    { key: 'permissionGroups', label: 'Permission Groups', type: 'text' as const },

  ];

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.filterForm = this.formBuilder.group({
      name: [''],
      email: [''],
      status: [''],
      origin: [''],
      createdBy: [''],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  get tableRows() {
    return this.users();
  }

  mapRowToColumns = (user: User) => [
    user.id,
    user.name,
    user.email,
    user.status,
    user.origin,
    user.createdBy || 'N/A',
    user.permissionGroups || 'N/A',
  ];

  onViewDetails(user: User): void {
    console.log('Ver detalhes do usuário:', user);
    // Implementar navegação para detalhes
  }

  onFilter(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onClear(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadUsers();
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
      (value) => value !== '' && value !== null
    );
  }

  getActiveFiltersCount(): number {
    return Object.values(this.filterForm.value).filter(
      (value) => value !== '' && value !== null
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
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('Iniciando carregamento de users...');
    this.isLoading = true;
    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = this.itemsPerPage;

    console.log('Parâmetros:', { skip, take });

    this.usersService.getUsers(skip, take).subscribe({
      next: (response) => {
        console.log('Dados recebidos:', response);
        this.users.set(response.data);
        this.totalItems = response.data.length;
        this.isLoading = false;
        console.log('Loading finalizado, dados:', this.users());
      },
      error: (error) => {
        console.error('Erro ao carregar users:', error);
        this.isLoading = false;
      },
    });
  }
} 