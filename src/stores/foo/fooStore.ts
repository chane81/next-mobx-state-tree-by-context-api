import { Instance, types } from 'mobx-state-tree';

/** model id */
const IDENTIFIER = 'fooModel';

/** model */
const model = types
  .model(IDENTIFIER, {
    /** 스토어 아이덴티티 */
    identifier: types.optional(types.identifier, IDENTIFIER),
    fooVal: types.optional(types.string, ''),
    count: types.optional(types.number, 0)
  })
  .actions((self) => {
    const setFooVal = (val: string) => {
      self.fooVal = val;
    };

    const addCount = () => {
      self.count += 1;
    };

    const setCount = (val: number) => {
      self.count = val;
    };

    return { setFooVal, addCount, setCount };
  });

/** 초기화 값 */
const defaultValue = {
  identifier: IDENTIFIER,
  fooVal: '',
  count: 0
};

/** create or initialize */
const create = model.create(defaultValue);

const store = {
  create,
  defaultValue,
  model
};

/** 모델 타입 */
export type IFooModelType = Instance<typeof model>;

export default store;
