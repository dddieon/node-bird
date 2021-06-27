import { delay, put, takeEvery, all, fork } from "redux-saga/effects";
import axios from "axios";

function addPostAPI(data) {
  return axios.post("/api/post", data);
}

function* addPost(action) {
  try {
    yield delay(1000);
    //const result = yield call(addPostAPI, action.data);
    yield put({
      type: "ADD_POST_SUCCESS",
      //data: result.data, //성공결과
    });
  } catch (e) {
    yield put({
      type: "ADD_POST_FAILURE",
      data: e.response.data, //실패결과
    });
  }
}

function* watchAddPost() {
  yield takeEvery("ADD_POST_REQUEST", addPost);
}

export default function* postSaga() {
  yield all([fork(watchAddPost)]);
}
