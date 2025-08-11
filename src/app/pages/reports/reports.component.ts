import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../shared/components/app-input/app-input.component';
import {
  AppTableComponent,
  ExpandedRowData,
  TableColumn,
} from '../../shared/components/app-table/app-table.component';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { LocalePipe } from '../../shared/pipes/locale.pipe';

interface ReportRow {
  id: string;
  type: string;
  fileType: string;
  status: string;
  companyId: string;
  companyName: string;
  date: string;
  amount: string;
  method: string;
  e2eId: string;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageTitleComponent,
    AppInputComponent,
    AppButtonComponent,
    AppTableComponent,
    LocalePipe,
  ],
})
export class ReportsComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;
  isMobileFiltersOpen = false;
  tableColumns: TableColumn[] = [];
  tableRows: ReportRow[] = [];
  private localeSubscription: any;

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private translationService: TranslationService
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
    });
  }

  ngOnInit(): void {
    this.updateTableColumns();
    this.loadSampleData();

    this.localeSubscription = this.translationService.currentLocale$.subscribe(
      () => {
        this.updateTableColumns();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.localeSubscription) {
      this.localeSubscription.unsubscribe();
    }
  }

  updateTableColumns(): void {
    this.tableColumns = [
      { key: 'id', label: this.translationService.translate('id'), type: 'id' },
      { key: 'type', label: this.translationService.translate('type') },
      { key: 'fileType', label: this.translationService.translate('fileType') },
      {
        key: 'status',
        label: this.translationService.translate('status'),
        type: 'status',
      },
      {
        key: 'companyId',
        label: this.translationService.translate('companyId'),
      },
      {
        key: 'companyName',
        label: this.translationService.translate('companyName'),
      },
    ];
  }

  loadSampleData(): void {
    this.tableRows = [
      {
        id: 'RPT-001',
        type: 'Relatório de Pagamentos',
        fileType: 'PDF',
        status: 'completed',
        companyId: 'COMP-001',
        companyName: 'TechCorp Ltda',
        date: '2025-01-07 13:16',
        amount: 'R$ 15.000,00',
        method: 'PIX',
        e2eId: 'E2E123456789',
      },
      {
        id: 'RPT-002',
        type: 'Relatório de Recebimentos',
        fileType: 'Excel',
        status: 'processing',
        companyId: 'COMP-002',
        companyName: 'DigitalPay Inc',
        date: '2025-01-07 14:30',
        amount: 'R$ 8.500,00',
        method: 'Bank Transfer',
        e2eId: 'E2E987654321',
      },
      {
        id: 'RPT-003',
        type: 'Relatório de Saques',
        fileType: 'CSV',
        status: 'completed',
        companyId: 'COMP-003',
        companyName: 'FinanceCorp',
        date: '2025-01-07 15:45',
        amount: 'R$ 12.300,00',
        method: 'PIX',
        e2eId: 'E2E456789123',
      },
    ];
  }

  mapRowToColumns(row: ReportRow): any[] {
    return [
      row.id,
      row.type,
      row.fileType,
      row.status,
      row.companyId,
      row.companyName,
    ];
  }

  expandedDataMap(row: ReportRow): ExpandedRowData {
    const startDate = new Date(row.date);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    const endDateString = endDate
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19);

    let partner = 'Sistema Financeiro';
    switch (row.method) {
      case 'PIX':
        partner = 'Banco Central';
        break;
      case 'Bank Transfer':
        partner = 'Banco do Brasil';
        break;
    }

    return {
      'Data início': row.date,
      'Data final': endDateString,
      'Método de pagamento': row.method,
      Parceiro: partner,
      'E2E ID': row.e2eId,
      Valor: row.amount,
      Status: row.status,
      'Tipo de arquivo': row.fileType,
      'ID Empresa': row.companyId,
      'Nome Empresa': row.companyName,
    };
  }

  onFilter(): void {
    this.toastService.info(
      this.translationService.translate('filter') + ' aplicado com sucesso!',
      2000
    );
  }

  onClear(): void {
    this.filterForm.reset();
    this.toastService.info(
      this.translationService.translate('clear') + ' aplicado com sucesso!',
      2000
    );
  }

  toggleMobileFilters(): void {
    this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
  }

  hasActiveFilters(): boolean {
    const formValue = this.filterForm.value;
    return Object.values(formValue).some(value => value !== null && value !== '' && value !== undefined);
  }

  getActiveFiltersCount(): number {
    const formValue = this.filterForm.value;
    return Object.values(formValue).filter(value => value !== null && value !== '' && value !== undefined).length;
  }
}
