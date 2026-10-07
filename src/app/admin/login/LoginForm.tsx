"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/admin";
import { Field, inputCls, Button } from "@/components/admin/ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="grid gap-4">
      <Field label="მომხმარებელი">
        <input name="email" type="text" required autoComplete="username" autoCapitalize="none" spellCheck={false} className={inputCls} />
      </Field>
      <Field label="პაროლი">
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </Field>
      {state && !state.ok && <p className="text-sm text-red-600">{state.error}</p>}
      <Button disabled={pending}>{pending ? "შესვლა…" : "შესვლა"}</Button>
    </form>
  );
}
