export interface ProviderRoutingCompany {
  id: string;
  name: string;
}

export interface ProviderRoutingProvider {
  id: string;
  name: string;
}

export interface ProviderRouting {
  id: string;
  company: ProviderRoutingCompany;
  provider: ProviderRoutingProvider;
  ruleId: string;
  paymentMethod: string;
  accountCode: string;
  priority: number;
  enabled: boolean;
  operationType: string;
  currency: string;
  createdAt: string;
}

export interface ProviderRoutingResponse {
  data: ProviderRouting[];
} 