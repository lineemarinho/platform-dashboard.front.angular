export interface CompanyAccount {
  id: string;
  type: string;
}

export interface CompanyDocument {
  type: string;
  number: string;
}

export interface CompanyHolding {
  id: string;
}

export interface Company {
  id: string;
  name: string;
  status: string;
  country: string;
  accounts: CompanyAccount[];
  holding: CompanyHolding;
  createdAt: string;
  document: CompanyDocument;
}

export interface CompaniesResponse {
  data: Company[];
}
