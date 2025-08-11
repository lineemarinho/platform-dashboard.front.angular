export interface RefundOrderCompany {
  id: string;
  name: string;
}

export interface RefundOrderAmount {
  currency: string;
  value: string;
}

export interface RefundOrder {
  id: string;
  company: RefundOrderCompany;
  endToEndId?: string;
  amount: RefundOrderAmount;
}

export interface RefundRequester {
  name: string;
  email: string;
}

export interface RefundHistoryStep {
  step: string;
  status: string;
  updatedAt: string;
}

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