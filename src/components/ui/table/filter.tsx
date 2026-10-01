import React, { type ReactNode } from "react";

interface TableFilterProps {
  children?: ReactNode;
}

/**
 * Filter inline untuk tabel — kontrol langsung tampil (tanpa tombol/panel,
 * tanpa label, tanpa tombol Clear) dan auto-apply saat berubah.
 */
const TableFilter: React.FC<TableFilterProps> = ({ children }) => {
  return <div className='flex w-full flex-wrap items-end gap-3'>{children}</div>;
};

export default React.memo(TableFilter);
