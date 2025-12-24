'use client';

import { useWebStorage } from '@/hooks/use-web-storage';
import { Container } from '@/components/container';
import { GRADIENT_PRESETS } from '@/lib/constants';
import { GradientEditor } from '@/components/color/gradient-editor';

export default function GradientEditorPage() {
  const [value, setValue] = useWebStorage('gradient-editor', 'infer', GRADIENT_PRESETS[0]);

  return (
    <Container>
      <GradientEditor value={value} setValue={setValue} />
    </Container>
  );
}
