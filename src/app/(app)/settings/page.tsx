import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MotionWrapper } from '@/components/ui/MotionWrapper';
import { InterfaceFeedbackToggle } from '@/components/ui/InterfaceFeedbackToggle';

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 overflow-x-hidden">
      <MotionWrapper delay={0}>
        <h2 className="text-3xl font-serif font-medium tracking-tight text-foreground">Workspace Settings</h2>
        <p className="text-muted-foreground text-sm font-sans mt-1">
          Configure members, API keys, and notification preferences.
        </p>
      </MotionWrapper>

      <MotionWrapper delay={0.1}>
        <Card className="p-4 md:p-7 space-y-6 shadow-sm hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="p-0 border-b border-border pb-5">
            <CardTitle className="text-xl font-semibold">General Information</CardTitle>
            <CardDescription className="text-sm">Manage workspace identity and domain settings.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-sans font-medium text-foreground">Workspace Name</label>
              <input
                type="text"
                defaultValue="LIMA AI-CLONE"
                className="w-full max-w-md bg-background border border-border rounded-xl px-4 py-2.5 text-base lg:text-sm text-foreground focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 shadow-sm transition-all"
              />
            </div>
            <div className="pt-2">
              <Button variant="primary">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </MotionWrapper>

      {/* Interface & Motion card */}
      <MotionWrapper delay={0.2}>
        <Card className="p-4 md:p-7 space-y-6 shadow-sm hover:-translate-y-1 transition-all duration-300">
          <CardHeader className="p-0 border-b border-border pb-5">
            <CardTitle className="text-xl font-semibold">Interface &amp; Motion</CardTitle>
            <CardDescription className="text-sm">
              Control tactile feedback, spring animations, and device vibration on supported hardware.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 space-y-5">
            <InterfaceFeedbackToggle />
          </CardContent>
        </Card>
      </MotionWrapper>
    </div>
  );
}
