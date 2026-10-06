import Link from 'next/link';
import { Container } from '@/components/container';
import { ArrowLeft } from 'lucide-react';
import { createSeoMetadata } from '@/lib/seo-metadata';

export const metadata = createSeoMetadata({
  title: 'Privacy Policy',
  description:
    'Learn how Dev X Kit processes tool inputs, uses browser storage and Google Analytics, and handles requests sent to the server.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-base text-muted-foreground">
          <p>
            Most tools process your input in your browser. Some conversions and file detection run
            on our server, so the relevant input is sent there for processing. Some conversions use
            a temporary file while they run. The server also uses request IP addresses to apply rate
            limits. Dev X Kit has no accounts or database for submitted content.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Browser storage</h2>
            <p>
              Depending on the tool and your storage preference, inputs and settings may be saved in
              local or session storage. A cookie remembers whether the sidebar is open. Google
              Analytics also uses cookies or similar identifiers for analytics, as described below.
              You can clear this data in your browser, though saved settings may reset.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Analytics</h2>
            <p>
              We use Google Analytics to understand how visitors use Dev X Kit, such as which pages
              are viewed. Google Analytics may use cookies or similar identifiers to collect
              information about your browser, device, and interactions with the site. This
              information is sent to Google for processing. We do not intentionally send tool inputs
              as analytics events. For details about how Google handles information, see{' '}
              <Link
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Google&apos;s Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Third-party requests</h2>
            <p>
              The code editor&apos;s assets and React type definitions are served by this site. Your
              editor content is not sent to third-party asset hosts. Links to other sites are
              subject to their privacy policies.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Dev X Kit
          </Link>
        </div>
      </div>
    </Container>
  );
}
