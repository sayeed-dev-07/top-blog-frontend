
import { removeComment, updateComment, getAllComments, createComment } from "@/lib/commentAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function useComments(postId) {
    return useQuery({
        queryKey: ["comments", postId],
        queryFn: () => getAllComments(postId),
        enabled: Number.isInteger(postId) && postId > 0,
    });
}


export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, content }) => createComment(postId, content),

        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: ["comments", variables.postId],
            });
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });
        },
    });
}

// 3. Edit an existing comment
export function useUpdateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId, content }) =>
            updateComment(postId, commentId, content),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["comments", variables.postId],
            });
            queryClient.invalidateQueries({
                queryKey: ["posts", variables.postId],
            });
        },
    });
}

// 4. Delete a comment
export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId }) => removeComment(postId, commentId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["comments", variables.postId],
            });
            queryClient.invalidateQueries({
                queryKey: ["posts"],
            });
        },
    });
}