import { createContext, FC, useCallback, useContext, useRef } from 'react';
import Database from '../utils/Database';
import Scanner from '../utils/Scanner';
import useChannel, {
  Channel,
  NoopChannel,
  useChannelData,
} from '../hooks/useChannel';

const ScanContext = createContext<{
  isScanningChannel: Channel<boolean>;
  scanErrorChannel: Channel<Error | undefined>;
  scanStatusChannel: Channel<{
    description: string;
  }>;
  toggleScan: () => void;
}>({
  isScanningChannel: NoopChannel,
  scanErrorChannel: NoopChannel,
  scanStatusChannel: NoopChannel,
  toggleScan: () => {},
});

const ScanContextProvider: FC = ({ children }) => {
  const isScanningChannel = useChannel<boolean>(false);
  const scanErrorChannel = useChannel<Error | undefined>(undefined);
  const scanStatusChannel = useChannel<{ description: string }>({
    description: 'Not scanning',
  });
  const abortControllerRef = useRef<AbortController>();

  const toggleScan = useCallback(() => {
    if (abortControllerRef.current) {
      scanStatusChannel.emit({ description: 'Scanning stopped' });
      isScanningChannel.emit(false);
      abortControllerRef.current.abort();
      abortControllerRef.current = undefined;
      return;
    }

    const abortController = new AbortController();

    abortControllerRef.current = abortController;
    scanErrorChannel.emit(undefined);
    isScanningChannel.emit(true);
    scanStatusChannel.emit({ description: 'Initializing...' });

    Database.getConfiguration().then(({ rootDirectoryId }) => {
      if (!abortControllerRef.current) {
        return;
      }

      return Scanner.scan(
        rootDirectoryId,
        abortControllerRef.current.signal,
        (item) => {
          if (abortControllerRef.current === abortController) {
            scanStatusChannel.emit(
              item
                ? { description: `Added ${item.fileName}` }
                : { description: 'Scan in progress...' },
            );
          }
        },
      )
        .then(() => {
          if (abortControllerRef.current === abortController) {
            abortControllerRef.current = undefined;
            isScanningChannel.emit(false);
            scanStatusChannel.emit({
              description: `Completed at ${new Date().toLocaleString()}`,
            });
          }
        })
        .catch((error) => {
          if (abortControllerRef.current === abortController) {
            abortControllerRef.current = undefined;
            isScanningChannel.emit(false);
            scanStatusChannel.emit({ description: error.toString() });
          }
        });
    });

    return () => {
      abortController.abort();

      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = undefined;
      }
    };
  }, [isScanningChannel, scanErrorChannel, scanStatusChannel]);

  return (
    <ScanContext.Provider
      value={{
        isScanningChannel,
        scanErrorChannel,
        scanStatusChannel,
        toggleScan,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export default ScanContextProvider;

export const useIsScanning = () =>
  useChannelData(useContext(ScanContext).isScanningChannel);

export const useScanStatus = () =>
  useChannelData(useContext(ScanContext).scanStatusChannel);

export const useToggleScan = () => {
  return useContext(ScanContext).toggleScan;
};
