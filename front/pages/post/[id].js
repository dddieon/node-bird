// post/[id].js

import {useRouter} from "next/router";
import wrapper from "../../store/configureStore";
import axios from "axios";
import {LOAD_MY_INFO_REQUEST} from "../../reducers/user";
import {LOAD_POST_REQUEST} from "../../reducers/post";
import {END} from "redux-saga";
import Head from 'next/head';

import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import {useSelector} from "react-redux";


const Post = () => {
  const router = useRouter();
  const {id} = router.query;
  const {singlePost} = useSelector((state) => state.post);

  return (
    <AppLayout>
      <Head>
        <title>
          {singlePost.User.nickname}
          님의 글
        </title>
        <meta name="description" content={singlePost.content} />
        <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singlePost.content} />
        <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://ddieon.com/favicon.ico'} />
        <meta property="og:url" content={`https://ddieon.com/post/${id}`} />
      </Head>
      <PostCard post={singlePost} />
    </AppLayout>
  )
}

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }) => {
  const cookie = req ? req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  console.log(params, "params")
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({
    type: LOAD_POST_REQUEST,
    data: params.id,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise(); // saga 요청이 끝날 때 까지 기다림
});

export default Post;