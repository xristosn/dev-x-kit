import { USER_STORAGE_PREFS_KEY } from '@/lib/constants';
import { isEqual } from 'lodash-es';
import { useEffect, useState } from 'react';

type StorageType = 'local' | 'session' | 'infer' | 'memory';

const CUSTOM_EVENT_NAME = 'web-storage-update' as const;

declare global {
  interface WindowEventMap {
    [CUSTOM_EVENT_NAME]: CustomEvent;
  }
}

function getStorageValue<ValueType>(
  key: string,
  storageType?: StorageType,
  defaultValue?: ValueType
) {
  if (storageType === 'memory') return defaultValue;

  if (typeof window === 'undefined') return defaultValue;

  const storage = storageType === 'session' ? window.sessionStorage : window.localStorage;

  try {
    const value = storage.getItem(key);

    if (value) {
      return JSON.parse(value);
    } else {
      return defaultValue;
    }
  } catch {
    return defaultValue;
  }
}

function getUserPreferredStorageType() {
  return getStorageValue(USER_STORAGE_PREFS_KEY, 'local', 'local') as StorageType;
}

export function useWebStorage<ValueType>(
  key: string,
  inputStorageType: StorageType = 'infer',
  defaultValue?: ValueType,
  retainValueIfDefault: boolean = false
) {
  const [storageType, setStorageType] = useState(
    inputStorageType === 'infer' ? getUserPreferredStorageType() : 'local'
  );
  const [storeValue, setStoreValue] = useState<ValueType>(
    storageType === 'memory' ? defaultValue : getStorageValue(key, storageType, defaultValue)
  );

  const setValue = (valueOrFn: ValueType | ((previousValue: ValueType) => ValueType)) => {
    setStoreValue((previousValue) => {
      let newValue: ValueType;

      if (typeof valueOrFn === 'function') {
        newValue = (valueOrFn as (previousValue: ValueType) => ValueType)(previousValue);
      } else {
        newValue = valueOrFn;
      }

      if (storageType !== 'session') window.sessionStorage.removeItem(key);

      if (storageType !== 'local') window.localStorage.removeItem(key);

      if (storageType !== 'memory') {
        const store = storageType === 'session' ? window.sessionStorage : window.localStorage;

        if (!retainValueIfDefault && isEqual(newValue, defaultValue)) {
          store.removeItem(key);
        } else {
          store.setItem(key, JSON.stringify(newValue));
        }
      }

      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent<{ key: string }>(CUSTOM_EVENT_NAME, {
            detail: { key },
          })
        );
      }, 0);

      return newValue;
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onStorageChange = (e: StorageEvent | CustomEvent) => {
    const eventKey = (e as StorageEvent).key || (e as CustomEvent<{ key: string }>)?.detail?.key;

    if (!eventKey) {
      return;
    }

    if (eventKey === USER_STORAGE_PREFS_KEY && key !== USER_STORAGE_PREFS_KEY) {
      setStorageType(inputStorageType === 'infer' ? getUserPreferredStorageType() : 'local');
      return;
    }

    if (eventKey !== key || storageType === 'memory') return;

    setStoreValue(getStorageValue(key, storageType, defaultValue));
  };

  const resetValue = () => {
    if (!retainValueIfDefault) {
      const store = storageType === 'session' ? window.sessionStorage : window.localStorage;

      store.removeItem(key);
    }

    setStoreValue(defaultValue as ValueType);
  };

  const valueExists = () => {
    if (storageType === 'memory') return false;

    const store = storageType === 'session' ? window.sessionStorage : window.localStorage;

    return store.getItem(key) !== null;
  };

  useEffect(() => {
    if (storageType !== 'memory') window.addEventListener('storage', onStorageChange);
    window.addEventListener(CUSTOM_EVENT_NAME, onStorageChange);

    return () => {
      window.removeEventListener('storage', onStorageChange);
      window.removeEventListener(CUSTOM_EVENT_NAME, onStorageChange);
    };
  }, [key, onStorageChange, storageType]);

  useEffect(() => {
    if (key !== USER_STORAGE_PREFS_KEY) setValue((v) => v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, storageType]);

  return [storeValue, setValue, resetValue, valueExists] as const;
}
