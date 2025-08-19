import { Amount } from "./amount.interface";
import { PayoutAccount } from "./payout-account.interface";
import { PayoutCompany } from "./payout-company.interface";
import { PayoutData } from "./payout-data.interface";

export interface Payout {
  id: string;
  idempotencyKey: string;
  code: string;
  status: string;
  company: PayoutCompany;
  paymentMethod: string;
  amount: Amount;
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
