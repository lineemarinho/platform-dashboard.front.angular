import { Amount } from "./amount.interface";
import { Document } from "./document.interface";
import { TransactionApiResponse } from "./transaction-api-response.interface";

export interface PayinApiResponse {
  id: string;
  idempotencyKey?: string;
  code: string;
  additionalInfo?: string;
  status: string;
  company: {
    id: string;
    name: string;
    document: Document;
  };
  paymentMethod: string;
  amount: Amount;
  amountClient: string;
  feeFix: string;
  feeVar: string;
  feeAdd: string;
  transactions: TransactionApiResponse[];
  customer: {
    type: string;
    fullName: string;
    email: string;
    phone: string;
    birth: string;
    document: Document;
  };
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
