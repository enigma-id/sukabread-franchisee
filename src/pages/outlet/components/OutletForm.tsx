import { useState } from "react";
import { Input, Button } from "@/components";
import { useAppSelector } from "@/hooks";
import { Store, User, KeyRound } from "lucide-react";
import type { FranchiseOutlet } from "@/services/types/franchiseOutlet";

export interface OutletFormValues {
  name: string;
  recipient_name: string;
  phone: string;
  address: string;
  service_charges: number;
  // Khusus create (akun manajer)
  owner_name?: string;
  owner_username?: string;
  owner_password?: string;
  confirm_password?: string;
}

interface OutletFormProps {
  initialData?: FranchiseOutlet | null;
  isEdit?: boolean;
  submitting?: boolean;
  onCancel?: () => void;
  onSubmit: (values: OutletFormValues) => void;
}

const errorOf = (
  errors: Record<string, unknown> | undefined,
  key: string,
): string | undefined => {
  const v = errors?.[key];
  return typeof v === "string" ? v : undefined;
};

export function OutletForm({
  initialData,
  isEdit = false,
  submitting = false,
  onCancel,
  onSubmit,
}: OutletFormProps) {
  const FormState = useAppSelector((s) => s.form);

  // Data outlet di-pass setelah show sukses dari halaman Update;
  // karena form di-mount setelah data siap, inisialisasi sekali cukup.
  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    recipient_name: initialData?.recipient_name ?? "",
    phone: initialData?.phone ?? "",
    address: initialData?.address ?? "",
    service_charges: initialData?.service_charges?.toString() ?? "",
    owner_name: "",
    owner_username: "",
    owner_password: "",
    confirm_password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEdit && form.owner_password !== form.confirm_password) return;
    onSubmit({
      name: form.name,
      recipient_name: form.recipient_name,
      phone: form.phone,
      address: form.address,
      service_charges: Number(form.service_charges) || 0,
      owner_name: isEdit ? undefined : form.owner_name,
      owner_username: isEdit ? undefined : form.owner_username,
      owner_password: isEdit ? undefined : form.owner_password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='max-w-4xl mx-auto'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
        {/* Left */}
        <div className='lg:col-span-4 space-y-5'>
          <div className='bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 p-6'>
            <div className='flex flex-col items-center text-center'>
              <div className='w-16 h-16 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center mb-4'>
                <Store size={32} className='text-primary' />
              </div>
              <h3 className='text-lg font-semibold text-base-content'>
                {isEdit ? form.name || "Outlet" : "Outlet Baru"}
              </h3>
              <p className='text-sm text-base-content/60 mt-1'>
                {isEdit
                  ? form.recipient_name || "Perbarui data outlet"
                  : "Setiap outlet memiliki akun manajer sendiri"}
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className='lg:col-span-8 space-y-5'>
          <div className='bg-white rounded-2xl border border-base-300 p-6 shadow-sm'>
            <h3 className='text-base font-semibold text-base-content mb-5 flex items-center gap-2'>
              <Store size={16} className='text-primary' />
              Informasi Outlet
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <Input
                name='name'
                type='text'
                label='Nama Outlet'
                required
                value={form.name}
                onChange={handleChange}
                placeholder='Nama outlet'
                error={errorOf(FormState?.errors, "name")}
              />
              <Input
                name='recipient_name'
                type='text'
                label='Nama Penerima'
                value={form.recipient_name}
                onChange={handleChange}
                placeholder='Nama penerima barang'
                error={errorOf(FormState?.errors, "recipient_name")}
              />
              <Input
                name='phone'
                type='phone'
                label='No. HP'
                required
                value={form.phone}
                onChange={handleChange}
                placeholder='No. HP outlet'
                error={errorOf(FormState?.errors, "phone")}
              />
              <Input
                name='service_charges'
                type='number'
                label='Service Charge (%)'
                value={form.service_charges}
                onChange={handleChange}
                placeholder='0'
                error={errorOf(FormState?.errors, "service_charges")}
              />
              <div className='md:col-span-2'>
                <Input
                  name='address'
                  type='textarea'
                  label='Alamat'
                  value={form.address}
                  onChange={handleChange}
                  placeholder='Alamat outlet'
                  error={errorOf(FormState?.errors, "address")}
                />
              </div>
            </div>
          </div>

          {!isEdit && (
            <div className='bg-white rounded-2xl border border-base-300 p-6 shadow-sm'>
              <h3 className='text-base font-semibold text-base-content mb-5 flex items-center gap-2'>
                <User size={16} className='text-primary' />
                Akun Manajer Outlet
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                <Input
                  name='owner_name'
                  type='text'
                  label='Nama Manajer'
                  required
                  value={form.owner_name}
                  onChange={handleChange}
                  placeholder='Nama lengkap manajer'
                  error={errorOf(FormState?.errors, "owner_name")}
                />
                <Input
                  name='owner_username'
                  type='text'
                  label='Username'
                  required
                  value={form.owner_username}
                  onChange={handleChange}
                  placeholder='Username untuk login'
                  error={errorOf(FormState?.errors, "owner_username")}
                />
                <Input
                  name='owner_password'
                  type='password'
                  label='Password'
                  required
                  value={form.owner_password}
                  onChange={handleChange}
                  placeholder='Minimal 6 karakter'
                  autoComplete='new-password'
                  error={errorOf(FormState?.errors, "owner_password")}
                />
                <Input
                  name='confirm_password'
                  type='password'
                  label='Konfirmasi Password'
                  required
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder='Ulangi password'
                  autoComplete='new-password'
                  error={errorOf(FormState?.errors, "confirm_password")}
                />
              </div>
              <div className='flex items-start gap-3 mt-5 p-4 bg-amber-50 rounded-xl border border-amber-200/60'>
                <KeyRound size={18} className='text-amber-600 mt-0.5' />
                <p className='text-xs text-amber-700 leading-relaxed'>
                  Akun manajer ini dipakai untuk login ke aplikasi POS/outlet.
                  Simpan kredensial dengan aman.
                </p>
              </div>
            </div>
          )}

          <div className='flex items-center justify-end gap-3 bg-white rounded-2xl border border-base-300 p-4'>
            {onCancel && (
              <Button type='button' variant='default' onClick={onCancel}>
                Batal
              </Button>
            )}
            <Button type='submit' variant='primary' isLoading={submitting} disabled={submitting}>
              {isEdit ? "Simpan Perubahan" : "Simpan Outlet"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
