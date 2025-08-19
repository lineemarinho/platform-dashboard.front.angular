import { Document } from "./document.interface";

export interface PayinApiCustomer {
  type: string;
  fullName: string;
  email: string;
  phone: string;
  birth: string;
  document: Document;
}


