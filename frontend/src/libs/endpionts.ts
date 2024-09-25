export enum requestType {
  'GET',
  'POST',
  'PUT',
  'DELETE',
}

export const backendBaseUrl = 'http://localhost:5000';
export const loginRoute = '/auth/signIn';
export const registerRoute = '/auth/signUp';
export const banksInfo = '/bank/getBanks';
export const usersTransaction = '/transaction';
