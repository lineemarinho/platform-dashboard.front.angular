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
