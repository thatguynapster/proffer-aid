import Link from 'next/link'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { donationsEnabled } from '@/lib/cms'

/**
 * Panel rendered above Payload's default dashboard.
 *
 * Doubles as the working proof that Tailwind and shadcn resolve inside the
 * admin: every class here comes from the utilities layer imported in
 * `(payload)/custom.css`, and the colours come from the shared token file, so
 * this Card is the same navy and gold as the public site.
 *
 * Imports use the `@/` alias rather than the relative paths the rest of the
 * codebase favours, because shadcn generates its components that way and
 * `npx shadcn add` will keep doing so.
 */
export async function DashboardPanel() {
  const donationsOn = await donationsEnabled()

  return (
    <Card className="mb-6 border-border bg-card">
      <CardHeader>
        <CardTitle className="text-card-foreground">Proffer Aid content</CardTitle>
        <CardDescription className="text-muted-foreground">
          Pages, updates and campaigns publish straight to the live site. Anything saved as
          a draft stays private until you publish it.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="md">
            <Link href="/admin/collections/updates">Write an update</Link>
          </Button>
          <Button asChild size="md" variant="secondary">
            <Link href="/admin/collections/campaigns">Manage campaigns</Link>
          </Button>
          <Button asChild size="md" variant="ghost">
            <Link href="/admin/collections/form-submissions">Read enquiries</Link>
          </Button>
        </div>

        {!donationsOn && (
          <Alert>
            <AlertTitle>Donations are switched off</AlertTitle>
            <AlertDescription>
              The donate page is hidden from the site and campaigns show no progress bar.
              Turn donations on in Site Settings once Paystack is connected.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
