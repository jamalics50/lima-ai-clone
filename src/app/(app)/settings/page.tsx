import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2">
      <div>
        <h2 className="text-3xl font-serif font-medium tracking-tight text-[#F5F1EA]">Workspace Settings</h2>
        <p className="text-[#9C978C] text-sm font-sans">
          Configure members, API keys, and notification preferences.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <CardHeader className="p-0 border-b border-white/8 pb-4">
          <CardTitle className="text-xl">General Information</CardTitle>
          <CardDescription className="text-sm">Manage workspace identity and domain settings.</CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-sans text-[#9C978C]">Workspace Name</label>
            <input
              type="text"
              defaultValue="LIMA AI-CLONE"
              className="w-full max-w-md bg-[#141210] border border-white/8 rounded-full px-4 py-2 text-sm text-[#F5F1EA] focus:outline-none focus:border-[#3FA9E0]"
            />
          </div>
          <div className="pt-2">
            <Button variant="primary">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
