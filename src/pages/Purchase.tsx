import { useAppSelector } from "@/hooks";
import { Page } from "@/components/app/layout";
import styles from "./Purchase.module.css";

export function Purchase() {
  const user = useAppSelector((s) => s.auth.session?.user);

  const iframeUrl = user?.username
    ? `https://order.sukabread.com?source=share&username=${user.username}`
    : "";

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Transactions"
        title="Pembelian"
        subtitle="Order bahan dan barang."
      />
      <Page.Body>
        <div className={styles.container}>
          {iframeUrl ? (
            <iframe
              src={iframeUrl}
              className={styles.iframe}
              title="Suka Bread Order"
              allowFullScreen
            />
          ) : (
            <div className={styles.loading}>Loading...</div>
          )}
        </div>
      </Page.Body>
    </Page>
  );
}
