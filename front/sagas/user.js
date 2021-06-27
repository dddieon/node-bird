import { all, fork, takeEvery, put, delay } from "redux-saga/effects";
import axios from "axios";
import {
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
} from "../reducers/user";

// 1. all은 배열을 받아와 한꺼번에 실행
// 2. fork는 비동기함수호출(요청보내고 바로 다음 실행) | call은 동기함수호출(요청을 끝까지 기다리고 다음 실행)
// 3. take는 액션을 기다림
// 4. put은 dispatch라고 보면 됨

function logInAPI(data) {
  return axios.post("/api/login", data);
}

function* logIn(action) {
  try {
    yield delay(1000);
    //const result = yield call(logInAPI, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: action.data, //성공결과
    });
  } catch (e) {
    yield put({
      type: LOG_IN_FAILURE,
      error: e.response.data, //실패결과
    });
  }
}

function logOutAPI(data) {
  return axios.post("/api/logout", data);
}

function* logOut(action) {
  try {
    yield delay(1000);
    //const result = yield call(logOutAPI, action.data);
    yield put({
      type: LOG_OUT_SUCCESS,
      //data: result.data, //성공결과
    });
  } catch (e) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: e.response.data, //실패결과
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

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogOut)]);
}
