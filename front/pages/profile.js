import React from "react";

import NicknameEditForm from "../components/NicknameEditForm";
import AppLayout from "../components/AppLayout";
import FollowList from "../components/FollowList";
import { useSelector } from "react-redux";

const Profile = () => {
  const me = useSelector((state) => state.user);

  return (
    <AppLayout>
      <NicknameEditForm />
      <FollowList header="팔로잉 목록" data={me.Followings} />
      <FollowList header="팔로워 목록" data={me.Followers} />
    </AppLayout>
  );
};

export default Profile;
