import React, { useState } from "react";
import "./review-Style.css";
/*dummy comments will be removed later*/
const dummyPosts = [
    { body: "comment 1", post: [] },
    { body: "comment 2", post: [] },
];

const POST = () => {
    const [posts, setPosts] = useState(dummyPosts);

    const onPost = (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    const onReply = (postIndex, replyBody, parentIndices = [], username) => {
        const updatedPosts = [...posts];
    
        let currentLevel = updatedPosts[postIndex].post;
        for (let i = 0; i < parentIndices.length; i++) {
            currentLevel = currentLevel[parentIndices[i]].post;
        }
 
        currentLevel.push({ body: replyBody, username, post: [] }); 
        setPosts(updatedPosts);
    };

    return (
        <div>
            <CommentInput onPost={onPost} />

            <div>
                {posts.map((post, index) => (
                    <div className="comments" key={index}>
                        <PostItem
                            post={post}
                            onReply={(replyBody, parentIndices) => onReply(index, replyBody, parentIndices)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
const CommentInput = ({ onPost }) => {
    const [postBody, setPostBody] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handlePostSubmit = () => {
        const newPost = {
            body: postBody,
            username: isAnonymous ? "Anonymous" : "userName", 
            post: [],
        };
        onPost(newPost);
        setPostBody("");
        setIsAnonymous(false);
    };

    return (
        <div>
            <textarea
                placeholder="Need help? ask here"
                className="Posting"
                value={postBody}
                onChange={(event) => setPostBody(event.target.value)}
            />
            <div className="button-container">
                <label className="anonymous-checkbox">
                    <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                    />
                    Post anonymously
                </label>
                <button onClick={handlePostSubmit} className="submit">
                    Submit
                </button>
            </div>
        </div>
    );
};
const PostItem = ({ post, onReply, parentIndices = [] }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyBody, setReplyBody] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const handleReplyClick = () => {
        if (isReplying) {
            setReplyBody(""); 
        }
        setIsReplying(!isReplying); 
    };

    const handleReplySubmit = () => {
        onReply(replyBody, parentIndices, isAnonymous ? "Anonymous" : "Jana"); // Use "Jana" if not anonymous
        setReplyBody("");
        setIsAnonymous(false);
        setIsReplying(false); 
    };

    const toggleReplies = () => {
        setShowReplies((prev) => !prev);
    };

    return (
        <div>
           
            <div className="comment-container">
                <span className="comment-body">
                    <strong>{post.username || "Anonymous"}: </strong>
                    {post.body}
                </span>

                {isReplying && (
                    <textarea
                        placeholder="Reply here"
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                    />
                )}

                <div className="button-container">
                    <button onClick={handleReplyClick} className="ReplyCancle">
                        {isReplying ? "Cancel" : "Reply"}
                    </button>

                    {isReplying && (
                        <label className="anonymous-checkbox">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={(e) => setIsAnonymous(e.target.checked)}
                            />
                            Post anonymously
                        </label>
                    )}

                    {isReplying && (
                        <button onClick={handleReplySubmit} className="submit-reply">
                            Submit
                        </button>
                    )}

                    {post.post.length > 0 && (
                        <button onClick={toggleReplies} className="SeeMore">
                            {showReplies ? "Hide" : `See More (${post.post.length} replies)`}
                        </button>
                    )}
                </div>
            </div>

            {showReplies && (
                <div>
                    {post.post.map((reply, index) => (
                        <div key={index} className="reply">
                            <PostItem
                                post={reply}
                                onReply={onReply}
                                parentIndices={[...parentIndices, index]}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default POST;
