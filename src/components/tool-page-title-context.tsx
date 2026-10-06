'use client';

import type { NavigationBreadcrumbItem } from '@/types/navigation';
import { createContext, useContext } from 'react';

export type ToolPageContextValue = {
  title: string;
  description?: string;
  breadcrumbs?: NavigationBreadcrumbItem[];
};

type ToolPageTitleProviderProps = React.PropsWithChildren & ToolPageContextValue;

const ToolPageContext = createContext<ToolPageContextValue | undefined>(undefined);

export const ToolPageTitleProvider: React.FC<ToolPageTitleProviderProps> = ({
  title,
  description,
  breadcrumbs,
  children,
}) => (
  <ToolPageContext.Provider value={{ title, description, breadcrumbs }}>
    {children}
  </ToolPageContext.Provider>
);

export const useToolPageContext = () => useContext(ToolPageContext);
