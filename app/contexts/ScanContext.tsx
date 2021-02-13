import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Photo } from '../../types/Schema';
import { Database } from '../utils/Database';
import { AbortError, Scanner } from '../utils/Scanner';

const ScanContext = createContext<{
  isScanning: boolean;
  lastScannedPhoto: Photo | null;
  scanError: Error | null;
  toggleScan: () => void;
}>({
  isScanning: false,
  lastScannedPhoto: null,
  scanError: null,
  toggleScan: () => {},
});

export const ScanContextProvider: FC = ({ children }) => {
  const [scan, setScan] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastScannedPhoto, setLastScannedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (!scan) {
      return;
    }

    const abortController = new AbortController();
    setError(null);

    Database.getConfiguration()
      .then(({ rootDirectoryId }) => {
        return Scanner.scan(
          rootDirectoryId,
          abortController.signal,
          setLastScannedPhoto,
        );
      })
      .then(() => {
        setScan(false);
      })
      .catch((error) => {
        setScan(false);

        if (!(error instanceof AbortError)) {
          setError(error);
        }
      });

    return () => {
      setLastScannedPhoto(null);
      abortController.abort();
    };
  }, [scan]);

  return (
    <ScanContext.Provider
      value={{
        isScanning: scan,
        scanError: error,
        toggleScan: useCallback(() => setScan((prevScan) => !prevScan), []),
        lastScannedPhoto,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useIsScanning = () => {
  return useContext(ScanContext).isScanning;
};

export const useToggleScan = () => {
  return useContext(ScanContext).toggleScan;
};

export const useLastScannedPhoto = () => {
  return useContext(ScanContext).lastScannedPhoto;
};

export const useScanError = () => {
  return useContext(ScanContext).scanError;
};
