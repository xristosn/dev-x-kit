import { v7, v6, v4, v1 } from 'uuid';
import { RefreshPageButton } from './refresh-button';
import { UUIDCard } from './uuid-card';
import { UUIDWithValue } from './uuid-with-value';

import { Container } from '@/components/container';

export default function UUIDGenerator() {
  return (
    <Container className="xl:max-w-8xl">
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
    </Container>
  );
}
