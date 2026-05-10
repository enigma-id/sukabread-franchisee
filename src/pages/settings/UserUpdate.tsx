import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "@/components/app/layout";
import { Input, Button, Loading } from "@/components/ui";
import { useUser } from "@/services/user/hooks";
import { useAppSelector } from "@/hooks";

export function UserUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const FormState = useAppSelector((s) => s.form);

  const { show, update, showResult } = useUser();

  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (id) {
      show({ id: Number(id) });
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
    update({ id: Number(id), payload: form });
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
        <div className="max-w-lg">
          <form onSubmit={handleSubmit} className="card-form p-6 space-y-5">
            <Input label="Nama" name="name" value={form.name} disabled />
            <Input
              label="Username"
              name="username"
              value={form.username}
              disabled
            />

            <div className="border-t border-base-300 pt-5 mt-1">
              <h3 className="text-sm font-medium text-base-content mb-4">
                Ganti Password (Opsional)
              </h3>
              <div className="space-y-4">
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
                  placeholder="Kosongkan jika tidak diubah"
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
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary">
                Simpan
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={() => navigate("/setting/user")}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      </Page.Body>
    </Page>
  );
}
