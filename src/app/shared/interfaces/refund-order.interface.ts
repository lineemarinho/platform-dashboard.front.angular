import { Amount } from "./amount.interface";
import { RefundOrderCompany } from "./refund-order-company.interface";

export interface RefundOrder {
  id: string;
  company: RefundOrderCompany;
  endToEndId?: string;
  amount: Amount;
}
