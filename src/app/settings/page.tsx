import AppLayout from "@/components/layout/AppLayout";
import SettingsForm from "@/components/settings/SettingsForm";
import DeleteInventoryButton from "@/components/settings/DeleteInventoryButton";
import { prisma } from "@/lib/prisma";

async function getSettingsData() {
  const user = await prisma.user.findFirst({
    include: { organization: true },
  });
  const org = await prisma.organization.findFirst();

  return { user, org };
}

export default async function SettingsPage() {
  const { user, org } = await getSettingsData();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">No user found. Please run seed first.</p>
      </div>
    );
  }

  return (
    <AppLayout orgName={org?.name ?? "NexusFlow"}>
      <div className="flex-1 p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your profile and organization
          </p>
        </div>

        <div className="max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <SettingsForm
            userId={user.id}
            orgId={org?.id ?? ""}
            userName={user.name}
            organizationName={org?.name ?? ""}
          />
        </div>

        {/* Danger Zone */}
        <div className="mt-8 max-w-xl">
          <DeleteInventoryButton />
        </div>
      </div>
    </AppLayout>
  );
}
