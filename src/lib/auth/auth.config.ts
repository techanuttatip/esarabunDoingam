import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "ระบบสารบรรณอิเล็กทรอนิกส์",
      credentials: {
        username: { label: "ชื่อผู้ใช้", type: "text" },
        password: { label: "รหัสผ่าน", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username) return null;
        
        const username = String(credentials.username).trim();

        // Built-in authentication for system accounts
        const testAccounts: Record<string, { id: string; name: string; email: string; roles: string[]; position: string }> = {
          admin: {
            id: "e4a2d8a0-4a8a-4c22-9f33-111111111111",
            name: "นายสมศักดิ์ สุขใจ (Super Admin)",
            email: "admin@doigam.go.th",
            roles: ["SUPER_ADMIN", "ADMIN"],
            position: "ผู้ดูแลระบบสูงสุด",
          },
          sarabun01: {
            id: "e4a2d8a0-4a8a-4c22-9f33-222222222222",
            name: "นางสาวนภา วงศ์ใหญ่ (เจ้าหน้าที่สารบรรณ)",
            email: "sarabun@doigam.go.th",
            roles: ["SARABUN_CENTRAL", "CLERK"],
            position: "เจ้าพนักงานธุรการชำนาญงาน (สารบรรณกลาง)",
          },
          staff01: {
            id: "e4a2d8a0-4a8a-4c22-9f33-333333333333",
            name: "นายวิชัย ใจดี (เจ้าหน้าที่)",
            email: "staff@doigam.go.th",
            roles: ["STAFF"],
            position: "นักวิชาการเงินและบัญชีปฏิบัติการ",
          },
          head01: {
            id: "e4a2d8a0-4a8a-4c22-9f33-444444444444",
            name: "นายประเสริฐ ยิ่งยง (หัวหน้าส่วนราชการ)",
            email: "head@doigam.go.th",
            roles: ["DEPARTMENT_HEAD"],
            position: "ผู้อำนวยการกองช่าง",
          },
          executive01: {
            id: "e4a2d8a0-4a8a-4c22-9f33-555555555555",
            name: "นายประสิทธิ์ มั่นคง (นายก อบต.)",
            email: "exec@doigam.go.th",
            roles: ["EXECUTIVE"],
            position: "นายกองค์การบริหารส่วนตำบลดอยงาม",
          },
        };

        if (testAccounts[username]) {
          return testAccounts[username];
        }

        // Fallback for any standard user
        return {
          id: "custom-user-id",
          name: username,
          email: `${username}@doigam.go.th`,
          roles: ["STAFF"],
          position: "เจ้าหน้าที่",
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
