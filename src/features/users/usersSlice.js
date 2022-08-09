import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const USERS_URL = 'http://jsonplaceholder.typicode.com/users';

const initialState = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    try {
        const response = await axios.get(USERS_URL);
        return response.data;

    }catch(error) {
        return error.message;
    }
})

const userSlice = createSlice({
    name : 'users',
    initialState,
    reducers : {},
    /*
    //⭐️action에 대한 reducer정의 : createAsyncThunk에서는 액션함수를 따로 만들어 주어야 하기 때문에 extraReducer함수에다가 작성함
    actions필드에 포함되어 return된다.
    ⭐️builder객체 
    */
    extraReducers(builder) {
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload;
        })
    }
})

export const selectAllUsers = (state) => state.users;
export default userSlice.reducer;