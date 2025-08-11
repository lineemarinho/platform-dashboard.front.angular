import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PayinsService } from "../../../core/services/payins.service";
import { ToastService } from "../../../core/services/toast.service";
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from "../../../shared/components/breadcrumb";
import { InfoFieldComponent } from "../../../shared/components/info-field/info-field.component";
import { LocalePipe } from "../../../shared/pipes/locale.pipe";

export interface PaymentDetail {
  id: string;
  code: string;
  e2eOrder: string;
  idempotencyKey: string;
  status: "paid" | "pending" | "failed";
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
  selector: "app-payment-details",
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent, InfoFieldComponent, LocalePipe],
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
  transactionFields: any[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private router: Router,
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
    apiResponse: any,
    paymentId: string
  ): PaymentDetail {
    console.log("=== MAPEANDO RESPOSTA DA API ===");
    console.log("API Response:", apiResponse);

    // Mapeia os dados reais da API para o formato da interface
    const paymentDetail: PaymentDetail = {
      id: paymentId,
      code: apiResponse.code || "N/A",
      e2eOrder: apiResponse.id || "N/A", // Usando ID como E2E Order
      idempotencyKey: apiResponse.idempotencyKey || "N/A",
      status: apiResponse.status?.toLowerCase() || "pending",
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
      recipientIspb: "N/A", // Não disponível na API
      recipientAgency: "N/A", // Não disponível na API
      recipientAccount: apiResponse.accountId || "N/A",
      recipientKeyType: apiResponse.customer?.email ? "E-mail" : "N/A",
      recipientPixKey: apiResponse.customer?.email || "N/A",
      additionalFee: `R$ ${apiResponse.feeAdd || "0,00"}`,
      fixedFee: `R$ ${apiResponse.feeFix || "0,00"}`,
      variableFee: `R$ ${apiResponse.feeVar || "0,00"}`,
    };

    // Adiciona campos extras para uso interno (não na interface)
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

    return paymentDetail;
  }

  setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: "payins", route: "/payins" },
      { label: "orderDetails", active: true },
    ];
  }

  loadPaymentDetails(paymentId: string): void {
    console.log("=== CARREGANDO DETALHES DO PAYIN ===");
    console.log("ID do payin:", paymentId);

    this.isLoading = true;

    this.payinsService.getPayinById(paymentId).subscribe({
      next: (response) => {
        console.log("=== RESPOSTA DA API PAYIN ===");
        console.log("Response completa:", response);
        console.log("Tipo da resposta:", typeof response);
        console.log("Keys da resposta:", Object.keys(response));

        // Mapeia a resposta da API para o formato local
        this.payment = this.mapApiResponseToPaymentDetail(response, paymentId);
        this.setupFields();
        this.isLoading = false;
      },
      error: (error) => {
        console.error("=== ERRO AO BUSCAR PAYIN ===");
        console.error("Erro:", error);
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
      { label: "email", value: this.payment?.recipientPixKey }, // Email do customer
      { label: "phone", value: "N/A" }, // Não disponível na interface atual
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
    ];

    this.feesFields = [
      { label: "additionalFee", value: this.payment?.additionalFee },
      { label: "fixedFee", value: this.payment?.fixedFee },
      { label: "variableFee", value: this.payment?.variableFee },
    ];

    // Campos adicionais da API
    this.additionalFields = [
      { label: "accountId", value: this.payment?.recipientAccount, copy: true },
      { label: "financialPartner", value: this.payment?.recipientBank },
      { label: "product", value: "PAYMENT" },
      { label: "", value: "" },

      { label: "additionalInfo", value: this.payment?.orderDescription },
      { label: "basePricePair", value: "0" },
      { label: "", value: "" },

      { label: "paidAt", value: (this.payment as any)?.paidAt || "N/A" },
      { label: "createdAt", value: (this.payment as any)?.createdAt || "N/A" },
      {
        label: "compensatedAt",
        value: (this.payment as any)?.compensatedAt || "N/A",
      },
      { label: "", value: "" },

      { label: "settledAt", value: (this.payment as any)?.settledAt || "N/A" },
      { label: "updatedAt", value: (this.payment as any)?.updatedAt || "N/A" },
      { label: "", value: "" },
    ];
  }

  getStatusType(status: string): "success" | "warning" | "error" {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "failed":
        return "error";
      default:
        return "warning";
    }
  }
}
