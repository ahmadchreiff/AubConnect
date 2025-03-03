import React, { useState } from "react";
import "./review-Style.css";

const dummyPosts = [
    { body: "comment 1", post: [] },
    { body: "comment 2", post: [] },
];

const POST = () => {
    const [posts, setPosts] = useState(dummyPosts);
    const [deletePost, setDeletePost] = useState(null);
    const [editPost, setEditPost] = useState(null); // State for editing

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

    const onDelete = (postIndex, parentIndices = []) => {
        const updatedPosts = [...posts];
        if (parentIndices.length === 0) {
            updatedPosts.splice(postIndex, 1);
        } else {
            let currentLevel = updatedPosts[postIndex].post;
            for (let i = 0; i < parentIndices.length - 1; i++) {
                currentLevel = currentLevel[parentIndices[i]].post;
            }
            currentLevel.splice(parentIndices[parentIndices.length - 1], 1);
        }
        setPosts(updatedPosts);
        setDeletePost(null);
    };

    const onEdit = (postIndex, parentIndices, newBody) => {
        const updatedPosts = [...posts];
        if (parentIndices.length === 0) {
            updatedPosts[postIndex].body = newBody;
        } else {
            let currentLevel = updatedPosts[postIndex].post;
            for (let i = 0; i < parentIndices.length; i++) {
                currentLevel = currentLevel[parentIndices[i]].post;
            }
            currentLevel.body = newBody;
        }
        setPosts(updatedPosts);
        setEditPost(null); // Close the edit pop-up
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
                            onDelete={(parentIndices) => setDeletePost({ postIndex: index, parentIndices })}
                            onEdit={(parentIndices) => setEditPost({ postIndex: index, parentIndices, currentBody: post.body })}
                        />
                    </div>
                ))}
            </div>

            {deletePost && (
                <div className="pop-up-confirm-delet">
                    <h3>Delete</h3>
                    <p>Are you sure you want to delete? Once you confirm, this action can't be undone.</p>
                    <button className="yes" onClick={() => onDelete(deletePost.postIndex, deletePost.parentIndices)}>
                        Confirm
                    </button>
                    <button className="no" onClick={() => setDeletePost(null)}>
                        Cancel
                    </button>
                </div>
            )}

            {editPost && (
                <div className="pop-up-edit">
                    <h3>Edit</h3>
                    <textarea
                        defaultValue={editPost.currentBody}
                        onChange={(e) => setEditPost({ ...editPost, currentBody: e.target.value })}
                    />
                    <button className="save" onClick={() => onEdit(editPost.postIndex, editPost.parentIndices, editPost.currentBody)}>
                        Save
                    </button>
                    <button className="cancel" onClick={() => setEditPost(null)}>
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};
const CommentInput = ({ onPost }) => {
    const [postBody, setPostBody] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);

    const handlePostSubmit = () => {
        if(postBody.trim()===""){
            alert("Sorry,you can't submit an empty post!");
            return;
        }
        const newPost = {
            body: postBody,
            username: isAnonymous ? "Anonymous" : "userName",//user name must be chnaged to the actual username  
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
const PostItem = ({ post, onReply, onDelete, onEdit, parentIndices = [] }) => {
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
        if (replyBody.trim() === "") {
            alert("Sorry,reply can not be empty!");
            return;
        }
        onReply(replyBody, parentIndices, isAnonymous ? "Anonymous" : "userName");
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
                      <button onClick={() => onEdit(parentIndices)} className="edit">
                        Edit
                    </button>
                    <button onClick={() => onDelete(parentIndices)} className="delete">
                        Delete
                    </button>

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
                                onDelete={onDelete}
                                onEdit={onEdit}
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
