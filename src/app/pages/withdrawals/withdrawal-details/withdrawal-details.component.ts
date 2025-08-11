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

export interface WithdrawalDetail {
  id: string;
  company: string;
  accountId: string;
  accountType: string;
  alias: string;
  value: string;
  clientValue: string;
  requestName: string;
  requestCreatedAt: string;
  requestDescription: string;
  approvalName: string;
  approvalCreatedAt: string;
  approvalDescription: string;
  timeline: TimelineItem[];
}

export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

@Component({
  selector: 'app-withdrawal-details',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, InfoFieldComponent, LocalePipe],
  templateUrl: './withdrawal-details.component.html',
  styleUrls: ['./withdrawal-details.component.css'],
})
export class WithdrawalDetailsComponent implements OnInit {
  withdrawal: WithdrawalDetail | null = null;
  companyFields: any[] = [];
  requestFields: any[] = [];
  approvalFields: any[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.route.params.subscribe((params: any) => {
      const withdrawalId = params['id'];
      if (withdrawalId) {
        this.loadWithdrawalDetails(withdrawalId);
      }
    });
  }

  setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'withdrawals', route: '/withdrawals' },
      { label: 'withdrawalDetails', active: true },
    ];
  }

  loadWithdrawalDetails(withdrawalId: string): void {
    this.withdrawal = {
      id: withdrawalId,
      company: 'Empresa Saque LTDA',
      accountId: 'ACC-' + withdrawalId,
      accountType: 'Conta Corrente',
      alias: 'Conta Principal',
      value: 'R$ 5.000,00',
      clientValue: 'R$ 4.950,00',
      requestName: 'João Silva',
      requestCreatedAt: '2025-01-07 10:30',
      requestDescription: 'Solicitação de saque para pagamento de fornecedores',
      approvalName: 'Maria Santos',
      approvalCreatedAt: '2025-01-07 11:15',
      approvalDescription: 'Aprovação do saque após análise de compliance',
      timeline: [
        {
          id: '1',
          title: 'initial',
          description: 'Solicitação de saque criada',
          date: '19/09/2025 16:50',
          status: 'completed',
        },
        {
          id: '2',
          title: 'inProcessing',
          description: 'Solicitação em análise',
          date: '19/09/2025 16:50',
          status: 'completed',
        },
        {
          id: '3',
          title: 'approved',
          description: 'Solicitação aprovada',
          date: '19/09/2025 16:50',
          status: 'completed',
        },
      ],
    };

    this.setupFields();
  }

  setupFields() {
    this.companyFields = [
      { label: 'company', value: this.withdrawal?.company },
      { label: '', value: '' },
      { label: '', value: '' },

      { label: 'accountId', value: this.withdrawal?.accountId },
      { label: 'accountType', value: this.withdrawal?.accountType },
      { label: 'alias', value: this.withdrawal?.alias },

      { label: 'value', value: this.withdrawal?.value },
      { label: 'clientValue', value: this.withdrawal?.clientValue },
      { label: '', value: '' },

      { label: 'divider', value: 'divider' },
    ];

    this.requestFields = [
      { label: 'requestName', value: this.withdrawal?.requestName },
      { label: 'requestCreatedAt', value: this.withdrawal?.requestCreatedAt },
      { label: '', value: '' },

      { label: 'divider', value: 'divider' },

      {
        label: 'requestDescription',
        value: this.withdrawal?.requestDescription,
      },
      { label: '', value: '' },
      { label: '', value: '' },

      { label: 'divider', value: 'divider' },
    ];

    this.approvalFields = [
      { label: 'approvalName', value: this.withdrawal?.approvalName },
      { label: 'approvalCreatedAt', value: this.withdrawal?.approvalCreatedAt },
      { label: '', value: '' },

      { label: 'divider', value: 'divider' },

      {
        label: 'approvalDescription',
        value: this.withdrawal?.approvalDescription,
      },
      { label: '', value: '' },
      { label: '', value: '' },

      { label: 'divider', value: 'divider' },
    ];
  }

  onBack(): void {
    this.router.navigate(['/withdrawals']);
  }

  onCopyToClipboard(text: string, fieldName: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.toastService.success('Copiado para a área de transferência!');
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getTimelineStepClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-gray-400';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  }
}
