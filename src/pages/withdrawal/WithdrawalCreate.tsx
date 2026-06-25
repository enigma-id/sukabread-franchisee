/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input } from "@/components";
import { Page } from "@/components/app/layout";
import { useAppSelector } from "@/hooks";
import { useWithdrawal } from "@/services/withdrawal/hooks";
import { Plus, Wallet2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface WithdrawalCreateRequest {
  amount: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
  notes?: string;
}

const WithdrawalCreate = () => {
  const FormState = useAppSelector((s) => s.form);
  const navigate = useNavigate();

  const { create, createResult } = useWithdrawal();

  const [formData, setFormData] = useState<WithdrawalCreateRequest>({
    amount: "",
    bank_name: "",
    bank_account_name: "",
    bank_account_number: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount: Number(formData.amount) || 0,
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
        category="Operations"
        title="Permintaan Penarikan"
        subtitle="Kelola permintaan penarikan saldo outlet."
        backTo={() => navigate(-1)}
        action={
          <Button
            variant="primary"
            shape="wide"
            size="md"
            type="submit"
            form="withdrawal-form"
          >
            <Plus className="w-4 h-4 mr-2" />
            Simpan
          </Button>
        }
      />
      <Page.Body className="flex-1 flex flex-col min-h-0 mx-auto w-3xl">
        <form
          id="withdrawal-form"
          onSubmit={handleSubmit}
          className="space-y-6 "
        >
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
              <Wallet2Icon size={16} className="text-primary" />
              Informasi Penarikan
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

              <Input
                label="Bank Name"
                required
                value={formData.bank_name}
                onChange={(e) =>
                  setFormData({ ...formData, bank_name: e.target.value })
                }
                error={FormState?.errors?.bank_name as string}
              />

              <Input
                label="Account Name"
                required
                value={formData.bank_account_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bank_account_name: e.target.value,
                  })
                }
                error={FormState?.errors?.bank_account_name as string}
              />

              <Input
                label="Account Number"
                required
                value={formData.bank_account_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bank_account_number: e.target.value,
                  })
                }
                error={FormState?.errors?.bank_account_number as string}
              />

              <div className="col-span-2">
                <Input
                  type="textarea"
                  label="Notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  error={FormState?.errors?.notes as string}
                />
              </div>
            </div>
          </div>
        </form>
      </Page.Body>
    </Page>
  );
};

export default WithdrawalCreate;
