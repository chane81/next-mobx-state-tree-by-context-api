import { Instance, types } from 'mobx-state-tree';

/** model id */
const IDENTIFIER = 'barModel';

/** model */
const model = types
  .model(IDENTIFIER, {
    /** 스토어 아이덴티티 */
    identifier: types.optional(types.identifier, IDENTIFIER),
    barVal: types.optional(types.string, ''),
    count: types.optional(types.number, 0)
  })
  .actions((self) => {
    const setBarVal = (val: string) => {
      self.barVal = val;
    };

    const addCount = () => {
      self.count += 1;
    };

    const setCount = (val: number) => {
      self.count = val;
    };

    return { setBarVal, addCount, setCount };
  });

/** 초기화 값 */
const defaultValue = {
  identifier: IDENTIFIER,
  barVal: '',
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
export type IBarModelType = Instance<typeof model>;

export default store;
