export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  departmentId: string;
  departmentName?: string;
  roles: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}
