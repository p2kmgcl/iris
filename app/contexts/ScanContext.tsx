import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { Photo } from '../../types/Schema';
import { Database } from '../utils/Database';
import { Scanner } from '../utils/Scanner';
import {
  Channel,
  NoopChannel,
  useChannel,
  useChannelData,
} from '../hooks/useChannel';

const ScanContext = createContext<{
  isScanningChannel: Channel<boolean>;
  scanErrorChannel: Channel<Error | null>;
  scanStatusChannel: Channel<{
    description: string;
    relatedPhoto: Photo | null;
  }>;
  toggleScan: () => void;
}>({
  isScanningChannel: NoopChannel,
  scanErrorChannel: NoopChannel,
  scanStatusChannel: NoopChannel,
  toggleScan: () => {},
});

export const ScanContextProvider: FC = ({ children }) => {
  const isScanningChannel = useChannel<boolean>(false);
  const scanErrorChannel = useChannel<Error | null>(null);
  const scanStatusChannel = useChannel<{
    description: string;
    relatedPhoto: Photo | null;
  }>({ description: 'Not scanning', relatedPhoto: null });
  const abortControllerRef = useRef<AbortController | null>(null);

  const toggleScan = useCallback(() => {
    if (abortControllerRef.current) {
      scanStatusChannel.emit({
        description: 'Scanning stopped',
        relatedPhoto: null,
      });
      isScanningChannel.emit(false);
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      return;
    }

    const abortController = new AbortController();

    abortControllerRef.current = abortController;
    scanErrorChannel.emit(null);
    isScanningChannel.emit(true);
    scanStatusChannel.emit({
      description: 'Initializing...',
      relatedPhoto: null,
    });

    Database.getConfiguration().then(({ rootDirectoryId }) => {
      if (!abortControllerRef.current) {
        return;
      }

      return Scanner.scan(
        rootDirectoryId,
        abortControllerRef.current.signal,
        (photo) => {
          if (abortControllerRef.current === abortController) {
            scanStatusChannel.emit(
              photo
                ? {
                    description: `Added ${new Date(
                      photo.dateTime,
                    ).toLocaleString()}`,
                    relatedPhoto: photo,
                  }
                : { description: 'Scan in progress...', relatedPhoto: null },
            );
          }
        },
      )
        .then(() => {
          if (abortControllerRef.current === abortController) {
            isScanningChannel.emit(false);
            scanStatusChannel.emit({
              description: 'Scanning completed',
              relatedPhoto: null,
            });
          }
        })
        .catch((error) => {
          if (abortControllerRef.current === abortController) {
            isScanningChannel.emit(false);
            scanStatusChannel.emit({
              description: error.toString(),
              relatedPhoto: null,
            });
          }
        });
    });

    return () => {
      abortController.abort();

      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
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

export const useIsScanning = () =>
  useChannelData(useContext(ScanContext).isScanningChannel);

export const useScanStatus = () =>
  useChannelData(useContext(ScanContext).scanStatusChannel);

export const useToggleScan = () => {
  return useContext(ScanContext).toggleScan;
};
