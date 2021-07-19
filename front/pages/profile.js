import React, { useEffect } from "react";

import NicknameEditForm from "../components/NicknameEditForm";
import AppLayout from "../components/AppLayout";
import FollowList from "../components/FollowList";
import { useSelector } from "react-redux";
import {useRouter} from "next/router";

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (!(me && me.id)) {
      router.push("/");
      console.log("no user");
    }
    if (!me) {
      return null;
    }
  }, []);

  return (
    <AppLayout>
      <NicknameEditForm />
      <FollowList header="팔로잉 목록" data={me.Followings} />
      <FollowList header="팔로워 목록" data={me.Followers} />
    </AppLayout>
  );
};

export default Profile;
