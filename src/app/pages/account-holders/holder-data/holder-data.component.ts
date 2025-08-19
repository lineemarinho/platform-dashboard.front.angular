import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "../../../core/services/toast.service";
import type { AccountFilter } from "../../../shared/components/account-filter-tab/account-filter-tab.component";
import { AccountFilterTabComponent } from "../../../shared/components/account-filter-tab/account-filter-tab.component";
import type { BalanceCard } from "../../../shared/components/balance-card/balance-card.component";
import { BalanceCardComponent } from "../../../shared/components/balance-card/balance-card.component";
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from "../../../shared/components/breadcrumb/breadcrumb.component";
import type { EditNicknameData } from "../../../shared/components/edit-nickname-modal/edit-nickname-modal.component";
import { EditNicknameModalComponent } from "../../../shared/components/edit-nickname-modal/edit-nickname-modal.component";
import { InfoFieldComponent } from "../../../shared/components/info-field/info-field.component";
import type {
  WithdrawalData,
  WithdrawalRequest,
} from "../../../shared/components/withdrawal-modal/withdrawal-modal.component";
import { WithdrawalModalComponent } from "../../../shared/components/withdrawal-modal/withdrawal-modal.component";
import { LocalePipe } from "../../../shared/pipes/locale.pipe";

export interface HolderDetail {
  id: string;
  fullName: string;
  document: string;
  birthDate: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  street: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  bankAccounts: BankAccount[];
}

export interface BankAccount {
  id: string;
  bankName: string;
  agency: string;
  account: string;
  accountType: string;
  ispb: string;
  isActive: boolean;
}

@Component({
  selector: "app-holder-data",
  standalone: true,
  imports: [
    CommonModule,
    AccountFilterTabComponent,
    BreadcrumbComponent,
    InfoFieldComponent,
    LocalePipe,
    BalanceCardComponent,
    EditNicknameModalComponent,
    WithdrawalModalComponent,
  ],
  templateUrl: "./holder-data.component.html",
  styleUrls: ["./holder-data.component.css"],
})
export class HolderDataComponent implements OnInit {
  holder: HolderDetail | null = null;
  activeTab: "personal" | "bank" = "personal";
  personalFields: any[] = [];
  addressFields: any[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];

  gatewayBalances: BalanceCard[] = [];
  gowdBalances: BalanceCard[] = [];
  selectedAccountType = "Administrativa";

  gatewayFilters: AccountFilter[] = [];
  gowdFilters: AccountFilter[] = [];

  isEditNicknameModalOpen = false;
  isWithdrawalModalOpen = false;
  editNicknameData: EditNicknameData | null = null;
  withdrawalData: WithdrawalData | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.setupBreadcrumb();
    this.route.params.subscribe((params: any) => {
      const holderId = params["id"];
      if (holderId) {
        this.loadHolderDetails(holderId);
      }
    });
  }

  setupBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: "accountHolders", route: "/account-holders" },
      { label: "holderData", active: true },
    ];
  }

  loadHolderDetails(holderId: string): void {
    this.holder = {
      id: holderId,
      fullName: "João Silva Santos",
      document: "123.456.789-00",
      birthDate: "15/03/1985",
      email: "joao.silva@email.com",
      createdAt: "2024-01-15 10:30",
      updatedAt: "2024-12-20 14:45",
      street: "Rua das Flores, 123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      country: "Brasil",
      bankAccounts: [
        {
          id: "1",
          bankName: "Banco do Brasil",
          agency: "1234",
          account: "12345-6",
          accountType: "Conta Corrente",
          ispb: "00000000",
          isActive: true,
        },
        {
          id: "2",
          bankName: "Itaú",
          agency: "5678",
          account: "98765-4",
          accountType: "Conta Poupança",
          ispb: "60746948",
          isActive: false,
        },
      ],
    };

    this.setupFields();
    this.loadBalanceCards();
    this.loadAccountFilters();
  }

  loadBalanceCards(): void {
    this.gatewayBalances = [
      {
        id: "1",
        type: "Administrativa",
        nickname: "Administrativa",
        currency: "CLP",
        amount: 30000,
        flag: "CL",
        canWithdraw: true,
        canEdit: true,
      },
      {
        id: "2",
        type: "Administrativa",
        nickname: "Administrativa",
        currency: "BRL",
        amount: 759.94,
        flag: "BR",
        canWithdraw: true,
        canEdit: true,
      },
      {
        id: "3",
        type: "Administrativa",
        nickname: "Administrativa",
        currency: "USDT",
        amount: 3890.86,
        flag: "USDT",
        canWithdraw: true,
        canEdit: true,
      },
    ];

    this.gowdBalances = [
      {
        id: "4",
        type: "Pagamento",
        nickname: "Pagamento",
        currency: "ARS",
        amount: 598532,
        flag: "AR",
        canWithdraw: false,
        canEdit: true,
      },
      {
        id: "5",
        type: "Pagamento",
        nickname: "Pagamento",
        currency: "USDT",
        amount: 3890.86,
        flag: "CL",
        canWithdraw: false,
        canEdit: true,
      },
    ];
  }

  loadAccountFilters(): void {
    this.gatewayFilters = [
      { type: "Secundaria", nickname: "Secundaria", hasEdit: true },
      {
        type: "Bloqueio Judicial",
        nickname: "Bloqueio Judicial",
        hasEdit: true,
      },
    ];
  }

  setupFields() {
    this.personalFields = [
      { label: "fullName", value: this.holder?.fullName },
      { label: "document", value: this.holder?.document },
      { label: "birthDate", value: this.holder?.birthDate },

      { label: "email", value: this.holder?.email },
      { label: "createdAt", value: this.holder?.createdAt },
      { label: "updatedAt", value: this.holder?.updatedAt },

      { label: "divider", value: "divider" },
    ];

    this.addressFields = [
      { label: "street", value: this.holder?.street },
      { label: "complement", value: this.holder?.complement },
      { label: "", value: "" },

      { label: "neighborhood", value: this.holder?.neighborhood },
      { label: "city", value: this.holder?.city },
      { label: "state", value: this.holder?.state },

      { label: "zipCode", value: this.holder?.zipCode },
      { label: "country", value: this.holder?.country },
      { label: "", value: "" },

      { label: "divider", value: "divider" },
    ];
  }

  onBack(): void {
    this.router.navigate(["/account-holders"]);
  }

  onCopyToClipboard(text: string, fieldName: string): void {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.toastService.success("Copiado para a área de transferência!");
      });
    }
  }

  setActiveTab(tab: "personal" | "bank"): void {
    this.activeTab = tab;
  }

  onEditNickname(balance: BalanceCard): void {
    this.editNicknameData = {
      type: balance.type,
      nickname: balance.nickname,
    };
    this.isEditNicknameModalOpen = true;
  }

  onFilterSelect(filterType: string): void {
    this.selectedAccountType = filterType;
  }

  onEditFilterNickname(filter: AccountFilter): void {
    this.editNicknameData = {
      type: filter.type,
      nickname: filter.nickname,
    };
    this.isEditNicknameModalOpen = true;
  }

  onRequestWithdrawal(balance: BalanceCard): void {
    this.withdrawalData = {
      currency: balance.currency,
      amount: balance.amount,
      flag: balance.flag,
      availableTypes: ["Administrativa", "Secundaria"],
    };
    this.isWithdrawalModalOpen = true;
  }

  onViewStatement(balance: BalanceCard): void {
    this.toastService.info("Funcionalidade de extrato em desenvolvimento");
  }

  onCloseEditNicknameModal(): void {
    this.isEditNicknameModalOpen = false;
    this.editNicknameData = null;
  }

  onSaveNickname(nickname: string): void {
    this.toastService.success("Apelido alterado com sucesso!");
    this.onCloseEditNicknameModal();
  }

  onCloseWithdrawalModal(): void {
    this.isWithdrawalModalOpen = false;
    this.withdrawalData = null;
  }

  onRequestWithdrawalSubmit(request: WithdrawalRequest): void {
    this.toastService.success("Solicitação de saque enviada com sucesso!");
    this.onCloseWithdrawalModal();
  }
}
