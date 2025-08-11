export interface HoldingDocument {
  type: string;
  number: string;
}

export interface Holding {
  id: string;
  parentId: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  document: HoldingDocument;
  country: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface HoldingsResponse {
  data: Holding[];
}
