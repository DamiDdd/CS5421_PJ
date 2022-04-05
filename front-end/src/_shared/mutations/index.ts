import { useMutation, useQueryClient } from "react-query";
import { addCompetition, addSubmission } from "../api/api";
import { QueryKey } from "../queries";

export function useAddCompetitionMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    async (params: Record<string, any>) => {
      const data = await addCompetition(params);
      // console.log(response);
      console.log("Data from add competition API");
      console.log(data);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.COMPETITION);
      },
    }
  );
}

export function useAddSubmissionMutation() {
  const queryClient = useQueryClient();
  return useMutation(
    async (params: Record<string, any>) => {
      const data = await addSubmission(params);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKey.COMPETITION);
        queryClient.invalidateQueries(QueryKey.SUBMISSION);
      },
    }
  );
}
