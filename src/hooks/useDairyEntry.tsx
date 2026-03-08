import { dairyService } from "@/services/dairyService"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router";

export default function useDairyEntry() {
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('q') === 'community' ? 'community' : 'personal'; // Default to 'personal' if no valid tab is provided

    const { data, isError, isLoading, refetch, error } = useQuery({
        queryKey: ['dairyEntries', activeTab], // Include activeTab in the query key to refetch when it changes
        queryFn: async () => await dairyService.getDairyEnteries({ queryKey: activeTab }),
    })

    return {
        dairyEnteries: data?.data?.entries,
        dairyEntriesIsError: isError,
        dairyEntriesIsLoading: isLoading,
        dairyEntriesError: error,
        dairyEntriesRefetch: refetch
    }
}
