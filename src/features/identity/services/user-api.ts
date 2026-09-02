import { User, Role } from '../types';

// Mock service for Phase 1
const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "somchai.m",
    email: "somchai.m@doipham.go.th",
    firstName: "สมชาย",
    lastName: "มั่นคง",
    position: "ผู้อำนวยการกองช่าง",
    departmentId: "d1",
    departmentName: "กองช่าง",
    roles: ["DEPARTMENT_HEAD"],
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    username: "admin",
    email: "admin@doipham.go.th",
    firstName: "ผู้ดูแลระบบ",
    lastName: "ระบบสารบรรณ",
    position: "นักวิชาการคอมพิวเตอร์",
    departmentId: "d0",
    departmentName: "สำนักปลัด",
    roles: ["ADMIN"],
    status: "ACTIVE",
    createdAt: new Date().toISOString()
  }
];

export const userApi = {
  getUsers: async (): Promise<User[]> => {
    // In real app: return apiClient.get('/users')
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_USERS), 500));
  },
  
  getRoles: async (): Promise<Role[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([
      { id: "r1", name: "ADMIN", description: "ผู้ดูแลระบบ", permissions: ["ALL"] },
      { id: "r2", name: "DEPARTMENT_HEAD", description: "ผู้อำนวยการกอง", permissions: ["DOCUMENT_APPROVE", "DOCUMENT_VIEW"] },
      { id: "r3", name: "USER", description: "เจ้าหน้าที่", permissions: ["DOCUMENT_VIEW", "DOCUMENT_CREATE"] }
    ]), 300));
  }
};
