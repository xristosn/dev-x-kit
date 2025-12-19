import { ClientOnly } from '@/components/client-only';
import { Container } from '@/components/container';
import { SearchDialog } from '@/components/search-dialog';
import { ThemeModeToggle } from '@/components/theme-mode-toggle';
import { Button } from '@/components/ui/button';
import { NAVIGATION } from '@/lib/navigation';
import { Code, Gem, ShieldPlus } from 'lucide-react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BsGithub } from 'react-icons/bs';

const DESCRIPTION = `Instantly access a comprehensive suite of utilities, including over 40 language and data converters, formatters and generators, designed to streamline your daily tasks.`;

export const metadata: Metadata = {
  title: 'Dev X Kit',
  description: DESCRIPTION,
};

export default function Home() {
  return (
    <div className="w-full bg-linear-to-br from-purple-900/7 to-orange-900/7 sm:py-4">
      <Container className="gap-8 md:gap-16 lg:gap-28 sm:border-2 sm:border-dashed rounded-lg">
        <div>
          <div className="flex gap-4 items-center justify-between opacity-0 animate-[opacity_500ms_300ms_forwards]">
            <ClientOnly fallback={<div className="size-9" />}>
              <ThemeModeToggle />
            </ClientOnly>

            <Button asChild variant="outline" size="icon">
              <a href="https://github.com/xristosn/dev-x-kit" target='_blank'>
                <BsGithub />
              </a>
            </Button>
          </div>

          <div className="p-4 text-center flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-100 duration-500">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4 items-center justify-center">
                <Image
                  src="/favicon.png"
                  width={42}
                  height={42}
                  alt=""
                  className="relative -ml-18 object-contain"
                />
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold bg-linear-to-r from-orange-600 to-purple-800 bg-clip-text text-transparent">
                  Dev X Kit
                </h1>
              </div>

              <div className="mx-auto w-20 md:w-40 h-1 bg-linear-to-r from-orange-600 to-purple-800 rounded-full" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              The Essential <GradientText>Toolkit</GradientText> for Every{' '}
              <GradientText>Web Developer</GradientText>.
            </h2>

            <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 items-center mx-auto py-4 px-12 sm:border-2 sm:border-dashed rounded-lg min-w-0">
              <Button asChild className="min-w-50">
                <a href="#tools">Explore All Tools</a>
              </Button>
              Or
              <div>
                <SearchDialog forceOpen />
              </div>
            </div>

            <p className="text-xl text-muted-foreground">{DESCRIPTION}</p>
          </div>
        </div>

        <div className="border-b-2 border-dashed opacity-0 animate-[opacity_500ms_300ms_forwards]" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-0 animate-[opacity_500ms_400ms_forwards] lg:px-4">
          <ToolCard
            icon={<Code />}
            title={
              <>
                <strong>
                  <GradientText>{NAVIGATION.getSearchableItems().length}</GradientText>
                </strong>{' '}
                Tools in Stock
              </>
            }
            summary="All the converters, generators, and utilities you need to manage any web development task."
          />

          <ToolCard
            icon={<Gem />}
            title={
              <>
                Free, <GradientText>Forever</GradientText>.
              </>
            }
            summary={
              <>
                All tools are 100% free to use, no limits, and absolutely{' '}
                <strong>no sign-up required</strong>. Just click and start coding.
              </>
            }
          />

          <ToolCard
            icon={<ShieldPlus />}
            title={
              <>
                <GradientText>Privacy</GradientText> & Persistence
              </>
            }
            summary={
              <>
                Your input, settings, and tool preferences are{' '}
                <strong>never saved to a server database</strong>. All persistent data is stored
                locally in your browser.
              </>
            }
          />
        </div>

        <div className="border-b-2 border-dashed opacity-0 animate-[opacity_500ms_500ms_forwards]" />

        <div
          id="tools"
          className="flex flex-col gap-24 opacity-0 animate-[opacity_500ms_600ms_forwards] lg:px-4"
        >
          <h5 className="text-2xl text-center">
            All Tools ({NAVIGATION.getSearchableItems().length})
          </h5>

          {NAVIGATION.getGroupFlatRouteItems().map((group) => (
            <div key={group.fullName || group.label} className="flex flex-col gap-4">
              <div className="flex gap-4 items-center">
                {group.icon && (
                  <div className="smadow-xs p-3 rounded-xl text-lg bg-accent/80 text-accent-foreground">
                    {group.icon}
                  </div>
                )}

                <h4 className="text-2xl">{group.fullName || group.label}</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* {group.items.} */}
                {group.items.map((i) => (
                  <Link key={i.path} href={i.path}>
                    <ToolCard
                      icon={i.icon}
                      title={i.fullName || i.label}
                      summary={i.summary || ''}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

function ToolCard({
  icon,
  title,
  summary,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  summary: React.ReactNode;
}) {
  return (
    <div className="bg-card/50 bg-clip-padding backdrop-filter backdrop-blur-sm text-card-foreground border shadow-sm p-4 rounded-xl flex flex-col gap-6 transform transition duration-300 sm:hover:scale-105 sm:hover:shadow-md h-full">
      <div className="flex gap-6 items-center">
        {icon && (
          <div className="smadow-xs p-3 rounded-xl text-lg bg-accent/80 text-accent-foreground">
            {icon}
          </div>
        )}

        <h4 className="text-lg xl:text-xl 2xl:text-2xl">{title}</h4>
      </div>

      <p className="text-sm lg:text-md text-card-foreground/90">{summary}</p>
    </div>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-linear-to-r from-orange-600 to-purple-800 bg-clip-text text-transparent">
      {children}
    </span>
  );
}
