import Cookies from 'js-cookie';
import request from '../utils/request';
import { AUTHENTITY_KEY } from '../utils/authentity';

export async function checkAuthority(permittedRoles, userData) {
  if (!permittedRoles) {
    return Promise.resolve();
  }

  let currentRoles = [];
  if (userData && 'roles' in userData) {
    currentRoles = userData.roles || [];
  } else {
    const token = Cookies.get(AUTHENTITY_KEY);
    if (token) {
      currentRoles = (await request(`/api/roles/${token}`)) || [];
    }
  }

  if (currentRoles.length === 0) {
    return Promise.reject();
  }

  const authorized = Array.some(
    currentRoles,
    currentRole => Array.indexOf(permittedRoles, currentRole) >= 0
  );
  if (authorized) {
    return Promise.resolve();
  }
  return Promise.reject();
}
