"use client";

import { useActionState } from "react";
import { changePassword } from "@/lib/actions/admin";
import { Button, Field, inputCls } from "./ui";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, null);
  return (
    <form action={action} className="grid gap-4">
      <Field label="მიმდინარე პაროლი">
        <input name="current" type="password" required autoComplete="current-password" className={inputCls} />
      </Field>
      <Field label="ახალი პაროლი" hint="მინიმუმ 8 სიმბოლო">
        <input name="next" type="password" required minLength={8} autoComplete="new-password" className={inputCls} />
      </Field>
      {state && <p className={`text-sm ${state.ok ? "text-green-700" : "text-red-600"}`}>{state.ok ? "პაროლი შეიცვალა ✓" : state.error}</p>}
      <Button disabled={pending}>შენახვა</Button>
    </form>
  );
}
