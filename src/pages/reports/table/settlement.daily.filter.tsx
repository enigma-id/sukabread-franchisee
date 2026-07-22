/* eslint-disable @typescript-eslint/no-explicit-any */

interface TableFilterProps {
  table: {
    filter: (params: any) => void;
    State:
      | {
          loading: boolean;
          filter: any;
        }
      | undefined;
  };
  periode: string;
}

const TableFilter: React.FC<TableFilterProps> = () => {
  return null;
};

export default TableFilter;
