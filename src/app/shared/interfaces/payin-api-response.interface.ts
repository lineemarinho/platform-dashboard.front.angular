import { Amount } from "./amount.interface";
import { PayinApiCustomer } from "./payin-api-customer.interface";
import { PayinCompany } from "./payin-company.interface";
import { TransactionApiResponse } from "./transaction-api-response.interface";

export interface PayinApiResponse {
  id: string;
  idempotencyKey?: string;
  code: string;
  additionalInfo?: string;
  status: string;
  company: PayinCompany;
  paymentMethod: string;
  amount: Amount;
  amountClient: string;
  feeFix: string;
  feeVar: string;
  feeAdd: string;
  transactions: TransactionApiResponse[];
  customer: PayinApiCustomer;
  paidAt?: string;
  createdAt: string;
  basePricePair: string;
  updatedAt: string;
  compensatedAt?: string;
  settledAt?: string;
  baseAmount: Amount;
  financialPartner: string;
  origin: string;
  product: string;
  payer: any;
  accountId?: string;
}
