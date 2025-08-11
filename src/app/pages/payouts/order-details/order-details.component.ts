import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PayoutsService } from "../../../core/services/payouts.service";
import { ToastService } from "../../../core/services/toast.service";
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from "../../../shared/components/breadcrumb/breadcrumb.component";
import { InfoFieldComponent } from "../../../shared/components/info-field/info-field.component";
import { LocalePipe } from "../../../shared/pipes/locale.pipe";

export interface PayoutDetail {
  id: string;
  code: string;
  e2eOrder: string;
  idempotencyKey: string;
  status: "paid" | "pending" | "failed";
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
  selector: "app-order-details",
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, InfoFieldComponent, LocalePipe],
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.css"],
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
  isLoading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private payoutsService: PayoutsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.route.params.subscribe((params: any) => {
      const payoutId = params["id"];
      if (payoutId) {
        this.loadPaymentDetails(payoutId);
      } else {
        this.error = "ID do payout não fornecido";
        this.toastService.error("ID do payout não fornecido");
      }
    });
  }

  setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: "payouts", route: "/payouts" },
      { label: "orderDetails", active: true },
    ];
  }

  loadPaymentDetails(payoutId: string): void {
    this.isLoading = true;
    this.error = null;

    console.log("=== CARREGANDO DETALHES DO PAYOUT ===");
    console.log("ID:", payoutId);

    this.payoutsService.getPayoutDetails(payoutId).subscribe({
      next: (response) => {
        console.log("Dados recebidos da API:", response);
        this.payment = this.mapApiResponseToPayoutDetail(response);
        this.setupFields();
        this.setupTransactionTable();
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erro ao carregar detalhes do payout:", error);
        this.error = "Erro ao carregar detalhes do payout";
        this.toastService.error("Erro ao carregar detalhes do payout");
        this.isLoading = false;
      },
    });
  }

  /**
   * Mapeia a resposta da API para o formato do componente
   */
  private mapApiResponseToPayoutDetail(apiResponse: any): PayoutDetail {
    // Aqui você mapeia os campos da API para o formato do componente
    // Ajuste conforme a estrutura real da API
    return {
      id: apiResponse.id || "",
      code: apiResponse.code || "",
      e2eOrder: apiResponse.e2eOrder || apiResponse.e2eId || "",
      idempotencyKey: apiResponse.idempotencyKey || "",
      status: apiResponse.status || "pending",
      paymentMethod: apiResponse.paymentMethod || "",
      provider: apiResponse.provider || "",
      origin: apiResponse.origin || "",
      value: apiResponse.amount?.value ? `R$ ${apiResponse.amount.value}` : "",
      clientValue: apiResponse.clientValue || "",
      orderDescription: apiResponse.description || "",
      payerCompany: apiResponse.payer?.company?.name || "",
      payerDocument: apiResponse.payer?.document?.number || "",
      payerType: apiResponse.payer?.document?.type || "",
      recipientCompany: apiResponse.recipient?.company?.name || "",
      recipientDocument: apiResponse.recipient?.document?.number || "",
      recipientBirthDate: apiResponse.recipient?.birthDate || "",
      recipientBank: apiResponse.recipient?.bank?.name || "",
      recipientIspb: apiResponse.recipient?.bank?.ispb || "",
      recipientAgency: apiResponse.recipient?.bank?.agency || "",
      recipientAccount: apiResponse.recipient?.bank?.account || "",
      recipientKeyType: apiResponse.recipient?.pixKey?.type || "",
      recipientPixKey: apiResponse.recipient?.pixKey?.value || "",
      additionalFee: apiResponse.fees?.additional
        ? `R$ ${apiResponse.fees.additional}`
        : "",
      fixedFee: apiResponse.fees?.fixed ? `R$ ${apiResponse.fees.fixed}` : "",
      variableFee: apiResponse.fees?.variable
        ? `R$ ${apiResponse.fees.variable}`
        : "",
    };
  }

  setupFields() {
    this.holderFields = [
      { label: "id", value: this.payment?.id, copy: true },
      { label: "code", value: this.payment?.code, copy: true },
      { label: "", value: "" },

      { label: "e2eOrder", value: this.payment?.e2eOrder, copy: true },
      {
        label: "idempotencyKey",
        value: this.payment?.idempotencyKey,
        copy: true,
      },
      { label: "", value: "" },

      { label: "divider", value: "divider" },

      { label: "status", value: this.payment?.status },
      { label: "", value: "" },
      { label: "", value: "" },

      { label: "paymentMethod", value: this.payment?.paymentMethod },
      { label: "", value: "" },
      { label: "", value: "" },

      { label: "provider", value: this.payment?.provider },
      { label: "origin", value: this.payment?.origin },
      { label: "", value: "" },

      { label: "value", value: this.payment?.value },
      { label: "clientValue", value: this.payment?.clientValue },
      { label: "", value: "" },

      { label: "divider", value: "divider" },

      { label: "orderDescription", value: this.payment?.orderDescription },
      { label: "", value: "" },
      { label: "", value: "" },

      { label: "divider", value: "divider" },
    ];

    this.payerFields = [
      { label: "company", value: this.payment?.payerCompany },
      { label: "document", value: this.payment?.payerDocument },
      { label: "payerType", value: this.payment?.payerType },
    ];

    this.recipientFields = [
      { label: "company", value: this.payment?.recipientCompany },
      { label: "document", value: this.payment?.recipientDocument },
      { label: "birthDate", value: this.payment?.recipientBirthDate },

      { label: "bank", value: this.payment?.recipientBank },
      { label: "ispb", value: this.payment?.recipientIspb },
      { label: "", value: "" },

      { label: "agency", value: this.payment?.recipientAgency },
      { label: "account", value: this.payment?.recipientAccount },
      { label: "", value: "" },

      { label: "keyType", value: this.payment?.recipientKeyType },
      { label: "pixKey", value: this.payment?.recipientPixKey },
      { label: "", value: "" },

      { label: "divider", value: "divider" },
    ];

    this.feesFields = [
      { label: "additionalFee", value: this.payment?.additionalFee },
      { label: "fixedFee", value: this.payment?.fixedFee },
      { label: "variableFee", value: this.payment?.variableFee },

      { label: "divider", value: "divider" },
    ];
  }

  setupTransactionTable(): void {
    this.transactionColumns = [
      { key: "referenceId", label: "referenceId" },
      { key: "description", label: "description" },
      { key: "account", label: "account" },
      { key: "counterpartyAccount", label: "counterpartyAccount" },
      { key: "currency", label: "currency" },
      { key: "value", label: "value" },
      { key: "createdAt", label: "createdAt" },
    ];

    this.transactionRows = [
      {
        referenceId: "REF-001",
        description: "Pagamento principal",
        account: "12345-6",
        counterpartyAccount: "98765-4",
        currency: "BRL",
        value: "R$ 1.250,00",
        createdAt: "2025-01-07 13:16",
      },
      {
        referenceId: "REF-002",
        description: "Taxa de processamento",
        account: "12345-6",
        counterpartyAccount: "Sistema",
        currency: "BRL",
        value: "R$ 2,50",
        createdAt: "2025-01-07 13:16",
      },
    ];
  }

  onBack(): void {
    this.router.navigate(["/payouts"]);
  }

  onCopyToClipboard(text: string, fieldName: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.toastService.success("Copiado para a área de transferência!");
      });
    }
  }
}
