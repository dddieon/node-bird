import React, {useState, useCallback, useEffect} from "react";
import { Card, Button, Avatar, Popover, List, Comment } from "antd";
import {
  RetweetOutlined,
  HeartTwoTone,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import Link from "next/link";
import moment from "moment";

import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import PostImages from "./PostImages";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import {LIKE_POST_REQUEST, REMOVE_POST_REQUEST, RETWEET_REQUEST, UNLIKE_POST_REQUEST} from "../reducers/post";

moment.locale("ko");

const CardWrapper = styled.div`
  margin-bottom: 20px;
`;

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const { removePostLoading } = useSelector((state) => state.post);

  const id = useSelector((state) => state.user.me?.id);
  const liked = post.Likers?.find(v => v.id === id); //id는 내 아이디

  const onLike = useCallback(() => {
    //setLike 등 필요없이 redux에서 가져옴
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id
    })
  }, []);

  const onUnlike = useCallback(() => {
    //setLike 등 필요없이 redux에서 가져옴
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id
    })
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, []);

  return (
    <CardWrapper key={post.id}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet}/>,
          liked ? (
            <HeartTwoTone
              twoToneColor="#eb2f96"
              key="heart"
              onClick={onUnlike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="message" onClick={onToggleComment} />,
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {id && post.User.id === id ? ( // 추후 로그인 dummy 변경되면 수정
                  <>
                    <Button>수정</Button>
                    <Button
                      loading={removePostLoading}
                      danger
                      onClick={onRemovePost}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null}
        extra={id && <FollowButton post={post} />}
      >
        {
          post.RetweetId && post.Retweet ?
            <Card cover={post.Retweet.Images[0] && <PostImages images={post.Retweet.Images}/>}>
              <div style={{float: "right"}}>{moment(post.createdAt).format("YYYY.MM.DD")}</div>
              <Card.Meta
                avatar={<Link href={`/user/${post.Retweet.User.id}`}><Avatar>{post.Retweet.User.nickname[0]}</Avatar></Link>}
                title={post.Retweet.User.nickname}
                description={<PostCardContent postData={post.Retweet.content} />}
              />
            </Card>
            :
            <>
              <div style={{float: "right"}}>{moment(post.createdAt).format("YYYY.MM.DD")}</div>
              <Card.Meta
              avatar={<Link href={`/user/${post.User.id}`}><Avatar>{post.User.nickname[0]}</Avatar></Link>}
              title={post.User.nickname}
              description={<PostCardContent postData={post.content}/>}
            />
            </>
        }

      </Card>
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <List
            header={`${post.Comments?.length || 0}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={
                    <Link
                      href={{ pathname: "/user", query: { id: item.User.id } }}
                      as={`/user/${item.User.id}`}
                    >
                      <a>
                        <Avatar>{item.User.nickname[0]}</Avatar>
                      </a>
                    </Link>
                  }
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </CardWrapper>
  );
};

export default PostCard;
