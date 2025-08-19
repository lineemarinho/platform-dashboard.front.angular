import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PayoutsService } from "../../../core/services/payouts.service";
import { ToastService } from "../../../core/services/toast.service";
import { LoadingComponent } from "../../../shared/components";
import { AppTableComponent } from "../../../shared/components/app-table/app-table.component";
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from "../../../shared/components/breadcrumb/breadcrumb.component";
import { ErrorMessageComponent } from "../../../shared/components/error-message/error-message.component";
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
  transactions?: any[];
  providerRouterId: string;
  providerRouterAccountCode: string;
  providerRouterAccountDescription: string;
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
  imports: [
    CommonModule,
    AppTableComponent,
    BreadcrumbComponent,
    ErrorMessageComponent,
    LoadingComponent,
    InfoFieldComponent,
    LocalePipe,
  ],
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.css"],
})
export class OrderDetailsComponent implements OnInit {
  payment: PayoutDetail | null = null;
  holderFields: any[] = [];
  payerFields: any[] = [];
  recipientFields: any[] = [];
  feesFields: any[] = [];
  providerRouterFields: any[] = [];
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

    this.payoutsService.getPayoutDetails(payoutId).subscribe({
      next: (response) => {
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

  private mapApiResponseToPayoutDetail(apiResponse: any): PayoutDetail {
    return {
      id: apiResponse.id || "",
      code: apiResponse.code || "",
      e2eOrder: apiResponse.financialPartnerOrderId || "",
      idempotencyKey: apiResponse.idempotencyKey || "",
      status: apiResponse.status?.toLowerCase() || "pending",
      paymentMethod: apiResponse.paymentMethod || "",
      provider: apiResponse.financialPartner || "",
      origin: apiResponse.origin || "",
      value: apiResponse.amount?.value ? `R$ ${apiResponse.amount.value}` : "",
      clientValue: apiResponse.amountClient
        ? `R$ ${apiResponse.amountClient}`
        : "",
      orderDescription: apiResponse.additionalInfo || "",
      payerCompany: apiResponse.senderAccount?.fullName || "",
      payerDocument: apiResponse.senderAccount?.document?.number || "",
      payerType: apiResponse.senderAccount?.document?.type || "",
      recipientCompany: apiResponse.receiverAccount?.fullName || "",
      recipientDocument: apiResponse.receiverAccount?.document?.number || "",
      recipientBirthDate: "",
      recipientBank: apiResponse.receiverAccount?.bank?.bankName || "",
      recipientIspb: "",
      recipientAgency:
        apiResponse.receiverAccount?.bank?.account?.branchNumber || "",
      recipientAccount:
        apiResponse.receiverAccount?.bank?.account?.accountNumber || "",
      recipientKeyType: "",
      recipientPixKey: "",
      additionalFee: apiResponse.feeAdd ? `R$ ${apiResponse.feeAdd}` : "",
      fixedFee: apiResponse.feeFix ? `R$ ${apiResponse.feeFix}` : "",
      variableFee: apiResponse.feeVar ? `R$ ${apiResponse.feeVar}` : "",
      transactions: apiResponse.transactions || [],
      providerRouterId: apiResponse.providerRouter?.id || "",
      providerRouterAccountCode: apiResponse.providerRouter?.accountCode || "",
      providerRouterAccountDescription:
        apiResponse.providerRouter?.accountDescription || "",
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
      { label: "document", value: this.payment?.payerDocument, copy: true },
      { label: "payerType", value: this.payment?.payerType },
    ];

    this.recipientFields = [
      { label: "company", value: this.payment?.recipientCompany },
      { label: "document", value: this.payment?.recipientDocument, copy: true },
      { label: "birthDate", value: this.payment?.recipientBirthDate },

      { label: "bank", value: this.payment?.recipientBank },
      { label: "ispb", value: this.payment?.recipientIspb, copy: true },
      { label: "", value: "" },

      { label: "agency", value: this.payment?.recipientAgency, copy: true },
      { label: "account", value: this.payment?.recipientAccount, copy: true },
      { label: "", value: "" },

      { label: "keyType", value: this.payment?.recipientKeyType },
      { label: "pixKey", value: this.payment?.recipientPixKey, copy: true },
      { label: "", value: "" },

      { label: "divider", value: "divider" },
    ];

    this.feesFields = [
      { label: "additionalFee", value: this.payment?.additionalFee },
      { label: "fixedFee", value: this.payment?.fixedFee },
      { label: "variableFee", value: this.payment?.variableFee },

      { label: "divider", value: "divider" },
    ];

    this.providerRouterFields = [
      {
        label: "providerRouterId",
        value: this.payment?.providerRouterId,
        copy: true,
      },
      {
        label: "providerRouterAccountCode",
        value: this.payment?.providerRouterAccountCode,
        copy: true,
      },
      {
        label: "providerRouterAccountDescription",
        value: this.payment?.providerRouterAccountDescription,
      },
    ];
  }

  setupTransactionTable(): void {
    this.transactionColumns = [
      { key: "referenceId", label: "referenceId", type: "text" as const },
      { label: "description", type: "text" as const },
      { label: "account", type: "text" as const },
      { label: "counterpartyAccount", type: "text" as const },
      { label: "currency", type: "text" as const },
      { label: "value", type: "money" as const },
      { label: "createdAt", type: "date" as const },
    ];

    if (
      this.payment &&
      this.payment.transactions &&
      this.payment.transactions.length > 0
    ) {
      this.transactionRows = this.payment.transactions.map(
        (transaction: any) => ({
          referenceId: transaction.referenceId || "N/A",
          description: transaction.description || "N/A",
          account: transaction.internalAccount?.holder || "N/A",
          counterpartyAccount:
            transaction.internalCounterpartyAccount?.holder || "N/A",
          currency: transaction.currency || "N/A",
          value: transaction.amount ? `R$ ${transaction.amount}` : "N/A",
          createdAt: transaction.createdAt
            ? new Date(transaction.createdAt).toLocaleDateString("pt-BR") +
              " " +
              new Date(transaction.createdAt).toLocaleTimeString("pt-BR")
            : "N/A",
        })
      );
    } else {
      this.transactionRows = [];
    }
  }

  mapTransactionToColumns = (transaction: TransactionRow) => [
    transaction.referenceId,
    transaction.description,
    transaction.account,
    transaction.counterpartyAccount,
    transaction.currency,
    transaction.value,
    transaction.createdAt,
  ];

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
