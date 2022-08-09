import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//slice에서 가져온 action
import { addNewPost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";

import React from 'react';

const AddPostForm = () => {
    const dispatch = useDispatch();
    //⭐useState() : temporary state that controlled form Input(title,content etc) -> component내에서만 사용
    //redux에서 쓸 필요가없다. 이 컴포넌트 안에서만 쓰면된다.
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle');

    const users = useSelector(selectAllUsers)

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle';

    const onSavePostClicked = () => {
        if(canSave) {
            try {
                setAddRequestStatus('pending');
                dispatch(addNewPost({ title, body : content, userId })).unWrap()

                setTitle('')
                setContent('')
                setUserId('')
            }catch(error) {
                console.error('Filed to save the pose', error)
            }finally {
                setAddRequestStatus('idle');
            }
        }
    };
    

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))


    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="posuAuthor">Autor:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>

                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
            </form>
        </section>
    );
};

export default AddPostForm;