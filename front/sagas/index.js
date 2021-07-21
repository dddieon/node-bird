import { all, fork } from "redux-saga/effects";

import axios from "axios";

import postSaga from "./post";
import userSaga from "./user";

axios.defaults.baseURL = "http://localhost:3065"; // ==> 프론트와 통신할 백엔드 서버
axios.defaults.withCredentials = true;

// 1. all은 배열을 받아와 한꺼번에 실행
// 2. fork는 비동기함수호출(요청보내고 바로 다음 실행) | call은 동기함수호출(요청을 끝까지 기다리고 다음 실행)
// 3. take는 액션을 기다림
// 4. put은 dispatch라고 보면 됨

export default function* rootSaga() {
  yield all([fork(postSaga), fork(userSaga)]);
}
