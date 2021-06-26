import { all, fork, take, call, put } from "redux-saga/effects";
import axios from "axios";

// 1. all은 배열을 받아와 한꺼번에 실행
// 2. fork는 비동기함수호출(요청보내고 바로 다음 실행) | call은 동기함수호출(요청을 끝까지 기다리고 다음 실행)
// 3. take는 액션을 기다림
// 4. put은 dispatch라고 보면 됨

function logInAPI(data) {
  return axios.post("/api/login", data);
}

function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      type: "LOGIN_SUCCESS",
      data: result.data, //성공결과
    });
  } catch (e) {
    yield put({
      type: "LOG_IN_FAILURE",
      data: e.response.data, //실패결과
    });
  }
}

function addPostAPI(data) {
  return axios.post("/api/post", data);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: "ADD_POST_SUCCESS",
      data: result.data, //성공결과
    });
  } catch (e) {
    yield put({
      type: "ADD_POST_FAILURE",
      data: e.response.data, //실패결과
    });
  }
}

function* watchLogin() {
  //이벤트리스너처럼 동작: 비동기액션생성함수가 "특정이벤트" 감지(두번째 매개변수 logIn을 감지한다)
  yield take("LOG_IN_REQUEST", logIn);
}

function* watchLogOut() {
  yield take("LOG_OUT_REQUEST");
}

function* watchAddPost() {
  yield take("ADD_POST_REQUEST");
}

export default function* rootSaga() {
  yield all([fork(watchLogin), fork(watchLogOut), fork(watchAddPost)]);
}
