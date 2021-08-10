import React, { useEffect } from "react";
import useSWR from "swr";

import NicknameEditForm from "../components/NicknameEditForm";
import AppLayout from "../components/AppLayout";
import FollowList from "../components/FollowList";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import {LOAD_FOLLOWERS_REQUEST, LOAD_FOLLOWINGS_REQUEST, LOAD_MY_INFO_REQUEST} from "../reducers/user";
import wrapper from "../store/configureStore";
import axios from "axios";
import {LOAD_POSTS_REQUEST} from "../reducers/post";
import {END} from "redux-saga";

const fetcher = (url) => axios.get(url, {withCredentials: true}).then(result => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const {data: followersData, error: followerError} = useSWR("http://localhost:3065/user/followers", fetcher);
  const {data: followingsData, error: followingsError} = useSWR("http://localhost:3065/user/followings", fetcher);

  useEffect(() => {
    dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    })
  }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  if (!me) {
    return '내 정보 로딩중...';
  }

  if (followerError || followingsError) {
    console.error(followerError || followingsError);
    return <div>팔로잉/팔로워 로딩중 에러가 발생합니다.</div>;
  }

  return (
    <AppLayout>
      <NicknameEditForm />
      <FollowList header="팔로잉 목록" data={followingsData} />
      <FollowList header="팔로워 목록" data={followersData} />
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise(); // saga 요청이 끝날 때 까지 기다림
});

export default Profile;
