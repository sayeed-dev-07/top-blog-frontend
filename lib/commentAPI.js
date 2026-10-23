import { apiRequest } from "./api";

const getAllComments = async (postId) => {
    const res = await apiRequest(`/posts/${postId}/comments`)
    return res.data;
}

const createComment = (postId, content, username) => {
    return apiRequest(`/posts/${postId}/comments`, {
        method: "POST",
        data: { content, username },
    });
}

function updateComment(postId, commentId, content) {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
        method: "PATCH",
        data: { content },
    });
}

function removeComment(postId, commentId) {
    return apiRequest(`/posts/${postId}/comments/${commentId}`, {
        method: "DELETE",
    });
}

export { removeComment, createComment, updateComment, getAllComments }
