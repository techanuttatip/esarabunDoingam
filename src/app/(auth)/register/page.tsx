"use client";

import { RegisterForm } from "../login/register-form";

export default function RegisterPage() {
  return (
    <div className="w-full">
      <RegisterForm isStandalonePage={true} />
    </div>
  );
}
