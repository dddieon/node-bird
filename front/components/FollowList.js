import { Button, Card, List } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import React from 'react';
import PropTypes from 'prop-types';
import {useDispatch} from "react-redux";
import {REMOVE_FOLLOWER_REQUEST, UNFOLLOW_REQUEST} from "../reducers/user";

const FollowList = ({ header, data, onClickMore, loading }) => {
  const dispatch = useDispatch();
  const onClick = (id) => () => {
    if (header === '팔로잉') { // 팔로잉 취소
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: id
      })
    }
    dispatch({
      type: REMOVE_FOLLOWER_REQUEST, // 내 팔로워 차단
      data: id
    })
  }
  return (
    <List
      style={{marginBottom: '20px'}}
      grid={{gutter: 4, xs: 2, md: 3}}
      size="small"
      header={<div>{header}</div>}
      loadMore={
        <div style={{textAlign: 'center', margin: '10px 0'}}>
          <Button loading={loading} onClick={onClickMore}>더 보기</Button>
        </div>
      }
      bordered
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{marginTop: '20px'}}>
          <Card actions={[<StopOutlined key="stop"/>]} onClick={onClick(item.id)}>
            <Card.Meta description={item.nickname}/>
          </Card>
        </List.Item>
      )}
    />
  )
};

FollowList.propTypes = {
  header: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  onClickMore: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default FollowList;
