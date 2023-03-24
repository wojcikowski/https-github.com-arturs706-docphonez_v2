import jwt_decode from "jwt-decode";
import { setProfile, setEmailAdd, setUserRole, setTokenExp } from '../reducers/profileSlice';

const refreshTokenMiddleware = ({dispatch}) => (next) => async (action) => {
  if (action.type === 'auth/loginSuccess') {
    const result = await (await fetch('http://localhost:10000/api/v1/refresh_token', {
      method: 'POST',
      credentials: 'include', // Needed to include the cookie
      headers: {
        'Content-Type': 'application/json',
      }
    })).json();
    const { email, exp, role } = jwt_decode(result.accessToken)
    dispatch(setProfile(result.accessToken))
    dispatch(setEmailAdd(email))
    dispatch(setUserRole(role))
    const isExpired = (exp * 1000) < new Date().getTime()
    dispatch(setTokenExp(isExpired))
  }
  return next(action);
};

export default refreshTokenMiddleware;