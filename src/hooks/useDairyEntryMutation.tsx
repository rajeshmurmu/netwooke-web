import { dairyService } from "@/services/dairyService";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";

export default function useDairyEntryMutation() {
    const queryClient = useQueryClient()
    const { data, isError, isPending, mutate, error } = useMutation({
        mutationFn: async (data: { title: string; content: string; isPrivate: boolean }) => await dairyService.createEntry(data),
        onSuccess: (data) => {
            console.log('Dairy entry created:', data.entry);
            toast.success(data?.message || 'Dairy entry saved successfully!')
            queryClient.invalidateQueries({ queryKey: ['dairyEntries'] })

        },
        onError: (error) => {
            console.error('Error creating dairy entry:', error);
            toast.error('Failed to save dairy entry. Please try again.')
        }
    })
    return {
        createEntry: mutate,
        newEntry: data?.data?.entry,
        entryIsError: isError,
        EntryIsPending: isPending,
        EntryError: error
    }

}
