import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PayinsService } from "../../../core/services/payins.service";
import { ToastService } from "../../../core/services/toast.service";
import {
  LoadingComponent,
  StatusBadgeComponent,
} from "../../../shared/components";
import { AppTableComponent } from "../../../shared/components/app-table/app-table.component";
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from "../../../shared/components/breadcrumb";
import { ErrorMessageComponent } from "../../../shared/components/error-message/error-message.component";
import { InfoFieldComponent } from "../../../shared/components/info-field/info-field.component";
import { PayinApiResponse } from "../../../shared/interfaces";
import { PaymentDetail } from "../../../shared/interfaces/payin.interface";
import { LocalePipe } from "../../../shared/pipes/locale.pipe";

@Component({
  selector: "app-payment-details",
  standalone: true,
  imports: [
    CommonModule,
    BreadcrumbComponent,
    ErrorMessageComponent,
    InfoFieldComponent,
    LocalePipe,
    LoadingComponent,
    AppTableComponent,
    StatusBadgeComponent,
  ],
  templateUrl: "./payment-details.component.html",
  styleUrls: ["./payment-details.component.css"],
})
export class PaymentDetailsComponent implements OnInit {
  @Input() payment: PaymentDetail | null = null;
  @Input() isOpen = false;

  holderFields: any[] = [];
  payerFields: any[] = [];
  recipientFields: any[] = [];
  feesFields: any[] = [];
  additionalFields: any[] = [];
  timelineFields: any[] = [];
  transactionFields: any[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];
  isLoading = false;
  error: string | null = null;

  transactionColumns = [
    { key: "referenceId", label: "Reference ID", type: "id" as const },
    { key: "description", label: "Descrição", type: "text" as const },
    { key: "account", label: "Conta", type: "text" as const },
    {
      key: "counterpartyAccount",
      label: "Conta Contraparte",
      type: "text" as const,
    },
    { key: "currency", label: "Moeda", type: "text" as const },
    { key: "amount", label: "Valor", type: "money" as const },
    { key: "balance", label: "Saldo", type: "money" as const },
    { key: "operationType", label: "Tipo Operação", type: "text" as const },
    { key: "status", label: "Status", type: "status" as const },
    { key: "createdAt", label: "Data Criação", type: "date" as const },
  ];

  constructor(
    private route: ActivatedRoute,
    private payinsService: PayinsService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.route.params.subscribe((params: any) => {
      const paymentId = params["id"];
      if (paymentId) {
        this.loadPaymentDetails(paymentId);
      }
    });
  }

  private mapApiResponseToPaymentDetail(
    apiResponse: PayinApiResponse,
    paymentId: string
  ): PaymentDetail {
    const paymentDetail: PaymentDetail = {
      id: paymentId,
      code: apiResponse.code || "N/A",
      e2eOrder: apiResponse.id || "N/A",
      idempotencyKey: apiResponse.idempotencyKey || "N/A",
      status: this.mapStatus(apiResponse.status),
      paymentMethod: apiResponse.paymentMethod || "N/A",
      origin: apiResponse.origin || "N/A",
      value: `${apiResponse.amount?.currency || "N/A"} R$ ${
        apiResponse.amount?.value || "N/A"
      }`,
      clientValue: `${apiResponse.baseAmount?.currency || "N/A"} R$ ${
        apiResponse.baseAmount?.value || "N/A"
      }`,
      orderDescription: apiResponse.additionalInfo || "N/A",
      payerCompany: apiResponse.customer?.fullName || "N/A",
      payerDocument: `${apiResponse.customer?.document?.type || "N/A"}: ${
        apiResponse.customer?.document?.number || "N/A"
      }`,
      recipientCompany: apiResponse.company?.name || "N/A",
      recipientDocument: `${apiResponse.company?.document?.type || "N/A"}: ${
        apiResponse.company?.document?.number || "N/A"
      }`,
      recipientBirthDate: apiResponse.customer?.birth
        ? new Date(apiResponse.customer.birth).toLocaleDateString("pt-BR")
        : "N/A",
      recipientBank: apiResponse.financialPartner || "N/A",
      recipientIspb: "N/A",
      recipientAgency: "N/A",
      recipientAccount: apiResponse.accountId || "N/A",
      recipientKeyType: apiResponse.customer?.email ? "E-mail" : "N/A",
      recipientPixKey: apiResponse.customer?.email || "N/A",
      additionalFee: `R$ ${apiResponse.feeAdd || "0,00"}`,
      fixedFee: `R$ ${apiResponse.feeFix || "0,00"}`,
      variableFee: `R$ ${apiResponse.feeVar || "0,00"}`,
    };

    (paymentDetail as any).paidAt = apiResponse.paidAt
      ? new Date(apiResponse.paidAt).toLocaleDateString("pt-BR")
      : "N/A";
    (paymentDetail as any).createdAt = apiResponse.createdAt
      ? new Date(apiResponse.createdAt).toLocaleDateString("pt-BR")
      : "N/A";
    (paymentDetail as any).compensatedAt = apiResponse.compensatedAt
      ? new Date(apiResponse.compensatedAt).toLocaleDateString("pt-BR")
      : "N/A";
    (paymentDetail as any).settledAt = apiResponse.settledAt
      ? new Date(apiResponse.settledAt).toLocaleDateString("pt-BR")
      : "N/A";
    (paymentDetail as any).updatedAt = apiResponse.updatedAt
      ? new Date(apiResponse.updatedAt).toLocaleDateString("pt-BR")
      : "N/A";

    (paymentDetail as any).transactions = apiResponse.transactions || [];
    (paymentDetail as any).customerEmail = apiResponse.customer?.email || "N/A";
    (paymentDetail as any).customerPhone = apiResponse.customer?.phone || "N/A";
    (paymentDetail as any).customerType = apiResponse.customer?.type || "N/A";
    (paymentDetail as any).basePricePair = apiResponse.basePricePair || "0";
    (paymentDetail as any).product = apiResponse.product || "N/A";

    return paymentDetail;
  }

  setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: "payins", route: "/payins" },
      { label: "orderDetails", active: true },
    ];
  }

  loadPaymentDetails(paymentId: string): void {
    this.isLoading = true;

    this.payinsService.getPayinById(paymentId).subscribe({
      next: (response) => {
        this.payment = this.mapApiResponseToPaymentDetail(response, paymentId);
        this.setupFields();
        this.isLoading = false;
      },
      error: (error) => {
        this.error = "Erro ao carregar detalhes do payin";
        this.isLoading = false;
        this.toastService.error("Erro ao carregar detalhes do payin");
      },
    });
  }

  ngOnChanges(): void {
    if (this.payment) {
      this.setupFields();
    }
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
      { label: "origin", value: this.payment?.origin },
      { label: "", value: "" },

      { label: "value", value: this.payment?.value },
      { label: "clientValue", value: this.payment?.clientValue },
      { label: "", value: "" },
    ];

    this.payerFields = [
      { label: "fullName", value: this.payment?.payerCompany },
      { label: "document", value: this.payment?.payerDocument },
      { label: "email", value: (this.payment as any)?.customerEmail },
      { label: "phone", value: (this.payment as any)?.customerPhone },
      { label: "type", value: (this.payment as any)?.customerType },
      { label: "birthDate", value: this.payment?.recipientBirthDate },
    ];

    this.recipientFields = [
      { label: "company", value: this.payment?.recipientCompany },
      { label: "document", value: this.payment?.recipientDocument },
      { label: "birthDate", value: this.payment?.recipientBirthDate },

      { label: "bank", value: this.payment?.recipientBank },
      { label: "ispb", value: this.payment?.recipientIspb },
      { label: "", value: "" },

      { label: "agency", value: this.payment?.recipientAgency },
      { label: "account", value: this.payment?.recipientAccount, copy: true },
      { label: "", value: "" },

      { label: "keyType", value: this.payment?.recipientKeyType },
      { label: "pixKey", value: this.payment?.recipientPixKey },
      { label: "", value: "" },
    ];

    this.feesFields = [
      { label: "additionalFee", value: this.payment?.additionalFee },
      { label: "fixedFee", value: this.payment?.fixedFee },
      { label: "variableFee", value: this.payment?.variableFee },
    ];

    this.timelineFields = [
      { label: "createdAt", value: (this.payment as any)?.createdAt || "N/A" },
      { label: "paidAt", value: (this.payment as any)?.paidAt || "N/A" },
      {
        label: "compensatedAt",
        value: (this.payment as any)?.compensatedAt || "N/A",
      },

      { label: "settledAt", value: (this.payment as any)?.settledAt || "N/A" },
      { label: "updatedAt", value: (this.payment as any)?.updatedAt || "N/A" },
      { label: "", value: "" },
    ];

    this.setupTransactionFields();
  }

  private setupTransactionFields(): void {
    const transactions = (this.payment as any)?.transactions || [];

    this.transactionFields = transactions.map((transaction: any) => ({
      referenceId: transaction.referenceId || "N/A",
      description: transaction.description || "N/A",
      account: transaction.internalAccount?.holder || "N/A",
      counterpartyAccount:
        transaction.internalCounterpartyAccount?.holder || "N/A",
      currency: transaction.currency || "N/A",
      amount: transaction.amount || "N/A",
      balance: transaction.balance || "N/A",
      operationType: transaction.operationType || "N/A",
      status: this.determineTransactionStatus(transaction),
      createdAt: transaction.createdAt
        ? new Date(transaction.createdAt).toLocaleDateString("pt-BR")
        : "N/A",
      companyId: transaction.companyId || "N/A",
    }));
  }

  mapTransactionToColumns(transaction: any): any[] {
    return [
      transaction.referenceId,
      transaction.description,
      transaction.account,
      transaction.counterpartyAccount,
      transaction.currency,
      `${transaction.currency} R$ ${transaction.amount}`,
      `${transaction.currency} R$ ${transaction.balance}`,
      transaction.operationType,
      transaction.status,
      transaction.createdAt,
    ];
  }

  private mapStatus(status: string): "paid" | "pending" | "failed" {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "paid":
        return "paid";
      case "pending":
        return "pending";
      case "failed":
        return "failed";
      default:
        return "pending";
    }
  }

  private determineTransactionStatus(transaction: any): string {
    if (
      transaction.operationType === "PIX" &&
      parseFloat(transaction.amount) > 0
    ) {
      return "paid";
    } else if (
      transaction.operationType === "-" &&
      parseFloat(transaction.amount) < 0
    ) {
      return "completed";
    } else if (
      transaction.operationType === "PIX" &&
      parseFloat(transaction.amount) === 0
    ) {
      return "pending";
    } else {
      return "completed";
    }
  }

  mapStatusToStatusType(
    status: string
  ):
    | "approved"
    | "pending"
    | "rejected"
    | "cancelled"
    | "processing"
    | "completed"
    | "active"
    | "inactive" {
    switch (status?.toLowerCase()) {
      case "paid":
        return "completed";
      case "pending":
        return "pending";
      case "failed":
        return "rejected";
      case "completed":
        return "completed";
      default:
        return "pending";
    }
  }

  getStatusType(status: string): "success" | "warning" | "error" {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      case "completed":
        return "success";
      default:
        return "warning";
    }
  }
}
