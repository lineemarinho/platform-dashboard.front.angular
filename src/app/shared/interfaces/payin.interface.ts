import { Amount } from "./amount.interface";
import { Document } from "./document.interface";
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

export interface TransactionApiResponse {
  internalAccount: {
    id: string;
    holder: string;
    type: string;
  };
  internalCounterpartyAccount?: {
    id: string;
    holder: string;
    type: string;
  };
  amount: string;
  balance: string;
  referenceId: string;
  currency: string;
  operationType: string;
  createdAt: string;
  description: string;
  companyId: string;
}

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

export interface Payin {
  id: string;
  idempotencyKey: string;
  code: string;
  status: string;
  company: {
    id: string;
    name: string;
    document: Document;
  };
  paymentMethod: string;
  amount: Amount;
  customer: {
    fullName: string;
    type: string;
    document: Document;
    email: string;
  };
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
