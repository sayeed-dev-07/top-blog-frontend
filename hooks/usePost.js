
import { createPost, getAllPosts, getPostById, publishPost, removePost, unpublishPost, updatePost } from "@/lib/postAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePosts() {
    return useQuery({
        queryKey: ["posts"],
        queryFn: getAllPosts,
    });
}

export function usePost(postId) {
    return useQuery({
        queryKey: ["posts", postId],
        queryFn: () => getPostById(postId),
        enabled: Number.isInteger(postId) && postId > 0,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => createPost(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, data }) => updatePost(postId, data),

        onSuccess: (response, variables) => {
            queryClient.setQueryData(["posts", variables.postId], response.post);

            queryClient.invalidateQueries({
                queryKey: ["posts"],
                exact: true,
            });
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId) => removePost(postId),

        onSuccess: (_, deletedPostId) => {
            queryClient.removeQueries({ queryKey: ["posts", deletedPostId] });

            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}

export function usePublishPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId) => publishPost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}

export function useUnpublishPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId) => unpublishPost(postId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
    });
}