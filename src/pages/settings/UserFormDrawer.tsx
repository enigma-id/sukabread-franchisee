/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Input, Button, Drawer, Select } from "@/components/ui";
import { useUser } from "@/services/user/hooks";
import { useAppSelector } from "@/hooks";

/** Password statik default untuk user baru (di-generate sistem, bukan input user). */
const DEFAULT_PASSWORD = "sukabread123";

/** Role default untuk user baru brand outlet. */
const DEFAULT_ROLE = "cashier";

/** Pilihan role untuk user brand outlet. */
const ROLE_OPTIONS = [
  { label: "Manager", value: "manager" },
  { label: "Kasir", value: "cashier" },
];

/**
 * Form user dalam drawer — dipakai untuk "Buat User" (mode create)
 * dan klik row di tabel (mode update, data di-prefill dari row).
 * Inner component di-key per target sehingga form selalu direset saat buka.
 */
export function UserFormDrawer({
  open,
  onClose,
  user,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  /** Row terpilih; null/undefined = mode create */
  user?: any;
  /** Dipanggil setelah create/update sukses (mis. refresh tabel) */
  onSaved?: () => void;
}) {
  const isUpdate = Boolean(user?.id);
  if (!open) return null;

  return (
    <Drawer open onClose={onClose} position='right'>
      <UserFormContent
        key={user?.id ?? "create"}
        isUpdate={isUpdate}
        userId={user?.id}
        initial={{
          name: user?.name ?? "",
          username: user?.username ?? "",
          role: user?.role,
        }}
        onClose={onClose}
        onSaved={onSaved}
      />
    </Drawer>
  );
}

function UserFormContent({
  isUpdate,
  userId,
  initial,
  onClose,
  onSaved,
}: {
  isUpdate: boolean;
  userId?: string;
  initial: { name: string; username: string; role?: string };
  onClose: () => void;
  onSaved?: () => void;
}) {
  const brandType = useAppSelector((s) => s.auth.session?.brand?.type);
  const isMitra = brandType?.toLowerCase() === "mitra";
  const isOutlet = brandType?.toLowerCase() === "outlet";

  const [form, setForm] = useState({
    name: initial.name,
    username: initial.username,
    password: isUpdate ? "" : isOutlet ? "" : DEFAULT_PASSWORD,
    confirm_password: isUpdate ? "" : isOutlet ? "" : DEFAULT_PASSWORD,
    role: initial.role ?? DEFAULT_ROLE,
  });
  const FormState = useAppSelector((s) => s.form);
  const { create, createResult, update, updateResult } = useUser();

  const result = isUpdate ? updateResult : createResult;

  if ((createResult.isSuccess || updateResult.isSuccess) && onSaved) {
    onSaved();
    onClose();
    createResult.reset?.();
    updateResult.reset?.();
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = { ...form };
    // Role hanya berlaku untuk brand outlet; mitra tetap seperti semula.
    if (!isOutlet) delete payload.role;
    if (isUpdate && userId) {
      update({ id: userId, payload });
    } else {
      create(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col h-full'>
      {/* Header */}
      <div className='flex items-start justify-between gap-3 p-5 border-b border-base-300'>
        <div>
          <h3 className='text-base font-bold text-base-content'>
            {isUpdate ? "Perbaharui Data User" : "Buat User"}
          </h3>
          <p className='text-xs text-base-content/60 mt-1'>
            {isUpdate
              ? "Edit data pengguna."
              : "Tambahkan user baru ke sistem."}
          </p>
        </div>
        <button
          type='button'
          onClick={onClose}
          className='text-base-content/50 hover:text-base-content transition-colors cursor-pointer'
          aria-label='Tutup'
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className='flex-1 overflow-y-auto p-5 space-y-4'>
        {isOutlet && (
          <Select
            name='role'
            label='Role'
            required
            value={form.role}
            onChange={handleChange}
            options={ROLE_OPTIONS}
            error={
              typeof FormState?.errors?.role === "string"
                ? FormState.errors.role
                : undefined
            }
          />
        )}
        <Input
          name='name'
          type='text'
          label='Nama Lengkap'
          required
          value={form.name}
          onChange={handleChange}
          placeholder='Masukkan nama lengkap'
          error={
            typeof FormState?.errors?.name === "string"
              ? FormState.errors.name
              : undefined
          }
        />
        <Input
          name='username'
          type='text'
          label={isMitra ? "No. Handphone" : "Username"}
          required
          value={form.username}
          onChange={handleChange}
          placeholder={
            isMitra ? "Nomor handphone untuk login" : "Username untuk login"
          }
          error={
            typeof FormState?.errors?.username === "string"
              ? FormState.errors.username
              : undefined
          }
        />
        {isUpdate || isOutlet ? (
          <>
            <Input
              name='password'
              type='password'
              label={isUpdate ? "Password Baru (opsional)" : "Password"}
              required={isOutlet && !isUpdate}
              value={form.password}
              onChange={handleChange}
              placeholder='Masukkan password'
              error={
                typeof FormState?.errors?.password === "string"
                  ? FormState.errors.password
                  : undefined
              }
              autoComplete='new-password'
            />
            <Input
              name='confirm_password'
              type='password'
              label={
                isUpdate ? "Konfirmasi Password Baru" : "Konfirmasi Password"
              }
              required={isOutlet && !isUpdate}
              value={form.confirm_password}
              onChange={handleChange}
              placeholder='Ulangi password'
              error={
                typeof FormState?.errors?.confirm_password === "string"
                  ? FormState.errors.confirm_password
                  : undefined
              }
              autoComplete='new-password'
            />
            <p className='text-xs text-base-content/50'>
              {isUpdate
                ? "Password minimal 6 karakter. Kosongkan jika tidak diubah."
                : "Password minimal 6 karakter."}
            </p>
          </>
        ) : (
          <p className='text-xs text-base-content/50'>
            Password awal user baru otomatis dibuat oleh sistem (
            <code className='font-mono font-bold'>sukabread123</code>). User
            bisa
            menggantinya setelah login.
          </p>
        )}
      </div>

      {/* Footer */}
      <div className='flex items-center justify-end gap-2 p-5 border-t border-base-300'>
        <Button
          type='button'
          variant='default'
          onClick={onClose}
          disabled={result.isLoading}
        >
          Batal
        </Button>
        <Button
          type='submit'
          variant='primary'
          isLoading={result.isLoading}
          disabled={result.isLoading}
        >
          Simpan User
        </Button>
      </div>
    </form>
  );
}
