export interface CashierOption {
  id: string;
  name: string;
  username?: string;
  role?: string;
}

export interface SelectCashierProps {
  /** ID kasir/operator terpilih. */
  value?: string | null;
  /** Dipanggil dengan ID kasir, atau `null` saat dikosongkan. */
  onChange?: (id: string | null) => void;
  label?: string;
  placeholder?: string;
  inputClassName?: string;
  disabled?: boolean;
  /** Sembunyikan tanpa unmount (mis. saat kasir dikunci di drill-down). */
  hidden?: boolean;
}
