import { currencyFormat } from "@/utils/common";

interface CurrencyTextProps {
  value: string | number | null | undefined;
  usingText?: boolean;
  prefix?: string;
  nullText?: string;
  className?: string;
}

export const CurrencyText = ({
  value,
  usingText = true,
  prefix = "Rp",
  nullText = "-",
  className,
}: CurrencyTextProps) => {
  return (
    <span className={className}>
      {currencyFormat(value, usingText, prefix, nullText)}
    </span>
  );
};
