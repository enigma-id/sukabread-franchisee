/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { Button, Input } from "@/components";
import { RemoteSelect } from "@/components/ui/select-remote";
import { DatePicker } from "@/components/ui/date-picker";
import { useAppSelector } from "@/hooks";
import { useIngredient } from "@/services/ingredient/hooks";
import type { Ingredient, SalesRequest } from "@/services/types";
import { currencyFormat } from "@/utils";
import { Plus, Store, Trash2, Truck } from "lucide-react";

export interface SalesRequestFormValues {
  outlet_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  note: string;
  shipping_date: string; // YYYY-MM-DD
  items: { catalog_id: string; quantity_ordered: number }[];
}

/** Bentuk item di state form (belum di-map ke payload) */
interface SalesRequestFormItem {
  ingredient: Ingredient | null;
  quantity_ordered: number;
}

interface SalesRequestFormProps {
  id: string;
  initialData?: SalesRequest | null;
  submitting?: boolean;
  onSubmit: (values: SalesRequestFormValues) => void;
}

const emptyItem: SalesRequestFormItem = {
  ingredient: null,
  quantity_ordered: 1,
};

const getError = (
  errors: Record<string, unknown> | undefined,
  key: string,
): string | undefined => {
  const val = errors?.[key];
  return typeof val === "string" ? val : undefined;
};

export function SalesRequestForm({
  id,
  initialData,
  submitting,
  onSubmit,
}: SalesRequestFormProps) {
  const FormState = useAppSelector((s) => s.form);
  const outlet = useAppSelector((s) => s.auth.session?.outlet);
  const { get: getIngredients, getResult: ingredientsResult } = useIngredient();

  const isEdit = Boolean(initialData);

  const [shippingDate, setShippingDate] = useState<Dayjs | null>(() =>
    initialData?.shipping_date ? dayjs(initialData.shipping_date) : dayjs(),
  );
  const [note, setNote] = useState(() => initialData?.note ?? "");
  const [items, setItems] = useState<SalesRequestFormItem[]>(() =>
    initialData?.items?.length
      ? initialData.items.map((it) => ({
          ingredient: {
            // Response detail membawa catalog_id = ref_id ingredient (id katalog di franchisor)
            ref_id: it.catalog_id,
            id: "",
            code: it.catalog_code ?? "",
            name: it.catalog_name?.trim() ?? "",
            brand_id: "",
            fraction: 0,
            measurement: "",
            unit_price: it.unit_nett ?? 0,
            unit: 0,
            is_active: true,
            created_at: "",
            updated_at: "",
          } as Ingredient,
          quantity_ordered: it.quantity_ordered || 1,
        }))
      : [{ ...emptyItem }],
  );

  useEffect(() => {
    getIngredients({ page: 1, limit: 50, is_active: "true" });
  }, []);

  const ingredients = useMemo(
    () => ((ingredientsResult?.data as any)?.data ?? []) as Ingredient[],
    [ingredientsResult?.data],
  );

  // RemoteSelect membaca hook.data = response paginated standar: { data: [...], meta? }
  // (pola sama seperti TopupCreate: spread envelope asli, override `data` jadi array)
  const ingredientsHook = useMemo(
    () => ({
      ...ingredientsResult,
      data: {
        ...(ingredientsResult?.data as any),
        data: ingredients,
      },
    }),
    [ingredientsResult, ingredients],
  );

  // Mode edit: resolve ingredient placeholder dgn record asli dari daftar ingredient
  useEffect(() => {
    if (!isEdit || items.length === 0 || ingredients.length === 0) return;
    setItems((prev) =>
      prev.map((it) => {
        // Lewati yang sudah punya nama (record asli sudah di-resolve)
        if (it.ingredient?.name) return it;
        const refId = it.ingredient?.ref_id || it.ingredient?.id;
        const found = ingredients.find(
          (ing) => ing.ref_id === refId || ing.id === refId,
        );
        return found ? { ...it, ingredient: found } : it;
      }),
    );
  }, [ingredients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validItems = items
      .filter((it) => it.ingredient)
      .map((it) => ({
        catalog_id: it.ingredient!.ref_id || it.ingredient!.id,
        quantity_ordered: Number(it.quantity_ordered) || 1,
      }));

    // Outlet & data penerima diambil dari outlet sesi login, bukan pilihan manual.
    onSubmit({
      outlet_id: outlet?.id ?? "",
      recipient_name: outlet?.recipient_name || outlet?.name || "",
      recipient_phone: outlet?.phone ?? "",
      recipient_address: outlet?.address ?? "-",
      note,
      shipping_date: shippingDate ? shippingDate.format("YYYY-MM-DD") : "",
      items: validItems,
    });
  };

  const updateItem = (
    idx: number,
    patch: Partial<
      Pick<SalesRequestFormItem, "ingredient" | "quantity_ordered">
    >,
  ) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );
  };

  const removeItem = (idx: number) => {
    setItems((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev,
    );
  };

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);

  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className='grid grid-cols-1 lg:grid-cols-12 gap-6'
    >
      {/* Informasi Request */}
      <div className='lg:col-span-6 flex flex-col gap-6'>
        <div className='bg-white rounded-xl p-5 border border-base-300 shadow-sm'>
          <h3 className='text-sm font-bold text-slate-700 uppercase mb-4 flex items-center gap-2'>
            <Truck size={16} className='text-primary' />
            Informasi Pembelian
          </h3>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <DatePicker
              label='Tanggal Pembelian'
              required
              value={shippingDate ?? undefined}
              onChange={(date) => setShippingDate((date as Dayjs) || null)}
              placeholder='Pilih tanggal'
              error={getError(FormState?.errors, "shipping_date")}
            />

            <div className='md:col-span-2'>
              <Input
                type='textarea'
                label='Catatan'
                value={note}
                onChange={(e) => setNote(e.target.value)}
                error={getError(FormState?.errors, "note")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Bahan Baku */}
      <div className='lg:col-span-6 flex flex-col'>
        <div className='bg-white rounded-xl border border-base-300 shadow-sm'>
          <div className='p-5 border-b border-base-300 bg-base-100'>
            <div className='flex items-center gap-2'>
              <Store size={16} className='text-primary' />
              <h3 className='font-semibold text-base text-base-content'>
                Daftar Bahan Baku
              </h3>
            </div>
          </div>

          <div className='p-4'>
            <div className='overflow-visible'>
              <table className='table-hover table-vcenter datatable table w-full'>
                <thead>
                  <tr>
                    <th className='text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left px-2 py-2 w-8'>
                      #
                    </th>
                    <th className='text-[11px] font-bold uppercase tracking-wider text-slate-500 text-left px-2 py-2'>
                      Bahan Baku
                    </th>
                    <th className='text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right px-2 py-2 w-32'>
                      Qty
                    </th>
                    <th className='text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right px-2 py-2 w-32'>
                      Harga
                    </th>
                    <th className='text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right px-2 py-2 w-16'></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className='px-2 py-2 text-sm text-slate-500'>
                        {idx + 1}
                      </td>
                      <td className='px-2 py-2 min-w-64'>
                        <RemoteSelect
                          placeholder='Cari bahan baku'
                          required
                          value={item.ingredient}
                          hook={ingredientsHook as any}
                          fetchData={(page, search) =>
                            getIngredients({
                              page: page || 1,
                              limit: 20,
                              search,
                              is_active: "true",
                            } as any)
                          }
                          getLabel={(ing: Ingredient) =>
                            ing.name || ing.code || ing.ref_id || ing.id
                          }
                          renderItem={(ing: Ingredient) => (
                            <div className='flex flex-col'>
                              <span className='text-sm font-medium'>
                                {ing.name}
                              </span>
                              {ing.code && (
                                <span className='text-xs text-slate-400'>
                                  {ing.code}
                                </span>
                              )}
                            </div>
                          )}
                          getValue={(ing: Ingredient) => ing.ref_id || ing.id}
                          onChange={(ing: Ingredient) =>
                            updateItem(idx, { ingredient: ing })
                          }
                          onClear={() => updateItem(idx, { ingredient: null })}
                          error={getError(
                            FormState?.errors,
                            `items.${idx}.catalog_id`,
                          )}
                        />
                      </td>
                      <td className='px-2 py-2 text-right'>
                        <Input
                          type='number'
                          min={1}
                          className='text-right'
                          value={item.quantity_ordered}
                          onChange={(e) =>
                            updateItem(idx, {
                              quantity_ordered: Number(e.target.value) || 0,
                            })
                          }
                        />
                      </td>
                      <td className='px-2 py-2 text-right text-sm font-mono text-slate-600 whitespace-nowrap'>
                        {currencyFormat(item.ingredient?.unit_price)}
                      </td>
                      <td className='px-2 py-2 text-right'>
                        <Button
                          type='button'
                          size='sm'
                          styleType='soft'
                          variant='error'
                          disabled={items.length === 1}
                          onClick={() => removeItem(idx)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button
              type='button'
              variant='primary'
              styleType='outline'
              className='mt-4 w-full border-dashed'
              onClick={addItem}
            >
              <Plus size={16} className='mr-2' />
              Tambah Item
            </Button>
          </div>
        </div>
      </div>

      <button type='submit' className='hidden' disabled={submitting} />
    </form>
  );
}
