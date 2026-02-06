"use client";

import { useActionState, useEffect } from "react";
import { updateSettings } from "@/app/actions/settings";

type Props = {
  userId: string;
  orgId: string;
  userName: string;
  organizationName: string;
  emailNotifications: boolean;
};

export default function SettingsForm({
  userId,
  orgId,
  userName,
  organizationName,
  emailNotifications,
}: Props) {
  const [state, formAction, isPending] = useActionState(updateSettings, null);

  useEffect(() => {
    if (state?.success) {
      // Optional: show success toast or message
    }
  }, [state?.success]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="orgId" value={orgId} />

      {state?.error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Settings saved successfully.
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Your Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={userName}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          disabled={isPending}
        />
      </div>

      <div>
        <label
          htmlFor="organizationName"
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          Organization Name
        </label>
        <input
          id="organizationName"
          name="organizationName"
          type="text"
          required
          defaultValue={organizationName}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          disabled={isPending}
        />
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-4">
        <div className="flex h-5 items-center">
          <input
            id="emailNotifications"
            name="emailNotifications"
            type="checkbox"
            value="true"
            defaultChecked={emailNotifications}
            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            disabled={isPending}
          />
        </div>
        <div>
          <label
            htmlFor="emailNotifications"
            className="text-sm font-medium text-slate-900"
          >
            Email Notifications
          </label>
          <p className="text-sm text-slate-500">
            Receive email notifications when staff submit approval requests.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-70"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
