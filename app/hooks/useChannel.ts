import { useCallback, useEffect, useRef, useState } from 'react';

export interface Channel<T> {
  addListener: (listener: (data: T) => void) => void;
  removeListener: (listener: (data: T) => void) => void;
  emit: (data: T) => void;
  getLastData: () => T;
}

export const NoopChannel: Channel<any> = {
  addListener: () => {},
  removeListener: () => {},
  emit: () => {},
  getLastData: () => null,
};

export function useChannel<T>(initialData: T): Channel<T> {
  type Listener = (data: T) => void;

  const listenersRef = useRef<Set<Listener>>(new Set());
  const lastDataRef = useRef<T>(initialData);

  const addListener = useCallback((listener: Listener) => {
    listenersRef.current.add(listener);
  }, []);

  const removeListener = useCallback((listener: Listener) => {
    listenersRef.current.delete(listener);
  }, []);

  const emit = useCallback((data: T) => {
    lastDataRef.current = data;

    listenersRef.current.forEach((listener) => {
      listener(data);
    });
  }, []);

  const getLastData = useCallback(() => {
    return lastDataRef.current;
  }, []);

  return useRef({
    addListener,
    removeListener,
    emit,
    getLastData,
  }).current;
}

export function useChannelData<T>(channel: Channel<T>): T {
  const [data, setData] = useState<T>(() => channel.getLastData());

  useEffect(() => {
    const listener = (data: T) => {
      setData(data);
    };

    channel.addListener(listener);
    return () => channel.removeListener(listener);
  }, [channel]);

  return data;
}
