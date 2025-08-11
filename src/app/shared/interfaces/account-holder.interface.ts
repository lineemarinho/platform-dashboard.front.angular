export interface AccountHolderDocument {
  type: string;
  number: string;
}

export interface AccountHolder {
  id: string;
  fullName: string;
  document: AccountHolderDocument;
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
