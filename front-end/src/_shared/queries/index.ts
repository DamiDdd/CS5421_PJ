import { useQuery, UseQueryOptions } from "react-query";
import {
  getCompetition,
  getCompetitionById,
  getCompetitionByIdResponseData,
  getCompetitionResponseData,
} from "../api/mockApi";

export enum QueryKey {
  COMPETITION = "COMPETITION",
  COMPETITION_BY_ID = "COMPETITION_BY_ID",
}

export function useCompetitionsQuery(
  month?: string,
  options?: UseQueryOptions<
    getCompetitionResponseData,
    unknown,
    getCompetitionResponseData
  >
) {
  return useQuery(
    [QueryKey.COMPETITION],
    async () => {
      const response = await getCompetition();
      return response;
    },
    options
  );
}

export function useCompetitionByIdQuery(
  id: number,
  options?: UseQueryOptions<
    getCompetitionByIdResponseData,
    unknown,
    getCompetitionByIdResponseData
  >
) {
  return useQuery(
    [QueryKey.COMPETITION_BY_ID, { id }],
    async () => {
      const response = await getCompetitionById(id);
      return response;
    },
    options
  );
}
