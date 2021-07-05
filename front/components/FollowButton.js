import React, { useCallback } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

const FollowButton = ({ post }) => {
  const { me, followLoading, unFollowLoading } = useSelector(
    (state) => state.user
  );
  const isFollwing = me?.Followings?.find((v) => v.id === post.User.id);
  const dispatch = useDispatch();
  const onClickButton = useCallback(() => {
    if (isFollwing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.User.id,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.User.id,
      });
    }
  }, [isFollwing]);
  return (
    <Button loading={followLoading || unFollowLoading} onClick={onClickButton}>
      {isFollwing ? "언팔로우" : "팔로우"}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
};

export default FollowButton;
