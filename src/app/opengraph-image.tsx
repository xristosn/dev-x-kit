import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt = 'Dev X Kit, free online developer tools for everyday coding tasks';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), 'public/favicon2.png'));
  const logoData = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 72px',
        color: '#f8fafc',
        background: 'linear-gradient(135deg, #0f172a 0%, #111827 65%, #064e3b 100%)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoData} alt="Dev X Kit app icon" width={96} height={96} />
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 0.5 }}>Dev X Kit</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 1000 }}>
        <div style={{ fontSize: 66, lineHeight: 1.08, fontWeight: 700 }}>
          Free online developer tools
        </div>
        <div style={{ fontSize: 40, lineHeight: 1.2, color: '#a7f3d0' }}>
          for everyday coding tasks.
        </div>
      </div>

      <div
        style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 22, color: '#cbd5e1' }}
      >
        <span>Code converters</span>
        <span style={{ color: '#34d399' }}>·</span>
        <span>CSS and color tools</span>
        <span style={{ color: '#34d399' }}>·</span>
        <span>No account needed</span>
      </div>
    </div>,
    size
  );
}
