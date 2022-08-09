//redux에서 자동으로 생성해주는 id
import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

//toISOString : local시간으로 정상 변경
//sync request lifecycle : pending(보류;로딩), fulfiled(충족;성공), rejected(거절;실패)
const initialState = {
    posts : [],
    status : 'idle', //'idle','loading','succeeded','failed'
    error: null
}

//⭐createAsyncThunk has 2 arguments 
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        const response = await axios.get(POSTS_URL)
        return response.data
    } catch (err) {
        return err.message;
    }
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

//⭐state.push()의 사용 : Slice안에서는 ...state가 자동으로 들어가기때문에 그냥 push만 해주어도된다.
//하지만 Slice이외의 다른 곳에서는 원래했던것 처럼 기존의 state를 받아오고 새로운 state를 더해주어야한다.

//⭐prepare와 같은 custom으로 사용가능
const postsSlice = createSlice({
    name : 'posts',
    initialState,
    reducers : {
        postAdded : {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload : {
                        id: nanoid(),
                        title,
                        content,
                        date : new Date().toISOString(),
                        userId,
                        reactions : {
                            thumbsUp : 0,
                            wow: 0,
                            heart:0,
                            rocket:0,
                            coffee:0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action){
            const{ postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if(existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    //switch케이스와 비슷하지만 based on the builder -> addCase를 통해서 각각의 case를 정리한다.
    //만들어진 비동기 액션에 대한 리듀서는 아래와 같이 extraReducers로 작성할 수 있다.
    //extreReducers에 정의된 리듀서들은 외부의 액션 타입에 대응하기 때문에 slice.actions를 이용하여 액션을 생성할 수 없다는 특징을 가짐
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                // Adding date anlet min = 1;
                let min = 1;
                const loadedPosts =action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post;
                });

                // Add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
    } 
})

//다른컴포넌트에도 posts가 바뀌는걸 알려주어야해서 이렇게 사용한다?? 
export const selectAllPosts = (state) => state.posts.posts;
export const getPostsStatus = (state) => state.posts.status;
export const getPostsError = (state) => state.posts.error;


export const { postAdded, reactionAdded } =postsSlice.actions

//⭐만들어둔 createSlice에서 action함수를 이용해서 자동으로 reducer를만들어주기 때문에 reducer를 내보내주면된다!
export default postsSlice.reducer;