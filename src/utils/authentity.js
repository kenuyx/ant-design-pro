import Cookies from 'js-cookie';

const AUTHENTITY_KEY = 'fadaojia-token';
export { AUTHENTITY_KEY };

export function getAuthentity() {
  return Cookies.get(AUTHENTITY_KEY) || '';
}

export function setAuthentity(token) {
  if (!token) {
    Cookies.remove(AUTHENTITY_KEY, { path: '/' });
  } else {
    Cookies.set(AUTHENTITY_KEY, token, { expires: 1, path: '/' });
  }
  return token || '';
}

export function checkAuthentity() {
  return !!Cookies.get(AUTHENTITY_KEY);
}
