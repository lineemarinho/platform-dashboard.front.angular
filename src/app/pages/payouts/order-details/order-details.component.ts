import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../shared/components/breadcrumb/breadcrumb.component';
import { InfoFieldComponent } from '../../../shared/components/info-field/info-field.component';
import { LocalePipe } from '../../../shared/pipes/locale.pipe';

export interface PayoutDetail {
  id: string;
  code: string;
  e2eOrder: string;
  idempotencyKey: string;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod: string;
  provider: string;
  origin: string;
  value: string;
  clientValue: string;
  orderDescription: string;
  payerCompany: string;
  payerDocument: string;
  payerType: string;
  recipientCompany: string;
  recipientDocument: string;
  recipientBirthDate: string;
  recipientBank: string;
  recipientIspb: string;
  recipientAgency: string;
  recipientAccount: string;
  recipientKeyType: string;
  recipientPixKey: string;
  additionalFee: string;
  fixedFee: string;
  variableFee: string;
}

export interface TransactionRow {
  referenceId: string;
  description: string;
  account: string;
  counterpartyAccount: string;
  currency: string;
  value: string;
  createdAt: string;
}

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, InfoFieldComponent, LocalePipe],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  payment: PayoutDetail | null = null;
  holderFields: any[] = [];
  payerFields: any[] = [];
  recipientFields: any[] = [];
  feesFields: any[] = [];
  transactionColumns: any[] = [];
  transactionRows: TransactionRow[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.route.params.subscribe((params: any) => {
      const paymentId = params['id'];
      if (paymentId) {
        this.loadPaymentDetails(paymentId);
      }
    });
  }

  setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'payouts', route: '/payments/payouts' },
      { label: 'orderDetails', active: true },
    ];
  }

  loadPaymentDetails(paymentId: string): void {
    this.payment = {
      id: paymentId,
      code: 'PAYOUT-' + paymentId,
      e2eOrder: 'E2E-' + paymentId + '-123456',
      idempotencyKey: 'IDEMP-' + paymentId + '-789',
      status: 'paid',
      paymentMethod: 'PIX',
      provider: 'Banco Central',
      origin: 'API',
      value: 'R$ 1.250,00',
      clientValue: 'R$ 1.200,00',
      orderDescription: 'Pagamento de fornecedor',
      payerCompany: 'Empresa Pagadora LTDA',
      payerDocument: '12.345.678/0001-90',
      payerType: 'CNPJ',
      recipientCompany: 'Fornecedor Recebedor LTDA',
      recipientDocument: '98.765.432/0001-10',
      recipientBirthDate: '15/03/1985',
      recipientBank: 'Banco do Brasil',
      recipientIspb: '00000000',
      recipientAgency: '1234',
      recipientAccount: '12345-6',
      recipientKeyType: 'CNPJ',
      recipientPixKey: '98.765.432/0001-10',
      additionalFee: 'R$ 2,50',
      fixedFee: 'R$ 1,00',
      variableFee: 'R$ 1,50',
    };

    this.setupFields();
    this.setupTransactionTable();
  }

  setupFields() {
    this.holderFields = [
      { label: 'id', value: this.payment?.id, copy: true },
      { label: 'code', value: this.payment?.code, copy: true },
      { label: '', value: '' },

      { label: 'e2eOrder', value: this.payment?.e2eOrder, copy: true },
      {
        label: 'idempotencyKey',
        value: this.payment?.idempotencyKey,
        copy: true,
      },
      { label: '', value: '' },

      { label: 'divider', value: 'divider' },

      { label: 'status', value: this.payment?.status },
      { label: '', value: '' },
      { label: '', value: '' },

      { label: 'paymentMethod', value: this.payment?.paymentMethod },
      { label: '', value: '' },
      { label: '', value: '' },

      { label: 'provider', value: this.payment?.provider },
      { label: 'origin', value: this.payment?.origin },
      { label: '', value: '' },

      { label: 'value', value: this.payment?.value },
      { label: 'clientValue', value: this.payment?.clientValue },
      { label: '', value: '' },

      { label: 'divider', value: 'divider' },

      { label: 'orderDescription', value: this.payment?.orderDescription },
      { label: '', value: '' },
      { label: '', value: '' },

      { label: 'divider', value: 'divider' },
    ];

    this.payerFields = [
      { label: 'company', value: this.payment?.payerCompany },
      { label: 'document', value: this.payment?.payerDocument },
      { label: 'payerType', value: this.payment?.payerType },
    ];

    this.recipientFields = [
      { label: 'company', value: this.payment?.recipientCompany },
      { label: 'document', value: this.payment?.recipientDocument },
      { label: 'birthDate', value: this.payment?.recipientBirthDate },

      { label: 'bank', value: this.payment?.recipientBank },
      { label: 'ispb', value: this.payment?.recipientIspb },
      { label: '', value: '' },

      { label: 'agency', value: this.payment?.recipientAgency },
      { label: 'account', value: this.payment?.recipientAccount },
      { label: '', value: '' },

      { label: 'keyType', value: this.payment?.recipientKeyType },
      { label: 'pixKey', value: this.payment?.recipientPixKey },
      { label: '', value: '' },

      { label: 'divider', value: 'divider' },
    ];

    this.feesFields = [
      { label: 'additionalFee', value: this.payment?.additionalFee },
      { label: 'fixedFee', value: this.payment?.fixedFee },
      { label: 'variableFee', value: this.payment?.variableFee },

      { label: 'divider', value: 'divider' },
    ];
  }

  setupTransactionTable(): void {
    this.transactionColumns = [
      { key: 'referenceId', label: 'referenceId' },
      { key: 'description', label: 'description' },
      { key: 'account', label: 'account' },
      { key: 'counterpartyAccount', label: 'counterpartyAccount' },
      { key: 'currency', label: 'currency' },
      { key: 'value', label: 'value' },
      { key: 'createdAt', label: 'createdAt' },
    ];

    this.transactionRows = [
      {
        referenceId: 'REF-001',
        description: 'Pagamento principal',
        account: '12345-6',
        counterpartyAccount: '98765-4',
        currency: 'BRL',
        value: 'R$ 1.250,00',
        createdAt: '2025-01-07 13:16',
      },
      {
        referenceId: 'REF-002',
        description: 'Taxa de processamento',
        account: '12345-6',
        counterpartyAccount: 'Sistema',
        currency: 'BRL',
        value: 'R$ 2,50',
        createdAt: '2025-01-07 13:16',
      },
    ];
  }

  onBack(): void {
    this.router.navigate(['/payments/payouts']);
  }

  onCopyToClipboard(text: string, fieldName: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.toastService.success('Copiado para a área de transferência!');
      });
    }
  }
}
