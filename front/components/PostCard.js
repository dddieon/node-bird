import React, { useState, useCallback } from "react";
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

import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import PostImages from "./PostImages";
import FollowButton from "./FollowButton";
import { useDispatch, useSelector } from "react-redux";
import {LIKE_POST_REQUEST, UNLIKE_POST_REQUEST} from "../reducers/post";

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
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id
    })
  }, []);

  const onUnlike = useCallback(() => {
    //setLike 등 필요없이 redux에서 가져옴
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id
    })
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch({
      type: "REMOVE_POST_REQUEST",
      data: post.id,
    });
  });

  return (
    <CardWrapper key={post.id}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
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
        extra={id && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
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
