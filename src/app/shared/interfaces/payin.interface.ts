import { Amount } from "./amount.interface";
import { PayinCompany } from "./payin-company.interface";
import { PayinCustomer } from "./payin-customer.interface";

export interface Payin {
  id: string;
  idempotencyKey: string;
  code: string;
  status: string;
  company: PayinCompany;
  paymentMethod: string;
  amount: Amount;
  customer: PayinCustomer;
  paidAt: string;
  createdAt: string;
  compensatedAt: string;
  settledAt: string;
  canceledAt: string;
  financialPartner: string;
  origin: string;
  product: string;
  feeAdd: string;
  feeFix: string;
  feeVar: string;
  refundedAt: string;
}

export interface PayinsResponse {
  data: Payin[];
}
