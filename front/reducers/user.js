import { HYDRATE } from "next-redux-wrapper";

export const initialState = {
  isLoggedIn: false,
  isLoggingIn: false, //로그인시도 - 로딩창용
  isLoggingOut: false, //로그아웃시도 - 로딩창용
  me: null,
  signUpData: {},
  loginData: {},
};

export const loginRequestAction = (data) => {
  return {
    type: "LOG_IN_REQUEST",
    data,
  };
};

export const logoutRequestAction = (data) => {
  return {
    type: "LOG_OUT_REQUEST",
  };
};

export const changeNickname = (data) => {
  return {
    type: "CHANGE_NICKNAME",
    data: data,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOG_IN_REQUEST":
      return {
        ...state,
        isLoggingIn: true,
        me: action.data,
      };
    case "LOG_IN_SUCCESS":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: { ...action.data, nickname: "nick dummy" },
      };
    case "LOG_IN_FAILURE":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
      };
    case "LOG_OUT_REQUEST":
      return {
        ...state,
        isLoggingOut: true,
      };
    case "LOG_OUT_SUCCESS":
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      };
    case "LOG_OUT_FAILURE":
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
      };
    default:
      //no default -> undefined error
      return state;
  }
};

export default reducer;
