import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShieldCheck } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">Audit & Compliance</h2>
          <p className="text-[#9C978C] text-sm font-sans">
            Review security audit logs, data provenance, and automated report runs.
          </p>
        </div>
        <Button variant="primary">Run New Audit</Button>
      </div>

      <Card className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <ShieldCheck className="h-12 w-12 text-[#3FA9E0] mb-4 stroke-[1.5]" />
        <h3 className="text-xl font-serif font-medium text-[#F5F1EA] mb-2">Automated Compliance Logs</h3>
        <p className="text-sm font-sans text-[#9C978C] max-w-md">
          All workspace events and data queries are recorded in the audit trail.
        </p>
      </Card>
    </div>
  );
}
