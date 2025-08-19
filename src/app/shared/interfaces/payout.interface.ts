import { Amount } from "./amount.interface";
import { Document } from "./document.interface";
export interface PayoutCompany {
  id: string;
  name: string;
  document: Document;
}

export interface PayoutAmount extends Amount {}

export interface PayoutAccount {
  type: string;
  fullName: string;
  document: Document;
  country?: string;
}

export interface PayoutBank {
  bankName: string;
  account: {
    ispb: string;
    bankNumber: string;
    branchNumber: string;
    accountNumber: string;
    accountType: string;
  };
}

export interface PayoutPersonalData {
  type: string;
  fullName: string;
  document: Document;
  country: string;
}

export interface PayoutData {
  personalData: PayoutPersonalData;
  country: string;
  bank: PayoutBank;
  id: string;
}

export interface Payout {
  id: string;
  idempotencyKey: string;
  code: string;
  status: string;
  company: PayoutCompany;
  paymentMethod: string;
  amount: PayoutAmount;
  senderAccount: PayoutAccount;
  receiverAccount: PayoutAccount;
  paidAt: string;
  createdAt: string;
  compensatedAt: string;
  settledAt: string;
  canceledAt: string;
  financialPartner: string;
  origin: string;
  product: string;
  payout: PayoutData;
  feeAdd: string;
  feeFix: string;
  feeVar: string;
  refundedAt: string;
}

export interface PayoutsResponse {
  data: Payout[];
}
