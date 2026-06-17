import { useState, useEffect } from "react";
import { Modal, Input, Button } from "@/components/ui";
import { useCatalog } from "@/services/catalog/hooks";
import { useAppSelector } from "@/hooks";
import type { CatalogOutlet } from "@/services/types/catalog";

interface StockRangeModalProps {
  item: CatalogOutlet;
  onClose: () => void;
  onSuccess: () => void;
}

export function StockRangeModal({
  item,
  onClose,
  onSuccess,
}: StockRangeModalProps) {
  const { update, updateResult } = useCatalog();
  const FormState = useAppSelector((s) => s.form);

  const [form, setForm] = useState({
    min_stock: item.min_stock.toString(),
    max_stock: item.max_stock.toString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await update({
      id: item.id,
      payload: {
        min_stock: Number(form.min_stock),
        max_stock: Number(form.max_stock),
      },
    });
  };

  useEffect(() => {
    if (updateResult.isSuccess) {
      onSuccess();
      onClose();
    }
  }, [updateResult.isSuccess, onSuccess, onClose]);

  return (
    <Modal.Wrapper open onClose={onClose}>
      <Modal.Header>{`Update Stok: ${item.name}`}</Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body className="space-y-4">
          <Input
            label="Min Stok"
            name="min_stock"
            type="number"
            value={form.min_stock}
            onChange={handleChange}
            error={FormState?.errors?.min_stock as string}
            required
          />
          <Input
            label="Max Stok"
            name="max_stock"
            type="number"
            value={form.max_stock}
            onChange={handleChange}
            error={FormState?.errors?.max_stock as string}
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="default"
            onClick={onClose}
            disabled={updateResult.isLoading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={updateResult.isLoading}
          >
            Simpan Perubahan
          </Button>
        </Modal.Footer>
      </form>
    </Modal.Wrapper>
  );
}
