import { stringify } from 'qs';
import request from '../utils/request';

export async function query(params) {
  return request(`/api/stores?${stringify(params)}`);
}

export async function update(params) {
  const { id, ...restParams } = params;
  return request(`/api/stores/${id}`, {
    method: 'PUT',
    body: restParams,
  });
}
