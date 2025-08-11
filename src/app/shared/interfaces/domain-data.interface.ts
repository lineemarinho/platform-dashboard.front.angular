export interface DomainData {
  id: string;
  description: string;
  value: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DomainDataResponse {
  data: DomainData[];
} 