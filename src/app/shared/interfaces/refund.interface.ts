import { RefundHistoryStep } from "./refund-history-step.interface";
import { RefundOrder } from "./refund-order.interface";
import { RefundRequester } from "./refund-requester.interface";

export interface Refund {
  id: string;
  order: RefundOrder;
  provider: string;
  channel: string;
  requester: RefundRequester;
  status: string;
  history: RefundHistoryStep[];
  errorMessages: string[] | null;
  reason: string;
  amount: string;
  step: string;
  type: string;
  operationType: string;
  createdAt: string;
  updatedAt: string;
  endToEndId?: string;
}

export interface RefundsResponse {
  data: Refund[];
}
