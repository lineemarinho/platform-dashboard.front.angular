import { Document } from "./document.interface";

export interface PayoutPersonalData {
  type: string;
  fullName: string;
  document: Document;
  country: string;
}
