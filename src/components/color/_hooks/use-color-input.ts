import { useEffect, useState } from 'react';

export function useColorInput<T>(initialValue: T, syncValue: T, isValid: (value: T) => boolean) {
  const [color, setColor] = useState<T>(initialValue);
  const [error, setError] = useState(false);

  const syncKey = JSON.stringify(syncValue);

  useEffect(() => {
    if (JSON.stringify(color) === syncKey) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColor(syncValue);
    setError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncKey]);

  const applyChange = (newValue: T) => {
    const hasError = !isValid(newValue);

    if (hasError) {
      setColor(newValue);
      setError(true);
    } else {
      setColor(newValue);
      setError(false);
    }

    return hasError;
  };

  return { color, setColor, error, setError, applyChange };
}
