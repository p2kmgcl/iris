import { DependencyList, useEffect, useState } from 'react';

export function useAsyncMemo<T>(
  factory: () => Promise<T>,
  dependencies: DependencyList,
  initial: T | (() => T),
): T {
  const [value, setValue] = useState<T>(initial);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let stop = false;

    setError(null);

    factory()
      .then((nextValue) => {
        if (!stop) {
          setValue(nextValue);
        }
      })
      .catch((nextError) => {
        if (!stop) {
          setError(nextError);
        }
      });

    return () => {
      stop = true;
    };
  }, dependencies);

  if (error) {
    throw error;
  }

  return value;
}
