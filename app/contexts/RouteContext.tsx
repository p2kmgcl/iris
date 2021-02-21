import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import useChannel, {
  Channel,
  NoopChannel,
  useChannelData,
} from '../hooks/useChannel';

const RouteContext = createContext<Channel<Record<string, string>>>(
  NoopChannel,
);

const RouteContextProvider: FC = ({ children }) => {
  const [initialRoute] = useState(() => {
    const initialRoute: Record<string, string> = {};
    const url = new URL(window.location.href);

    url.searchParams.forEach((value, key) => {
      initialRoute[key] = value;
    });

    return initialRoute;
  });

  const routeChannel = useChannel(initialRoute);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute: Record<string, string> = {};
      const url = new URL(window.location.href);

      url.searchParams.forEach((value, key) => {
        nextRoute[key] = value;
      });

      routeChannel.emit(nextRoute);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [routeChannel]);

  return (
    <RouteContext.Provider value={routeChannel}>
      {children}
    </RouteContext.Provider>
  );
};

export function useRouteKey(key: string) {
  const routeChannel = useContext(RouteContext);
  const [value, setValue] = useState(() => routeChannel.getLastData()[key]);

  useEffect(() => {
    const handleChange = (nextRoute: Record<string, string>) => {
      setValue(nextRoute[key]);
    };

    routeChannel.addListener(handleChange);
    return () => routeChannel.removeListener(handleChange);
  }, [routeChannel, key]);

  return value;
}

export function useSetRouteKey(key: string) {
  const routeChannel = useContext(RouteContext);

  return useCallback(
    (value: string) => {
      const nextRoute = { ...routeChannel.getLastData(), [key]: value };
      const url = new URL(window.location.href);

      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }

      window.history.pushState(null, document.title, url.toString());
      routeChannel.emit(nextRoute);
    },
    [key, routeChannel],
  );
}

export default RouteContextProvider;
