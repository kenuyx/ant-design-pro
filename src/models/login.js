import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';
import { setAuthentity } from '../utils/authentity';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.state) {
        reloadAuthorized(response.roles);
        yield put(routerRedux.push('/'));
      }
    },
    *logout(_, { put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            state: false,
          },
        });
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthentity(payload.token);
      return {
        ...state,
        status: payload.state,
      };
    },
  },
};
