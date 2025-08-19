import { FeeItem } from "./fee-item.interface";

export interface Fee {
  id: string;
  type: string;
  companyId: string;
  description: string;
  status: string;
  currency: string;
  operationType: string;
  startDatetime: string;
  endDatetime: string;
  fees: FeeItem[];
  additionalFee: FeeItem[];
  companyName: string;
  userCreatedAt: string;
  createdAt: string;
  userUpdatedAt: string;
  updatedAt: string;
}

export interface FeesResponse {
  data: Fee[];
}
