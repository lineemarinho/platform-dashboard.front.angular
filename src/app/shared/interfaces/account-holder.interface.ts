import { Document } from "./document.interface";

export interface AccountHolder {
  id: string;
  fullName: string;
  document: Document;
  email: string;
  birthdate: string;
  active: boolean;
  phone: string;
  type: string;
  companyId: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountHoldersResponse {
  data: AccountHolder[];
}
