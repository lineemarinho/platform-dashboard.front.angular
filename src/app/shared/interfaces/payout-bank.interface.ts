import { PayoutBankAccountInfo } from "./payout-bank-account-info.interface";
export interface PayoutBank {
  bankName: string;
  account: PayoutBankAccountInfo;
}
