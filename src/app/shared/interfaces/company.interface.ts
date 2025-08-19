import { CompanyAccount } from "./company-account.interface";
import { CompanyHolding } from "./company-holding.interface";
import { Document } from "./document.interface";

export interface Company {
  id: string;
  name: string;
  status: string;
  country: string;
  accounts: CompanyAccount[];
  holding: CompanyHolding;
  createdAt: string;
  document: Document;
}

export interface CompaniesResponse {
  data: Company[];
}
