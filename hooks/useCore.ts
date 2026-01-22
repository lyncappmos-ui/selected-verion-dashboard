
import { useState, useEffect, useCallback, useRef } from 'react';
import { CoreSyncState } from '../types';
import { CoreFetchResult } from '../services/coreClient';

const FAILURE_THRESHOLD = 5;

export function useCore<T>(
  fetcher: () => Promise<CoreFetchResult<T>>,
  pollInterval = 0
) {
  const [data, setData] = useState<T | null>(null);
  const [syncState, setSyncState] = useState<CoreSyncState>('SYNCING');
  const [lastSync, setLastSync] = useState<string>('');
  const [isBroken, setIsBroken] = useState(false);
  const failureCount = useRef(0);

  const execute = useCallback(async () => {
    if (isBroken) return;

    const result = await fetcher();
    setData(result.data);
    setSyncState(result.syncState);
    setLastSync(result.timestamp);

    if (result.syncState === 'OFFLINE') {
      failureCount.current += 1;
      if (failureCount.current >= FAILURE_THRESHOLD) {
        setIsBroken(true);
      }
    } else {
      failureCount.current = 0;
    }
  }, [fetcher, isBroken]);

  useEffect(() => {
    execute();
    if (pollInterval > 0) {
      const timer = setInterval(execute, pollInterval);
      return () => clearInterval(timer);
    }
  }, [execute, pollInterval]);

  const reset = () => {
    failureCount.current = 0;
    setIsBroken(false);
  };

  return { data, syncState, lastSync, isBroken, reset, retry: execute };
}
