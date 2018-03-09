import { fakeRegister } from '../services/api';
import { setAuthentity } from '../utils/authentity';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: false,
  },

  effects: {
    *submit(_, { call, put }) {
      const response = yield call(fakeRegister);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthentity(payload.token);
      reloadAuthorized(payload.roles);
      return {
        ...state,
        status: payload.state,
      };
    },
  },
};
