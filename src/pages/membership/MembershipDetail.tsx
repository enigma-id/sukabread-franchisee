import { Page } from "@/components/app/layout";
import { useParams } from "react-router-dom";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function MembershipDetail() {
  const { id } = useParams<{ id: string }>();
  useDocumentMeta("Detail Member | Sukabread Franchisee", "");

  return (
    <Page className="h-full flex flex-col min-h-0 bg-slate-50">
      <Page.Header
        category="CRM"
        title="Detail Membership"
        subtitle={`Informasi detail dan riwayat untuk member ID: ${id}`}
      />
      <Page.Body className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="font-bold text-lg mb-4">Informasi Profil</h2>
             {/* Detail content goes here */}
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
             <h2 className="font-bold text-lg mb-4">Riwayat Poin (Log)</h2>
             {/* Log table goes here */}
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
