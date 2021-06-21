import { observer } from 'mobx-react-lite';
import { initializeStore, IStore, useStore } from '../stores';
import { GetServerSideProps } from 'next';
import { getSnapshot } from 'mobx-state-tree';
import env from '../../env';

const Home = () => {
  const store = useStore();
  const { fooModel, barModel } = store;

  const handleFooClick = () => {
    fooModel.addCount();
  };

  const handleBarClick = () => {
    barModel.addCount();
  };

  console.log('rendering');

  return (
    <div>
      <div>
        <button onClick={handleFooClick}>fooSet</button>
      </div>
      <div>
        <button onClick={handleBarClick}>barSet</button>
      </div>
      <div>foo fooVal: {fooModel.fooVal}</div>
      <div>foo count: {fooModel.count}</div>
      <div>bar count: {barModel.count}</div>
    </div>
  );
};

export default observer(Home);

export const getServerSideProps: GetServerSideProps = async () => {
  console.log('server side: ', env.MY_VAL);

  const store = initializeStore({
    fooModel: {
      fooVal: 'test11'
    }
  });
  store.fooModel.setCount(3);

  const initialState = getSnapshot<IStore>(store);

  console.log('initialState', initialState);

  return {
    props: {
      initialState
    }
  };
};
