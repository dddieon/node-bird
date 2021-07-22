import {delay, put, takeEvery, all, fork, call} from "redux-saga/effects";
import shortId from "shortid";
import axios from "axios";
import {
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  UNLIKE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
} from "../reducers/post";
import {
  ADD_POST_TO_ME,
  FOLLOW_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  REMOVE_POST_OF_ME,
  UNFOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
} from "../reducers/user";


function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e, "error");
    yield put({
      type: LIKE_POST_FAILURE,
      data: e.response.data,
    });
  }
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/unlike`);
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      data: e.response.data,
    });
  }
}


function unFollowAPI(data) {
  return axios.post("/api/unfollow", data);
}

function* unFollow(action) {
  try {
    yield delay(1000);
    //const result = yield call(unFollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (e) {
    yield put({
      type: UNFOLLOW_FAILURE,
      data: e.response.data, //실패결과
    });
  }
}

function followAPI(data) {
  return axios.post("/api/follow", data);
}

function* follow(action) {
  try {
    yield delay(1000);
    //const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: action.data,
    });
  } catch (e) {
    yield put({
      type: FOLLOW_FAILURE,
      data: e.response.data, //실패결과
    });
  }
}

function loadPostAPI(data) {
  return axios.get("/posts", data);
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: LOAD_POST_FAILURE,
      data: e.response.data, //실패결과
    });
  }
}

function addPostAPI(data) {
  return axios.post("/post", {content: data});
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (e) {
    yield put({
      type: ADD_POST_FAILURE,
      data: e.response.data, //실패결과
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data); // POST /post/1/comment
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    console.log(result.data, "success")
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: ADD_COMMENT_FAILURE,
      data: e.response.data, //실패결과
    });
  }
}

function removePostAPI(data) {
  return axios.delete(`/api/post`, data);
}

function* removePost(action) {
  try {
    yield delay(1000);
    //const result = yield call(removePostAPI, action.data);
    yield put({
      type: REMOVE_POST_SUCCESS,
      data: action.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: action.data,
    });
  } catch (e) {
    yield put({
      type: REMOVE_POST_FAILURE,
      data: e.response.data, //실패결과
    });
  }
}

function* watchLikePost() {
  yield takeEvery(LIKE_POST_REQUEST, likePost);
}

function* watchUnlikePost() {
  yield takeEvery(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchUnFollow() {
  yield takeEvery(UNFOLLOW_REQUEST, unFollow);
}

function* watchFollow() {
  yield takeEvery(FOLLOW_REQUEST, follow);
}

function* watchLoadPost() {
  yield takeEvery(LOAD_POST_REQUEST, loadPost);
}

function* watchAddPost() {
  yield takeEvery(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeEvery(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeEvery(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
  yield all([
    fork(watchLikePost),
    fork(watchUnlikePost),
    fork(watchUnFollow),
    fork(watchFollow),
    fork(watchAddPost),
    fork(watchAddComment),
    fork(watchRemovePost),
    fork(watchLoadPost),
  ]);
}
