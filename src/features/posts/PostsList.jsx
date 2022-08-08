import { useSelector,useDispatch } from "react-redux";
import { selectAllPosts, getPostsStatus, getPostsError, fetchPosts } from './postsSlice';
import { useEffect } from "react";
import PostsExcept from './PostsExcept';

import React from 'react';

const PostsList = () => {
    const dispatch = useDispatch();
    //🌳postsSlice에 작성해둔 posts state를 가져온다.
    const posts = useSelector(selectAllPosts);
    const postsStatus = useSelector(getPostsStatus);
    const error = useSelector(getPostsError);

    //📌posstsStatus가 idle이면 fetchPosts를 dispatch한다.
    useEffect(()=> {
        if(postsStatus === 'idle') {
            dispatch(fetchPosts())
        }
    },[postsStatus, dispatch])

    //🌳postsSlice에서 작성했던 data를 map을 통해 iterator
    //⭐substring은 mdm에서 찾아보기 -> 길이가 긴 문자열을 100개까지만 preview함
    //윗쪽에 이렇게 정의해주고 사용하면 return되는 jsx가 clean해짐
    //⭐Slice에서 seletor를만들고 보내는 것이 나은이유❓ data가 변경되면 
    /*
    컴포넌트에 변경된 data를 알려주어야 하는데 
    Slice에서 만들어 놓으면 자동으로 변경되서 전달되기 때문이다.
    */
    //⭐sort : 원래 데이터는 건들지 않기 위해서 slice로 얕은 복사를 해온 후에 sort하게됨 (원래 데이터는 건들지 않고 새로운 배열 return )
    // const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))
    //✅orderPost를 다시 배열로 return 했기 때문에 정렬된거를 map해준다
    // const renderedPosts = orderedPosts.map()

    let content;
    if (postsStatus === 'loading') {
        content = <p>'Loading...'</p>;
    }else if(postsStatus === 'succeeded') {
        const orderedPosts = posts.slice().sort((a,b) => b.date.localeCompare(a.date))
        content = orderedPosts.map(post => <PostsExcept key={post.id} post={post} />)
    } else if (postsStatus === 'failed') {
        content = <p>{error}</p>
    }


    return (
        <section>
            <h2>Posts</h2>
            {content}
        </section>
    )
};

export default PostsList;