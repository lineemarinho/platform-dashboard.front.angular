import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { expireGuard } from "./core/guards/expire.guard";
import { AccountHoldersComponent } from "./pages/account-holders/account-holders.component";
import { HolderDataComponent } from "./pages/account-holders/holder-data";
import { AmlsComponent } from "./pages/amls/amls.component";
import { CompaniesComponent } from "./pages/companies/companies.component";
import { DomainDataComponent } from "./pages/domain-data/domain-data.component";
import { ExtractComponent } from "./pages/extract/extract.component";
import { FeesComponent } from "./pages/fees/fees.component";
import { HoldingsComponent } from "./pages/holdings/holdings.component";
import { LoginComponent } from "./pages/login/login.component";
import { PayinsComponent } from "./pages/payins/payins.component";
import { PaymentDetailsComponent } from "./pages/payins/payment-details";
import { OrderDetailsComponent } from "./pages/payouts/order-details";
import { PayoutsComponent } from "./pages/payouts/payouts.component";
import { ProfileComponent } from "./pages/profile/profile.component";
import { ProviderRoutingComponent } from "./pages/provider-routing/provider-routing.component";
import { RefundsComponent } from "./pages/refunds/refunds.component";
import { ReportsComponent } from "./pages/reports/reports.component";
import { UsersComponent } from "./pages/users/users.component";
import { WithdrawalDetailsComponent } from "./pages/withdrawals/withdrawal-details";
import { WithdrawalsComponent } from "./pages/withdrawals/withdrawals.component";

export const routes: Routes = [
  { path: "", redirectTo: "/holdings", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  {
    path: "",
    canActivate: [authGuard, expireGuard],
    children: [
      { path: "withdrawals/:id", component: WithdrawalDetailsComponent },
      { path: "withdrawals", component: WithdrawalsComponent },
      { path: "account-holders/:id", component: HolderDataComponent },
      { path: "account-holders", component: AccountHoldersComponent },
      { path: "refunds", component: RefundsComponent },
      { path: "holdings", component: HoldingsComponent },
      { path: "companies", component: CompaniesComponent },
      { path: "payins/details", component: PaymentDetailsComponent },
      { path: "payouts/details/:id", component: OrderDetailsComponent },
      { path: "payins", component: PayinsComponent },
      { path: "payouts", component: PayoutsComponent },
      { path: "fees", component: FeesComponent },
      { path: "amls", component: AmlsComponent },
      { path: "domain-data", component: DomainDataComponent },
      { path: "provider-routing", component: ProviderRoutingComponent },
      { path: "users", component: UsersComponent },
      { path: "reports", component: ReportsComponent },
      { path: "extract", component: ExtractComponent },
      { path: "profile", component: ProfileComponent },
    ],
  },
];
