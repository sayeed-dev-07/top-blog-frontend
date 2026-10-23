import { removeComment, updateComment, getAllComments, createComment } from '@/lib/commentAPI';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const invalidateCommentData = (queryClient, postId) => {
    queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
};

export function useComments(postId) {
    return useQuery({
        queryKey: ['comments', postId],
        queryFn: () => getAllComments(postId),
        enabled: Number.isInteger(postId) && postId > 0,
    });
}

export function useCreateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, content, username }) => createComment(postId, content, username),
        onSuccess: (_, { postId }) => invalidateCommentData(queryClient, postId),
    });
}

export function useUpdateComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId, content }) =>
            updateComment(postId, commentId, content),
        onSuccess: (_, { postId }) => invalidateCommentData(queryClient, postId),
    });
}

export function useDeleteComment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId }) => removeComment(postId, commentId),
        onSuccess: (_, { postId }) => invalidateCommentData(queryClient, postId),
    });
}
