import Image from "next/image";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <Image src="/img/logo.webp" alt="SMARTLINE" width={160} height={40} className="mx-auto mb-6 h-auto" />
        <h1 className="text-xl font-bold text-center mb-6">ადმინ პანელი</h1>
        <LoginForm />
      </div>
    </div>
  );
}
