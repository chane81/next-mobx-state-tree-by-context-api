import { createContext, useContext } from 'react';
import {
  applySnapshot,
  Instance,
  SnapshotIn,
  SnapshotOut,
  types,
  onSnapshot
} from 'mobx-state-tree';
import { enableStaticRendering } from 'mobx-react';
import fooStore from './foo/fooStore';
import barStore from './bar/barStore';
import cookie from 'react-cookies';

const STORE_PERSIST_KEY = 'STORE';
let initStore: IStore | undefined = null as any;

/** 서버 여부 true/false */
const isServer = typeof window === 'undefined';

/** mobx ssr 사용시 gc 문제 방지설정 (아래 내용 참고)
 * https://mobx.js.org/react-integration.html#tips
 * Server Side Rendering (SSR)
 * If is used in server side rendering context; make sure to call , so that won't subscribe to any observables used, and no GC problems are introduced
 */
enableStaticRendering(isServer);

/** root store */
const store = types.model('store', {
  /** 스토어 아이덴티티 */
  identifier: types.optional(types.identifier, 'store'),
  /** foo model */
  fooModel: types.optional(fooStore.model, () => fooStore.create),
  /** barModel model */
  barModel: types.optional(barStore.model, () => barStore.create)
});

/** default state value */
const defaultValue: IStoreSnapshotIn = {
  fooModel: { ...fooStore.defaultValue },
  barModel: { ...barStore.defaultValue }
};

const expires = new Date();
expires.setDate(Date.now() + 1000 * 60 * 60 * 24);

/** 스토어 initialize */
const initializeStore = (snapshot: null | IStoreSnapshotIn = null): IStore => {
  const isServer = typeof window === 'undefined';
  const _store = initStore ?? store.create(defaultValue);

  if (snapshot) {
    applySnapshot(_store, { ...defaultValue, ...snapshot });
    // applySnapshot(_store, {
    //   ...defaultValue,
    //   ...{
    //     fooModel: {
    //       identifier: 'fooModel',
    //       fooVal: '',
    //       count: 21
    //     }
    //   }
    // });
  }

  onSnapshot(_store, (snapshot) => {
    console.log({ snapshot });

    cookie.save(STORE_PERSIST_KEY, JSON.stringify(snapshot), {
      expires
    });
  });

  if (isServer) return _store;

  if (!initStore) initStore = _store;

  return initStore;
};

/** context api */
const RootStoreContext = createContext<null | IStore>(null);
const StoreProvider = RootStoreContext.Provider;

/** mobx 스토어 hooks */
const useStore = (): IStore => {
  const store = useContext(RootStoreContext);

  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }

  return store;
};

/** store export */
export { initializeStore, useStore, StoreProvider };

/** type export */
export interface IStoreInjectType {
  store: IStore;
}
export type IStore = Instance<typeof store>;
export type IStoreSnapshotIn = SnapshotIn<typeof store>;
export type IStoreSnapshotOut = SnapshotOut<typeof store>;
export type { IFooModelType } from './foo/fooStore';
export type { IBarModelType } from './bar/barStore';
