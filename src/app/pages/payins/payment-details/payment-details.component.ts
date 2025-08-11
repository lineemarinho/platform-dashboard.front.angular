import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from '../../../shared/components/breadcrumb';
import { InfoFieldComponent } from '../../../shared/components/info-field/info-field.component';
import { LocalePipe } from '../../../shared/pipes/locale.pipe';

export interface PaymentDetail {
  id: string;
  code: string;
  e2eOrder: string;
  idempotencyKey: string;
  status: 'paid' | 'pending' | 'failed';
  paymentMethod: string;
  origin: string;
  value: string;
  clientValue: string;
  orderDescription: string;
  payerCompany: string;
  payerDocument: string;
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

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, InfoFieldComponent, LocalePipe],
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css'],
})
export class PaymentDetailsComponent implements OnInit {
  @Input() payment: PaymentDetail | null = null;
  @Input() isOpen = false;

  holderFields: any[] = [];
  payerFields: any[] = [];
  recipientFields: any[] = [];
  feesFields: any[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    console.log('PaymentDetailsComponent ngOnInit');
    this.setupBreadcrumb();
    this.route.params.subscribe((params: any) => {
      const paymentId = params['id'];
      console.log('Payment ID from route:', paymentId);
      if (paymentId) {
        this.loadPaymentDetails(paymentId);
      }
    });
  }

  setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'payins', route: '/payments/payins' },
      { label: 'orderDetails', active: true },
    ];
  }

  loadPaymentDetails(paymentId: string): void {
    this.payment = {
      id: paymentId,
      code: '838d47d6-0bff-4b94-a457-121ae88a387b',
      e2eOrder: '838d47d6-0bff-4b94-a457-121ae88a387b',
      idempotencyKey: '838d47d6-0bff-4b94-a457-121ae88a387b',
      status: 'paid',
      paymentMethod: 'PIX',
      origin: 'Wallet',
      value: 'BRL R$ 20,00',
      clientValue: 'BRL R$ 20,00',
      orderDescription:
        'Solicitação do saque referente ao pagamento criado em 01/07/2025 13:15. Solicitação do saque referente ao pagamento criado em 01/07/2025 13:15. Solicitação do saque referente ao pagamento criado em 01/07/2025 13:15. Solicitação do saque referente...',
      payerCompany: 'Garena - Apolo',
      payerDocument: 'CNPJ: 37.687.481/0001-65',
      recipientCompany: 'Garena - Apolo',
      recipientDocument: 'CNPJ: 37.687.481/0001-65',
      recipientBirthDate: '09/05/2025',
      recipientBank: 'Gowd',
      recipientIspb: '544545',
      recipientAgency: '0001',
      recipientAccount: '123123341',
      recipientKeyType: 'E-mail',
      recipientPixKey: 'line@teste.com.br',
      additionalFee: 'R$ 0,00',
      fixedFee: 'R$ 0,00',
      variableFee: 'R$ 0,00',
    };
    this.setupFields();
  }

  ngOnChanges(): void {
    if (this.payment) {
      this.setupFields();
    }
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
      { label: 'origin', value: this.payment?.origin },
      { label: '', value: '' },

      { label: 'value', value: this.payment?.value },
      { label: 'clientValue', value: this.payment?.clientValue },
      { label: '', value: '' },
    ];
    this.payerFields = [
      { label: 'company', value: this.payment?.payerCompany },
      { label: 'document', value: this.payment?.payerDocument },
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
    ];
    this.feesFields = [
      { label: 'additionalFee', value: this.payment?.additionalFee },
      { label: 'fixedFee', value: this.payment?.fixedFee },
      { label: 'variableFee', value: this.payment?.variableFee },
    ];
  }

  getStatusType(status: string): 'success' | 'warning' | 'error' {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'warning';
    }
  }
}
