import { DependencyList, useCallback, useEffect, useState } from 'react';

export default function useAsyncMemo<T>(
  factory: () => Promise<T>,
  dependencies: DependencyList,
  initial: T | (() => T),
): T {
  const [value, setValue] = useState<T>(initial);
  const [error, setError] = useState<Error>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const factoryCallback = useCallback(factory, [...dependencies]);

  useEffect(() => {
    let stop = false;

    setError(undefined);

    factoryCallback()
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
  }, [factoryCallback]);

  if (error) {
    throw error;
  }

  return value;
}
