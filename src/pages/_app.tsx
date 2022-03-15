import makeInspectable from 'mobx-devtools-mst';
import { initializeStore, useStore, StoreProvider } from '../stores';
import { onPatch } from 'mobx-state-tree';
import env from '../../env';
import { AppPropsType } from 'next/dist/next-server/lib/utils';
import cookies from 'next-cookies';

const App = ({ Component, pageProps }: AppPropsType) => {
  console.info('pageProps', pageProps.initialState);

  const store = initializeStore({
    ...pageProps.persistState,
    ...pageProps.initialState
  });

  // mst 디버깅 로그
  if (env.NODE_ENV === 'development') {
    // 크롬 console 에 해당값의 변화가 있을 때 나타나게 함
    onPatch(store, (patch) => {});

    // 크롬 mobx tools 에 MST 로 상태변화를 볼 수 있게 한다.
    makeInspectable(store);
  }

  return (
    <StoreProvider value={store}>
      <Component {...pageProps} />
    </StoreProvider>
  );
};

App.getInitialProps = async (context) => {
  const { ctx } = context;
  const pageProps = {};
  const STORE_PERSIST_KEY = 'STORE';

  const cookie = cookies(ctx);

  const persistState = cookie[STORE_PERSIST_KEY];

  return {
    pageProps: {
      persistState
    }
  };
};

export default App;
