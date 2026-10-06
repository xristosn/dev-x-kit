import Link from 'next/link';
import { Container } from '@/components/container';
import { ArrowLeft } from 'lucide-react';
import { createSeoMetadata } from '@/lib/seo-metadata';

export const metadata = createSeoMetadata({
  title: 'Terms of Use',
  description:
    'Review the terms for using Dev X Kit developer tools, including tool output, privacy, and source-code branding.',
  path: '/terms-of-use',
});

export default function TermsPage() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8">Terms of Use</h1>

        <div className="space-y-6 text-base text-muted-foreground">
          <p>These terms describe the use of Dev X Kit and its tools.</p>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Using the tools</h2>
            <p>
              Tools may produce errors or results that do not fit your needs. Check the output
              before relying on it, especially before using it in production. Tools and features may
              change or become unavailable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Processing and privacy</h2>
            <p>
              Most tools process input in your browser. Some conversions and file detection send
              relevant input to our server, and some conversions use temporary files. The server
              uses request IP addresses for rate limiting. We do not have accounts or a database for
              submitted content. Inputs and settings may be saved in browser storage depending on
              the tool and your storage preference. See our{' '}
              <Link
                href="/privacy-policy"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Privacy Policy
              </Link>{' '}
              for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Source code and branding</h2>
            <p>
              The project source code is licensed under the MIT License. That license does not grant
              permission to use the Dev X Kit name, logo, or branding. See the{' '}
              <Link
                href="https://github.com/xristosn/dev-x-kit/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                license text
              </Link>{' '}
              for its terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
            <p>
              For questions about these terms, contact the project through the{' '}
              <Link
                href="https://github.com/xristosn/dev-x-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                GitHub repository
              </Link>
              .
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
