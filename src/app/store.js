import { configureStore } from "@reduxjs/toolkit";

//import reducer I created
import postsReducer from '../features/posts/postsSlice';
import usersReducer from '../features/users/usersSlice'

export const store = configureStore({
    reducer : {
        posts : postsReducer,
        users : usersReducer
    }
})

//❓❓store의 reducer는 또 전체 state와 action을 가지고있고 ->
//reducer의 state로 들어가기때문에 state.post로 사용함