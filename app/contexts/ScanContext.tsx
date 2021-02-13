import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { Photo } from '../../types/Schema';
import { Database } from '../utils/Database';
import { AbortError, Scanner } from '../utils/Scanner';
import {
  Channel,
  NoopChannel,
  useChannel,
  useChannelData,
} from '../hooks/useChannel';

const ScanContext = createContext<{
  isScanningChannel: Channel<boolean>;
  scanErrorChannel: Channel<Error | null>;
  scanStatusChannel: Channel<Photo | null>;
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
  const scanStatusChannel = useChannel<Photo | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const toggleScan = useCallback(() => {
    if (abortControllerRef.current) {
      isScanningChannel.emit(false);
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      return;
    }

    const abortController = new AbortController();

    abortControllerRef.current = abortController;
    scanErrorChannel.emit(null);
    isScanningChannel.emit(true);

    Database.getConfiguration().then(({ rootDirectoryId }) => {
      if (!abortControllerRef.current) {
        return;
      }

      return Scanner.scan(
        rootDirectoryId,
        abortControllerRef.current.signal,
        scanStatusChannel.emit,
      )
        .then(() => {
          if (abortControllerRef.current === abortController) {
            isScanningChannel.emit(false);
          }
        })
        .catch((error) => {
          if (abortControllerRef.current === abortController) {
            isScanningChannel.emit(false);
            if (!(error instanceof AbortError)) scanErrorChannel.emit(error);
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

export const useLastScannedPhoto = () =>
  useChannelData(useContext(ScanContext).scanStatusChannel);

export const useScanError = () =>
  useChannelData(useContext(ScanContext).scanErrorChannel);

export const useToggleScan = () => {
  return useContext(ScanContext).toggleScan;
};
