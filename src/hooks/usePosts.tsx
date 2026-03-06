import { postService } from "@/services/postService"
import type { Post } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const usePosts = () => {
    const { data, isError, isLoading, refetch, error, } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => await postService.getPosts()
    })
    return {
        posts: data?.data?.posts as Post[],
        meta: data?.meta,
        postIsErorr: isError,
        postLoading: isLoading,
        postRefetch: refetch,
        postError: error
    }
}