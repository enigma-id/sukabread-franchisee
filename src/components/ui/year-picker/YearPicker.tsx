import { useState } from "react";
import dayjs from "dayjs";
import { Dropdown } from "@/components/ui";
import { Calendar, ChevronDown } from "lucide-react";
import clsx from "clsx";

const YEARS_PER_PAGE = 12;

interface YearPickerProps {
  value?: string; // YYYY format
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  startYear?: number | null; // earliest selectable year, null = unlimited
}

export const YearPicker: React.FC<YearPickerProps> = ({
  value,
  onChange,
  placeholder = "Select year",
  className: _className,
  inputClassName,
  disabled,
  startYear = null,
}) => {
  const currentYear = dayjs().year();

  const selectedYear = value ? Number(value) : currentYear;

  // Decade window containing the selected year
  const [windowStart, setWindowStart] = useState(
    Math.floor(selectedYear / YEARS_PER_PAGE) * YEARS_PER_PAGE,
  );

  const years = Array.from(
    { length: YEARS_PER_PAGE },
    (_, i) => windowStart + i,
  );

  const isSelected = (y: number) => y === selectedYear;

  const handleYearSelect = (year: number) => {
    onChange?.(String(year));
  };

  return (
    <Dropdown
      value={value || ""}
      onChange={() => {}}
      position="end"
      disabled={disabled}
      trigger={
        <button
          className={clsx(
            "flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 group",
            inputClassName
          )}
          style={{
            height: "36px",
            minHeight: "36px",
          }}
        >
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {value ? selectedYear : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      }
      contentClassName="p-3 min-w-72"
    >
      {() => (
        <div className="flex flex-col gap-3">
          {/* Decade Controls */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
            <button
              onClick={() => setWindowStart(windowStart - YEARS_PER_PAGE)}
              disabled={startYear != null && windowStart <= startYear}
              className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 transition-all disabled:opacity-40"
            >
              <ChevronDown className="w-4 h-4 rotate-90" />
            </button>
            <span className="text-sm font-semibold text-gray-700 min-w-20 text-center">
              {windowStart} – {windowStart + YEARS_PER_PAGE - 1}
            </span>
            <button
              onClick={() => setWindowStart(windowStart + YEARS_PER_PAGE)}
              disabled={windowStart + YEARS_PER_PAGE > currentYear}
              className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:border-gray-300 flex items-center justify-center text-gray-600 transition-all disabled:opacity-40"
            >
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </button>
          </div>

          {/* Year Grid - 4 columns */}
          <div className="grid grid-cols-4 gap-2">
            {years.map((year) => {
              const isFutureYear = year > currentYear;
              const isOutOfRange =
                startYear != null && year < startYear;

              return (
                <button
                  key={year}
                  onClick={() =>
                    !isFutureYear &&
                    !isOutOfRange &&
                    handleYearSelect(year)
                  }
                  disabled={isFutureYear || isOutOfRange}
                  className={clsx(
                    "px-2 py-2 text-xs font-medium rounded-md transition-all duration-200",
                    isSelected(year)
                      ? "bg-primary text-white"
                      : isFutureYear || isOutOfRange
                        ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  {year}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Dropdown>
  );
};

export default YearPicker;
