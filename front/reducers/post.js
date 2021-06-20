export const initialState = {
  mainPosts: [
    // 소문자: 포스트만 가지는 유니크한 정보. (시퀄라이즈 관련)
    {
      id: 1,
      User: {
        id: 1,
        nickname: "제로초",
      },
      content: "첫번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          src: "https://via.placeholder.com/300.png",
        },
        {
          src: "https://via.placeholder.com/400.png",
        },
        {
          src: "https://via.placeholder.com/600.png",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "hero",
          },
          content: "얼른 사고 싶어요~",
        },
        {
          User: {
            nickname: "mini",
          },
          content: "nice~ 니쎄~",
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false, //게시글 추가 완료
};

const ADD_POST = "ADD_POST";

export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  content: "안녕하시오 두번째게시글",
  User: {
    id: 1,
    nickname: "지원",
  },
  Images: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
