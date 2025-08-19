import { Document } from "./document.interface";

export interface PayoutAccount {
  type: string;
  fullName: string;
  document: Document;
  country?: string;
}
