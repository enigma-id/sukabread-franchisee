import { useState } from "react";
import { Page } from "@/components/app/layout";
import { Input, Button } from "@/components/ui";
import { useAppSelector } from "@/hooks";
import { useAuth } from "@/services/auth/hooks";
import { User, Lock } from "lucide-react";

export function Profile() {
  const user = useAppSelector((s) => s.auth.session?.user);
  const FormState = useAppSelector((s) => s.form);
  const { doUpdateMe, updateMeResult } = useAuth();

  const [form, setForm] = useState({
    password: "",
    confirm_password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    doUpdateMe({
      password: form.password,
      confirm_password: form.confirm_password,
    });
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header category="Settings" title="Update Profile" />
      <Page.Body className="flex items-start justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl border border-base-300 p-6 shadow-sm">
            <div className="flex items-center gap-4 pb-5 border-b border-base-200">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <User size={28} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-base-content">
                  {user?.name ?? "User"}
                </h2>
                <p className="text-sm text-base-content/60">
                  @{user?.username}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-5">
              <div>
                <p className="text-xs text-base-content/50 font-medium uppercase tracking-wider mb-1">
                  Nama Lengkap
                </p>
                <p className="text-sm font-medium text-base-content">
                  {user?.name ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-base-content/50 font-medium uppercase tracking-wider mb-1">
                  Username
                </p>
                <p className="text-sm font-medium text-base-content">
                  @{user?.username ?? "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Password Form Card */}
          <div className="bg-white rounded-2xl border border-base-300 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                <Lock size={20} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-base-content">
                  Ganti Password
                </h3>
                <p className="text-xs text-base-content/50">
                  Opsional - kosongkan jika tidak diubah
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                variant="primary"
                name="password"
                type="password"
                label="Password Baru"
                value={form.password}
                onChange={handleChange}
                error={
                  typeof FormState?.errors?.password === "string"
                    ? FormState.errors.password
                    : undefined
                }
                autoComplete="new-password"
                placeholder="Masukkan password baru"
              />
              <Input
                variant="primary"
                name="confirm_password"
                type="password"
                label="Konfirmasi Password"
                value={form.confirm_password}
                onChange={handleChange}
                error={
                  typeof FormState?.errors?.confirm_password === "string"
                    ? FormState.errors.confirm_password
                    : undefined
                }
                autoComplete="new-password"
                placeholder="Ulangi password baru"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={updateMeResult?.isLoading}
                  className="w-full"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
