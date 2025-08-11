export interface User {
  id: string;
  name: string;
  createdBy: string;
  status: string;
  origin: string;
  email: string;
  permissionGroups: string;
}

export interface UsersResponse {
  data: User[];
} 