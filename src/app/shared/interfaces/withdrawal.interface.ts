export interface Withdrawal {
  id: string;
  fullName: string;
  status: string;
  operationType: string;
  currency: string;
  requestedValue: string;
  value: string;
  createdAt: string;
}

export interface WithdrawalsResponse {
  data: Withdrawal[];
}
