import { fetchClient } from ".";

const BASE_URL = "http://127.0.0.1:5000";

export type CompetitionData = {
  id: number;
  name: string;
  start: string;
  end: string;
  description: string;
};

export type SubmissionData = {
  id: number;
  participant_id: number;
  submission_ts: number;
  query: string;
  pass: boolean;
  time_spent: number;
};

export type getCompetitionResponseData = CompetitionData[] | undefined;
export type getCompetitionByIdResponseData = CompetitionData | undefined;
export type getSubmissionResponseData = SubmissionData[] | undefined;

export function addCompetition(params: Record<string, any>): any {
  return fetchClient(`${BASE_URL}/add_competition`, { body: params });
}

export function listCompetitions(params: Record<string, any>): any {
  return fetchClient(`${BASE_URL}/list_competitions`, { body: params });
}

export function getCompetitionById(params: Record<string, any>): any {
  return fetchClient(`${BASE_URL}/get_competition`, { body: params });
}

export function getSubmissions(params: Record<string, any>): any {
  return fetchClient(`${BASE_URL}/list_submissions_by_competition`, {
    body: params,
  });
}

export function addSubmission(params: Record<string, any>): any {
  return fetchClient(`${BASE_URL}/add_submission`, {
    body: params,
  });
}
