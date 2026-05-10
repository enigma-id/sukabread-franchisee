import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Input, Button } from "@/components/ui";
import { useUser } from "@/services/user/hooks";
import { useAppSelector } from "@/hooks";
import { User, Lock } from "lucide-react";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function UserCreate() {
  useDocumentMeta("UserCreate | Sukabread Franchisee", "Manage your UserCreate efficiently within the Sukabread Franchisee portal.");
  const navigate = useNavigate();
  const FormState = useAppSelector((s) => s.form);
  const { create, createResult } = useUser();

  const [form, setForm] = useState({
    name: "",
    username: "",
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
    if (form.password !== form.confirm_password) return;
    create(form);
  };

  if (createResult.isSuccess) {
    navigate("/setting/user");
  }

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Buat User"
        backTo={() => navigate("/setting/user")}
      />
      <Page.Body className="p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - 4 cols */}
            <div className="lg:col-span-4 space-y-5">
              {/* User Icon Card */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center mb-4">
                    <User size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-base-content">
                    User Baru
                  </h3>
                  <p className="text-sm text-base-content/60 mt-1">
                    Tambahkan user baru ke sistem
                  </p>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-white rounded-2xl border border-base-300 p-5">
                <div className="flex items-start gap-3">
                  <Lock size={20} className="text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-base-content">
                      Password Minimal 8 Karakter
                    </p>
                    <p className="text-xs text-base-content/60 mt-1">
                      Gunakan kombinasi huruf besar, kecil, dan angka.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - 8 cols */}
            <div className="lg:col-span-8 space-y-5">
              {/* Basic Info Card */}
              <div className="bg-white rounded-2xl border border-base-300 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-base-content mb-5">
                  Informasi Dasar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    variant="primary"
                    name="name"
                    type="text"
                    label="Nama Lengkap"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    error={
                      typeof FormState?.errors?.name === "string"
                        ? FormState.errors.name
                        : undefined
                    }
                  />
                  <Input
                    variant="primary"
                    name="username"
                    type="text"
                    label="Username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username untuk login"
                    error={
                      typeof FormState?.errors?.username === "string"
                        ? FormState.errors.username
                        : undefined
                    }
                  />
                </div>
              </div>

              {/* Password Card */}
              <div className="bg-white rounded-2xl border border-base-300 p-6 shadow-sm">
                <h3 className="text-base font-semibold text-base-content mb-5">
                  Password
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    variant="primary"
                    name="password"
                    type="password"
                    label="Password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    error={
                      typeof FormState?.errors?.password === "string"
                        ? FormState.errors.password
                        : undefined
                    }
                    autoComplete="new-password"
                  />
                  <Input
                    variant="primary"
                    name="confirm_password"
                    type="password"
                    label="Konfirmasi Password"
                    required
                    value={form.confirm_password}
                    onChange={handleChange}
                    placeholder="Ulangi password"
                    error={
                      typeof FormState?.errors?.confirm_password === "string"
                        ? FormState.errors.confirm_password
                        : undefined
                    }
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 bg-white rounded-2xl border border-base-300 p-4">
                <Button
                  type="button"
                  variant="default"
                  onClick={() => navigate("/setting/user")}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={createResult.isLoading}
                  disabled={createResult.isLoading}
                >
                  Simpan User
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Page.Body>
    </Page>
  );
}
