import { Container } from '@/components/container';
import { FaqSection } from '@/components/faq-section';
import ToolsFilter from '@/components/tools-filter';
import { SITE_URL } from '@/lib/constants';
import { NAVIGATION } from '@/lib/navigation';
import { createSeoMetadata, SITE_NAME } from '@/lib/seo-metadata';
import Link from 'next/link';
import { PiBracketsCurly, PiCode, PiHash } from 'react-icons/pi';
import { TbBolt, TbShield } from 'react-icons/tb';

const homepageDescription =
  'Browse free online developer tools for code conversion, formatting, CSS, images, color, and more. No account or installation needed.';

export const metadata = createSeoMetadata({
  title: 'Free Online Developer Tools & Code Converters',
  description: homepageDescription,
  path: '/',
});

const websiteStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL.toString(),
};

export default function Home() {
  return (
    <Container className="sm:py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData).replace(/</g, '\\u003c'),
        }}
      />
      <div className="flex flex-col gap-12 lg:gap-20">
        <section className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10">
          <div className="flex flex-col gap-8 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                The developer&rsquo;s utility belt -
              </span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                Dev X Kit
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Free online developer tools</span>
              <br />
              <span className="text-primary">for everyday coding tasks.</span>
            </h1>

            <div className="text-muted-foreground text-base">
              <p>
                Fast, focused tools for the everyday moments between writing code and shipping it.
              </p>
              <p>No sign-up, no noise.</p>
            </div>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-primary">
              <span className="inline-flex items-center gap-1.5">
                <PiHash className="size-4" />
                {NAVIGATION.getSearchableItems().length} free tools
              </span>
              <span className="inline-flex items-center gap-1.5">
                <TbShield className="size-4" />
                Privacy-first
              </span>
              <span className="inline-flex items-center gap-1.5">
                <TbBolt className="size-4" />
                Built for speed
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-center lg:self-start lg:pt-20">
            <div className="flex items-center gap-2 px-3 py-2 border border-primary/30 rounded-lg bg-primary/5">
              <PiCode className="size-5 text-primary" />
              <span className="text-xs font-mono text-primary leading-tight">
                Build
                <br />
                better.
              </span>
            </div>
            <span className="text-muted-foreground/60 text-xs">·····</span>
            <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-card">
              <PiBracketsCurly className="size-5 text-foreground" />
              <span className="text-xs font-mono text-foreground leading-tight">
                Ship
                <br />
                faster.
              </span>
            </div>
          </div>
        </section>

        <ToolsFilterSection />

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 pt-4">
          <div className="flex flex-col gap-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Why developers use Dev X Kit
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Small tools. Big momentum.
            </h2>
          </div>
          <div className="flex flex-col gap-4 text-muted-foreground">
            <p>
              Dev X Kit is a free collection of practical development tools for the small tasks that
              interrupt your flow. Most tools run in your browser. Some conversions and file
              detection send input to our server for processing. We don&rsquo;t have accounts or a
              database for submitted content.
            </p>
            <p>
              Every utility is fast, accessible, and built around the way developers actually work.
              Keep this toolkit bookmarked for the next time a five-second transformation would
              otherwise become a fifteen-minute search.
            </p>
          </div>
        </section>

        <FaqSection items={FAQS} />
      </div>
    </Container>
  );
}

function ToolsFilterSection() {
  const allTools = NAVIGATION.getSearchableItems();
  return <ToolsFilter initialTools={allTools} initialFilter={null} />;
}

const FAQS = [
  {
    title: 'Is Dev X Kit free to use?',
    description: <p>Yes. You can use the tools without paying or creating an account.</p>,
  },
  {
    title: 'Do I need to install anything?',
    description: (
      <p>
        No. Open a tool in your browser and use it there. Most tools run in the browser, though some
        features need a server connection to process your input.
      </p>
    ),
  },
  {
    title: 'How do I find the tool I need?',
    description: (
      <p>
        Search by name, description, or tag, or browse the category filters. On desktop, press{' '}
        <span
          className="inline-flex items-center gap-1 whitespace-nowrap"
          data-testid="homepage-search-shortcut"
        >
          <kbd>Ctrl</kbd>
          <span>+</span>
          <kbd>K</kbd>
        </span>{' '}
        to open search.
      </p>
    ),
  },
  {
    title: 'What happens to the data I enter?',
    description: (
      <p>
        Most tools process input in your browser. Some conversions and file detection send the
        relevant input to our server, and some conversions use temporary files. We don&rsquo;t have
        accounts or a database for submitted content, but the server uses request IP addresses for
        rate limiting. Inputs and settings may also be saved in your browser, depending on the tool
        and your storage preference. Read the{' '}
        <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-foreground">
          Privacy Policy
        </Link>{' '}
        for details.
      </p>
    ),
  },
] as const;
