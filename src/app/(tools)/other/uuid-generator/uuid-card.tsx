import { CopyIconButton } from '@/components/copy-button';

export interface UUIDCardProps extends React.PropsWithChildren {
  title: string;
  subTitle?: string;
  description?: string;
  value: string;
}

export const UUIDCard: React.FC<UUIDCardProps> = ({
  title,
  subTitle,
  description,
  value,
  children,
}) => (
  <div className="flex flex-col gap-6 bg-card p-4 rounded-xl shadow-sm">
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <h4 className="text-2xl">{title}</h4>

        {subTitle && (
          <>
            <span>|</span>
            <p className="text-sm text-muted-foreground">{subTitle}</p>
          </>
        )}
      </div>

      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>

    {children}

    <div className="flex flex-wrap gap-4 items-center justify-center">
      <p className="text-xl select-all">{value || '-'}</p>

      <CopyIconButton value={value} size="icon-lg" variant="outline" disabled={!value} />
    </div>
  </div>
);
