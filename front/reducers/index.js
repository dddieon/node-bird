const initialState = {
  name: "zerocho",
  age: 27,
  password: "babo",
};

const changeNickname = {
  type: "CHANGE_NICKNAME",
  data: "boogiecho",
};

// (이전 상태, 액션) => 다음상태
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHANGE_NICKNAME":
      return {
        ...state,
        name: action.data,
      };
  }
};

export default rootReducer;
