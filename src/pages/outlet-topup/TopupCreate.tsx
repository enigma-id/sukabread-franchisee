/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input } from "@/components";
import { Page } from "@/components/app/layout";
import { RemoteSelect } from "@/components/ui/select-remote";
import { useAppSelector } from "@/hooks";
import { useOutletTopup } from "@/services/outlet-topup/hooks";
import { usePaymentMethod } from "@/services/payment-method/hooks";
import type { ContractPaymentMethod } from "@/services/types";
import { Plus, Wallet2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TopupCreateRequest {
  amount: string;
  note?: string;
}

const TopupCreate = () => {
  const FormState = useAppSelector((s) => s.form);
  const navigate = useNavigate();

  const { create, createResult } = useOutletTopup();
  const { get: getMethods, getResult: methodsResult } = usePaymentMethod();

  const [formData, setFormData] = useState<TopupCreateRequest>({
    amount: "",
    note: "",
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<ContractPaymentMethod | null>(null);

  useEffect(() => {
    getMethods();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: Number(formData.amount) || 0,
      payment_method_id: selectedPaymentMethod?.id ?? "",
    };
    create(payload);
  };

  useEffect(() => {
    if (createResult?.isSuccess) {
      navigate(-1);
    }
  }, [createResult]);

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Finance"
        title="Topup Saldo Outlet"
        subtitle="Buat permintaan topup saldo outlet."
        backTo={() => navigate(-1)}
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            type="submit"
            form="topup-form"
          >
            <Plus className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0 mx-auto w-3xl">
        <form
          id="topup-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
              <Wallet2Icon size={16} className="text-primary" />
              Informasi Topup
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                type="currency"
                label="Amount"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                error={FormState?.errors?.amount as string}
              />

              <RemoteSelect
                label="Metode Pembayaran"
                placeholder="Pilih metode pembayaran"
                required
                value={selectedPaymentMethod}
                hook={methodsResult as any}
                fetchData={(page, search) =>
                  getMethods({ page, search } as any)
                }
                getLabel={(item: ContractPaymentMethod) => item.name}
                getValue={(item: ContractPaymentMethod) => item.id}
                onChange={(item: ContractPaymentMethod) =>
                  setSelectedPaymentMethod(item)
                }
                onClear={() => setSelectedPaymentMethod(null)}
                error={FormState?.errors?.payment_method_id as string}
              />

              <div className="col-span-2">
                <Input
                  type="textarea"
                  label="Catatan"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  error={FormState?.errors?.note as string}
                />
              </div>
            </div>
          </div>
        </form>
      </Page.Body>
    </Page>
  );
};

export default TopupCreate;
