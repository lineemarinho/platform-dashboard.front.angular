import { PayoutBank } from "./payout-bank.interface";
import { PayoutPersonalData } from "./payout-personal-data.interface";

export interface PayoutData {
  personalData: PayoutPersonalData;
  country: string;
  bank: PayoutBank;
  id: string;
}
