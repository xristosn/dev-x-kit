'use client';

import { IColor } from 'react-color-palette';
import { AlertCircle, Check, Search, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PalettePreviewProps {
  bgColor: IColor;
  primaryColor: IColor;
  palette: string[];
}

export const PalettePreview: React.FC<PalettePreviewProps> = ({
  bgColor,
  primaryColor,
  palette,
}) => (
  <div
    className="p-2 sm:p-6 md:p-8 rounded-lg grid gap-6 sm:gap-8 lg:gap-12"
    style={{
      backgroundColor: bgColor.hex,
      color: primaryColor.hex,
    }}
  >
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Typography & Headers</h1>
        <p className="text-lg opacity-80 max-w-2xl">
          A demonstration of how headings and body text appear with the selected color contrast.
          Good typography is essential for readability.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">Heading Level 2</h2>
          <h3 className="text-2xl font-medium">Heading Level 3</h3>
          <h4 className="text-xl font-medium">Heading Level 4</h4>
        </div>
        <div className="space-y-4 text-sm opacity-90">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Domines, ut aiunt, luce clarior
            est. Quoniam, si dis placet, ab eo ortum, tam inportuno tamque crudeli; sin, ut aliquid
            ex ea commodi consequatur?
          </p>
          <p>
            <a href="#" className="underline underline-offset-4 font-medium hover:opacity-70">
              Inline text link example
            </a>
          </p>
        </div>
      </div>
    </section>

    <section className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h3 className="text-xl font-semibold border-b pb-2" style={{ borderColor: palette[2] }}>
          Interactive Elements
        </h3>

        <div className="flex flex-wrap gap-4">
          <Button
            className="font-semibold shadow-sm"
            style={{
              backgroundColor: primaryColor.hex,
              color: bgColor.hex,
            }}
          >
            Primary Action
          </Button>
          <Button
            className="font-semibold bg-transparent border"
            style={{
              borderColor: primaryColor.hex,
              color: primaryColor.hex,
            }}
          >
            Secondary Action
          </Button>
          <Button
            variant="ghost"
            className="font-semibold hover:bg-black/5"
            style={{
              color: primaryColor.hex,
            }}
          >
            Ghost Action
          </Button>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-medium opacity-90">Input Field</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 size-4 opacity-50" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2"
                style={{
                  borderColor: palette[4] || 'currentColor',
                  color: 'inherit',
                }}
              />
            </div>
          </div>

          <div
            className="flex items-center justify-between p-4 rounded-lg border"
            style={{ borderColor: palette[3] }}
          >
            <div className="flex items-center gap-3">
              <Settings className="size-5" />
              <span className="font-medium">Settings Toggle</span>
            </div>
            <div
              className="w-10 h-6 rounded-full relative transition-colors"
              style={{ backgroundColor: primaryColor.hex }}
            >
              <div className="absolute right-1 top-1 size-4 rounded-full bg-white shadow-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold border-b pb-2" style={{ borderColor: palette[2] }}>
          Surface & Cards
        </h3>

        <div className="grid gap-4">
          <div
            className="p-5 rounded-xl border shadow-sm"
            style={{
              backgroundColor: palette[0] || 'rgba(255,255,255,0.05)',
              borderColor: palette[2] || 'transparent',
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="p-2 rounded-lg"
                style={{
                  backgroundColor: primaryColor.hex,
                  color: bgColor.hex,
                }}
              >
                <AlertCircle className="size-5" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Important Notice</h4>
                <p className="text-sm opacity-80 mt-1">
                  This card uses a subtle background shade from the generated palette to distinguish
                  itself.
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-5 rounded-xl border shadow-sm flex items-center gap-4"
            style={{
              backgroundColor: palette[1] || 'rgba(255,255,255,0.1)',
              borderColor: palette[2] || 'transparent',
            }}
          >
            <div
              className="size-12 rounded-full flex items-center justify-center border-2"
              style={{ borderColor: primaryColor.hex }}
            >
              <User className="size-6" />
            </div>
            <div>
              <h4 className="font-bold">User Profile</h4>
              <p className="text-xs opacity-70">Active Status</p>
            </div>
            <div className="ml-auto">
              <Check className="size-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);
