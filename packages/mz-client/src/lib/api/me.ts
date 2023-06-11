import axios from 'axios';
import { User } from './types';

export async function getMyAccount() {
  // const response = await fetch('http://localhost:4000/api/me', {
  //   method: 'GET',
  //   credentials: 'include',
  // });
  // const data = await response.json();
  // return data;
  try {
    const response = await axios.get<User>('/base/api/me', {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    });
    return response.data;
  } catch (e) {
    // 로그인되어 있지 않은 상태에서 인가를 요구하는 페이지로 이동할 경우 여기를 거침. 문제는 login 후 navigate가 정상적으로 작동을 안함.. 왜? 아니었음..
    // console.error(e);
    return null;
  }
}

export async function changePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  await axios.post('/base/api/me/change-password', { oldPassword, newPassword });
}

export async function unregister() {
  await axios.delete('/base/api/me');
}
