/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Input, Button, Loading } from "@/components/ui";
import { useUser } from "@/services/user/hooks";
import { useAppSelector } from "@/hooks";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { User, Lock } from "lucide-react";

export function UserUpdate() {
  useDocumentMeta(
    "Update User | Sukabread Franchisee",
    "Edit data pengguna.",
  );
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const FormState = useAppSelector((s) => s.form);

  const { show, update, showResult, updateResult } = useUser();

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (id) {
      show({ id: id });
    }
  }, [id]);

  useEffect(() => {
    if (showResult?.isSuccess) {
      setForm({
        name: (showResult.data?.data as any).name,
        username: (showResult.data?.data as any).username,
        password: "",
        confirm_password: "",
      });
    }
  }, [showResult]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    update({ id: id, payload: form });
  };

  if (showResult.isLoading) return <Loading variant="spinner" size="lg" />;

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Settings"
        title="Perbaharui Data User"
        backTo={() => navigate("/setting/user")}
      />
      <Page.Body>
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
                    Perbaharui User
                  </h3>
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
                  isLoading={updateResult.isLoading}
                  disabled={updateResult.isLoading}
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
