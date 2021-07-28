import { all, fork, takeEvery, put, delay, call  } from "redux-saga/effects";
import axios from "axios";
import {
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_REQUEST, CHANGE_NICKNAME_SUCCESS,
  LOAD_MY_INFO_FAILURE, LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
} from "../reducers/user";
import {ADD_COMMENT_REQUEST} from "../reducers/post";

// 1. all은 배열을 받아와 한꺼번에 실행
// 2. fork는 비동기함수호출(요청보내고 바로 다음 실행) | call은 동기함수호출(요청을 끝까지 기다리고 다음 실행)
// 3. take는 액션을 기다림
// 4. put은 dispatch라고 보면 됨

function signUpAPI(data) {
  return axios.post("/user", data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    console.log(result);
    yield put({
      type: SIGN_UP_SUCCESS,
    });
  } catch (e) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: e.response.data, //실패결과
    });
  }
}

function logInAPI(data) {
  return axios.post("/user/login", data);
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data, //성공결과
    });
  } catch (e) {
    yield put({
      type: LOG_IN_FAILURE,
      error: e.response.data, //실패결과
    });
  }
}

function logOutAPI(data) {
  return axios.post("/user/logout", data);
}

function* logOut(action) {
  try {
    const result = yield call(logOutAPI, action.data);
    yield put({
      type: LOG_OUT_SUCCESS,
      data: result.data, //성공결과
    });
  } catch (e) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: e.response.data, //실패결과
    });
  }
}

function loadMyInfoAPI(data) {
  return axios.get("/user"); // 쿠키를 전달
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      data: e.response.data, //실패결과
    });
  }
}

function changeNicknameAPI(data) {
  return axios.patch("/user/nickname", {nickname: data}); // 쿠키를 전달
}

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      data: e.response.data, //실패결과
    });
  }
}

function* watchLogin() {
  //이벤트리스너처럼 동작: 비동기액션생성함수가 "특정이벤트" 감지(두번째 매개변수 logIn을 감지한다)
  yield takeEvery(LOG_IN_REQUEST, logIn);
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function* watchLoadMyInfo() {
  yield takeEvery(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchChangeNickname() {
  yield takeEvery(CHANGE_NICKNAME_REQUEST, changeNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchLoadMyInfo),
    fork(watchChangeNickname),
  ]);
}
