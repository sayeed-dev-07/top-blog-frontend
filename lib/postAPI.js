import { apiRequest } from "@/lib/api";

// GET /posts -> Backend returns { posts: Post[] }
export async function getAllPosts() {
    const response = await apiRequest("/posts");
    return response.posts;
}

// GET /posts/:postId -> Backend returns { data: Post }
export async function getPostById(postId) {
    const response = await apiRequest(`/posts/${postId}`);
    return response.data;
}

// POST /posts -> Backend returns { message: string, post: Post }
export function createPost(data) {
    return apiRequest("/posts", {
        method: "POST",
        data,
    });
}

// PATCH /posts/:postId -> Backend returns { message: string, post: Post }
export function updatePost(postId, data) {
    return apiRequest(`/posts/${postId}`, {
        method: "PATCH",
        data,
    });
}

// DELETE /posts/:postId -> Backend returns { message: string }
export function removePost(postId) {
    return apiRequest(`/posts/${postId}`, {
        method: "DELETE",
    });
}