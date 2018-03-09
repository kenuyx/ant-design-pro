import { query, update } from '../services/store';

export default {
  namespace: 'store',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *query({ payload }, { call, put }) {
      const response = yield call(query, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
