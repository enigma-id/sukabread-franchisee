import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useAppSelector } from "@/hooks";
import { Page } from "@/components/app/layout";
import { Button } from "@/components";
import { ExternalLink } from "lucide-react";
import styles from "./Purchase.module.css";

export function Purchase() {
  useDocumentMeta(
    "Purchase | Sukabread Franchisee",
    "Kelola pembelian inventaris outlet.",
  );
  const user = useAppSelector((s) => s.auth.session?.user);

  const baseUrl = import.meta.env.DEV
    ? "http://localhost:5174"
    : "https://sukabread-franchisorder-git-v2-enigma-id.vercel.app";
  // : "https://sukabread-franchisorder.vercel.app";

  const iframeUrl = user?.username
    ? `${baseUrl}?username=${user.username}`
    : "";

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="Transactions"
        title="Pembelian"
        subtitle="Order bahan dan barang."
        action={
          iframeUrl && (
            <Button
              onClick={() => window.open(iframeUrl, "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink size={18} />
              Buka di Tab Baru
            </Button>
          )
        }
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
