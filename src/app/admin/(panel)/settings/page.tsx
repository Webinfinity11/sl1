import { requireAdmin } from "@/lib/auth";
import { Card, PageTitle } from "@/components/admin/ui";
import { PasswordForm } from "@/components/admin/PasswordForm";

export default async function Settings() {
  const session = await requireAdmin();
  return (
    <>
      <PageTitle>პარამეტრები</PageTitle>
      <div className="max-w-md">
        <Card title="პაროლის შეცვლა">
          <p className="text-sm text-slate-500 mb-4">ანგარიში: {session.email}</p>
          <PasswordForm />
        </Card>
      </div>
    </>
  );
}
