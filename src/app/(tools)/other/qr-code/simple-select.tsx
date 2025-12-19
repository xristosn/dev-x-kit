import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { capitalize, words } from 'lodash-es';

export function SimpleSelect({
  placeholder,
  collection,
  value,
  setValue,
  format,
}: {
  placeholder?: string;
  collection: string[];
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  format?: boolean;
}) {
  return (
    <Select value={value} onValueChange={(v) => setValue(v)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder || ''} />
      </SelectTrigger>
      <SelectContent>
        {collection.map((item) => (
          <SelectItem key={item} value={item}>
            {format ? capitalize(words(item).join(' ')) : item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
