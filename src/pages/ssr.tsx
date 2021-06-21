import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage
} from 'next';
import { getSnapshot } from 'mobx-state-tree';
import { initializeStore, useStore, IStore } from '../stores';

interface IPropsSsr {
  initialState: IStore;
}

interface IProps extends IPropsSsr {}

const Ssr: NextPage<IProps> = ({ initialState }) => {
  // props 를 통해 전달받은 store 값
  console.log('ssr props initialState', initialState);

  /**
   * 아래와 같이 did not match 서버 <-> 클라이언트 warning 메시지가 나올 수 있는데
   * useStore 사용시 서버에서 전달한 initialState 를 인자값으로 전달하여 warning 를 지울 수 있다.
   * Warning 메시지: Text content did not match. Server: "0" Client: "3"
   */

  // mst 의 useStore 를 통한 store 값
  const store = useStore(initialState);

  console.log('useStore state', store.barModel.barVal);

  return <div>ssr page: {store.barModel.barVal}</div>;
};

export default Ssr;

// _app.tsx에서 pageProps.initialState 로 받고 있으므로 props 로 initialState에
// state 를 담아 전달하면 클라이언트에서 쓸 수 있다.
export const getServerSideProps: GetServerSideProps<IPropsSsr> = async (
  context
) => {
  const store = initializeStore();

  store.barModel.setBarVal('ssr set');

  const initialState = getSnapshot<IStore>(store);

  return {
    props: { initialState }
  };
};
