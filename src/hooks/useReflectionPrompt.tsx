import { genaiClient } from '@/services/genaiClient'
import { useQuery } from '@tanstack/react-query'

export default function useReflectionPrompt() {
    const { data: res, isError, isFetching, refetch, error } = useQuery({
        queryKey: ['reflectionPrompt'],
        queryFn: async () => await genaiClient.generateReflectionPrompt(),
        placeholderData: (previousData) => previousData,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 2, // 1 hour
    })

    return {
        reflectionPrompt: res?.data?.data?.reflectionPrompt,
        reflectionPromptIsError: isError,
        reflectionPromptIsFetching: isFetching,
        reflectionPromptRefetch: refetch,
        reflectionPromptError: error
    }
}
