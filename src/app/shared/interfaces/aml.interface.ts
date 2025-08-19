import { AmlCompany } from "./aml-company.interface";

export interface Aml {
  id: string;
  type: string;
  description: string;
  status: string;
  company: AmlCompany;
  currency: string;
  createdAt: string;
  userCreated: string;
  updatedAt: string;
  userUpdated: string;
}

export interface AmlsResponse {
  data: Aml[];
}
