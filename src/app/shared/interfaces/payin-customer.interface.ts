import { Document } from "./document.interface";

export interface PayinCustomer {
  fullName: string;
  type: string;
  document: Document;
  email: string;
}
