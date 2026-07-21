/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Page } from "@/components/app/layout";
import { Input, Button } from "@/components/ui";
import { useEnigmaUI } from "@/components/enigma";
import { useOutlet } from "@/services/outlet/hooks";
import { useAppSelector } from "@/hooks";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function OutletSettings() {
  useDocumentMeta(
    "Pengaturan Outlet | Sukabread Franchisee",
    "Kelola pengaturan operasional outlet Anda.",
  );

  const { update, updateResult } = useOutlet();
  const { showToast } = useEnigmaUI();
  const outlet = useAppSelector((s) => s.auth.session?.outlet); // Assuming outlet info is here
  const FormState = useAppSelector((s) => s.form);

  const [form, setForm] = useState(outlet?.service_charges?.toString() ?? "0");

  useEffect(() => {
    if (outlet) {
      setForm(outlet.service_charges.toString());
    }
  }, [outlet]);

  useEffect(() => {
    if (updateResult?.isSuccess) {
      showToast({
        message: "Service charge berhasil di update",
        type: "success",
        position: "bottom-center",
        duration: 4000,
      });
      updateResult?.reset?.();
    }
  }, [updateResult?.isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      service_charges: Number(form),
    };
    await update({ payload });
  };

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header category="Settings" title="Pengaturan Outlet" />
      <Page.Body className="p-6">
        <div className="w-full max-w-md mx-auto bg-white rounded-2xl border border-base-300 p-6 shadow-sm">
          <h3 className="text-base font-semibold text-base-content mb-6">
            Konfigurasi Operasional
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="service_charges"
              type="number"
              label="Biaya Layanan (%)"
              value={form}
              onChange={(e) => setForm(e.target.value)}
              error={
                typeof FormState?.errors?.service_charges === "string"
                  ? FormState.errors.service_charges
                  : undefined
              }
              placeholder="Masukkan persentase biaya layanan"
            />
            <Button
              type="submit"
              variant="primary"
              isLoading={updateResult?.isLoading}
              className="w-full"
            >
              Simpan Perubahan
            </Button>
          </form>
        </div>
      </Page.Body>
    </Page>
  );
}
