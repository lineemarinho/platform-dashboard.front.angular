import { Document } from "./document.interface";

export interface Holding {
  id: string;
  parentId: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  document: Document;
  country: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface HoldingsResponse {
  data: Holding[];
}
