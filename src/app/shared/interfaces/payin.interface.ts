export interface PayinCompany {
  id: string;
  name: string;
  document: {
    type: string;
    number: string;
  };
}

export interface PayinAmount {
  currency: string;
  value: string;
}

export interface PayinCustomer {
  fullName: string;
  type: string;
  document: {
    type: string;
    number: string;
  };
  email: string;
}

export interface Payin {
  id: string;
  idempotencyKey: string;
  code: string;
  status: string;
  company: PayinCompany;
  paymentMethod: string;
  amount: PayinAmount;
  customer: PayinCustomer;
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