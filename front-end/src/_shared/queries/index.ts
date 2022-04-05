import { useQuery, UseQueryOptions } from "react-query";
import {
  listCompetitions,
  getCompetitionResponseData,
  getCompetitionById,
  getCompetitionByIdResponseData,
  getSubmissions,
  getSubmissionResponseData,
} from "../api/api";
import { getUnixDateTimeRangeForMonth } from "../utils/date";

export enum QueryKey {
  COMPETITION = "COMPETITION",
  COMPETITION_BY_ID = "COMPETITION_BY_ID",
  SUBMISSION = "SUBMISSION",
}

export function useCompetitionsQuery(
  month: string,
  options?: UseQueryOptions<
    getCompetitionResponseData,
    unknown,
    getCompetitionResponseData
  >
) {
  return useQuery(
    [QueryKey.COMPETITION, { month }],
    async () => {
      const [from, to] = getUnixDateTimeRangeForMonth(month);
      const response = await listCompetitions({
        from,
        to,
      });
      return response;
    },
    options
  );
}

export function useCompetitionByIdQuery(
  id: number | undefined,
  options?: UseQueryOptions<
    getCompetitionByIdResponseData,
    unknown,
    getCompetitionByIdResponseData
  >
) {
  return useQuery(
    [QueryKey.COMPETITION_BY_ID, { id }],
    async () => {
      if (typeof id === "undefined") return;
      const response = await getCompetitionById({
        competition_id: id,
      });
      return response;
    },
    options
  );
}

export function useSubmissionsQuery(
  id: number,
  options?: UseQueryOptions<
    getSubmissionResponseData,
    unknown,
    getSubmissionResponseData
  >
) {
  return useQuery(
    [QueryKey.SUBMISSION, { id }],
    async () => {
      const response = await getSubmissions({
        competition_id: id,
      });
      return response;
    },
    options
  );
}
