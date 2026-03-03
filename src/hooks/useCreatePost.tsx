import type { PostInput } from '@/lib/zod/postSchema'
import { postService } from '@/services/postService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export default function useCreatePost() {
    const queryClient = useQueryClient()
    const { mutateAsync, data, isError, isSuccess, isPending, error } = useMutation({
        mutationFn: async (data: PostInput) => postService.createPost(data),
        onSuccess: (data) => {
            console.log(data)
            toast.success(data?.message || "Post created successfully")
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },

        onError: (error) => {
            if (error.message.startsWith("modeRationError:")) {
                toast.error("Network Tube is a safe space. Please refine your wisdom.");
                return;

            }
            toast.error("An error occurred while creating the post")
        }
    })

    return {
        createPost: mutateAsync,
        data: data?.data,
        isError,
        isSuccess,
        isPending,
        error,
    }
}
