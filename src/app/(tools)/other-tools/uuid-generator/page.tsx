import { FaqSection, type FaqItem } from '@/components/faq-section';
import { v1, v4, v6, v7 } from 'uuid';
import { RefreshPageButton } from './_components/refresh-button';
import { UUIDCard } from './_components/uuid-card';
import { UUIDWithValue } from './_components/uuid-with-value';

const FAQS = [
  {
    title: 'Which UUID version should I use for a random identifier?',
    description:
      'UUID v4 is the random option on this page. UUID v7 also includes a timestamp and is time-sortable, while v1 and v6 are time-based variants.',
  },
  {
    title: 'When should I use UUID v3 or v5?',
    description:
      'Use v3 or v5 when you want the same name and namespace to produce the same UUID. The namespace must be a valid UUID. V3 uses MD5 and v5 uses SHA-1.',
  },
  {
    title: 'Why does refreshing a v3 or v5 namespace change its result?',
    description:
      'The name-based versions depend on both the input value and namespace. This tool starts with a generated v4 namespace, so refreshing that namespace means the same name can produce a different UUID.',
  },
  {
    title: 'Does a time-based UUID reveal information about my device?',
    description:
      'UUID v1 can include the generating machine’s MAC address. The page describes v6 as time-based without exposing the MAC address, and v7 uses a timestamp with random bits.',
  },
] satisfies readonly FaqItem[];

export default function UUIDGenerator() {
  return (
    <>
      <div className="mx-auto">
        <RefreshPageButton />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <UUIDCard title="Random UUID" subTitle="v4" value={v4()} />

        <UUIDCard title="Time based UUID" subTitle="v6" value={v6()} />

        <UUIDCard
          title="UUID v7"
          subTitle="Time + Random"
          description="Uses a 48-bit Unix epoch timestamp (millisecond precision) followed by random bits. Time-sortable and optimized for better database indexing than V1. Considered the modern best practice."
          value={v7()}
        />

        <UUIDCard
          title="UUID v6"
          subTitle="Reordered Time-based"
          description="Time-based like V1 but reorders the bits to be monotonically increasing (better for database indexing). Does not expose the MAC address (often uses a random node ID instead)."
          value={v6()}
        />

        <UUIDCard
          title="UUID v4"
          subTitle="Random (Pseudo-random numbers)"
          description="Maximum unpredictability and privacy. Not sortable by time. Higher (but still very low) theoretical collision chance compared to time-based."
          value={v4()}
        />

        <UUIDCard
          title="UUID v1"
          subTitle="Time-based + MAC Address"
          description="High uniqueness, sortable by time. Privacy concern due to including the generating machine's MAC address."
          value={v1()}
        />

        <UUIDWithValue
          type="v5"
          title="UUID v5"
          subTitle="Name-based (SHA-1 Hash)"
          description="Same use case as V3 but uses the more secure SHA-1 hashing algorithm."
        />

        <UUIDWithValue
          type="v3"
          title="UUID v3"
          subTitle="Name-based (MD5 Hash)"
          description="Deterministic. Generates the same UUID for the same namespace and input name."
        />
      </div>
      <FaqSection items={FAQS} />
    </>
  );
}
