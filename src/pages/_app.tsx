import makeInspectable from 'mobx-devtools-mst';
import { initializeStore, useStore, StoreProvider } from '../stores';
import { onPatch } from 'mobx-state-tree';
import env from '../../env';
import { AppPropsType } from 'next/dist/next-server/lib/utils';

const App = ({ Component, pageProps }: AppPropsType) => {
  const store = initializeStore(pageProps.initialState);

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

export default App;
