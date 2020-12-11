// @flow
import React, { useState, useRef, useCallback } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider } from '@material-ui/core/styles';
// eslint-disable-next-line import/extensions
import 'typeface-roboto';
import { type HashHistory } from 'history';
import { AppLoader } from '../AppLoader';
import { App } from '../App';
import { loadApp } from './appStart.actions';
import { addBeforeUnloadEventListener } from './unload';
import { CacheExpired } from './CacheExpired.component';
import { JSSProviderShell } from './JSSProviderShell.component';
import theme from '../../styles/uiTheme';

export const AppStart = () => {
  const [ready, setReadyStatus] = useState(false);
  const [cacheExpired, setCacheExpired] = useState(false);

  const store: { current: Object } = useRef();
  const history = useRef();

  const handleRunApp = useCallback(
    (storeArg: ReduxStore, historyArg: HashHistory) => {
      store.current = storeArg;
      history.current = historyArg;
      setReadyStatus(true);
      storeArg.dispatch(loadApp());
      addBeforeUnloadEventListener(storeArg);
    },
    [setReadyStatus, store, history],
  );

  const handleCacheExpired = useCallback(() => {
    setCacheExpired(true);
  }, [setCacheExpired]);

  if (cacheExpired) {
    return <CacheExpired />;
  }

  return (
    <>
      <CssBaseline />
      <JSSProviderShell>
        <MuiThemeProvider theme={theme}>
          {ready ? (
            <App store={store.current} history={history.current} />
          ) : (
            <AppLoader onRunApp={handleRunApp} onCacheExpired={handleCacheExpired} />
          )}
        </MuiThemeProvider>
      </JSSProviderShell>
    </>
  );
};
