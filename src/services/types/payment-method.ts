export interface ContractPaymentMethod {
  id: string;
  name: string;
  provider: "saldo" | "midtrans" | "xendit";
  is_active: boolean;
}
