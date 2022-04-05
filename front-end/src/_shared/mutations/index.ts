import { useMutation, useQueryClient } from "react-query";
import { addCompetition, submitQuery } from "../api/mockApi";
import { QueryKey } from "../queries";

export function useAddCompetitionMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    async (params: Record<string, string>) => {
      const { data } = await addCompetition(params);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.COMPETITION);
      },
    }
  );
}

export function useSubmitQueryMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    async (params: Record<string, string>) => {
      const { data } = await submitQuery(params);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.COMPETITION);
      },
    }
  );
}
