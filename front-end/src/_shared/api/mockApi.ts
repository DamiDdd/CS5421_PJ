export type ParticipantData = {
  id: string;
  score: string;
  rank: string;
};

export type CompetitionData = {
  id: number;
  title: string;
  competition_start_date: string;
  competition_end_date: string;
  competition_descriptions: string;
  participants: ParticipantData[];
};

// 1 - Active
// 2 - Completed
export type CompetitionStatus = 1 | 2;

export type getCompetitionByIdResponseData = {
  competition: CompetitionData | undefined;
};

export type getCompetitionResponseData = {
  competitions: CompetitionData[] | undefined;
};
// Submit answer API
export type AnswerRecord = {
  answer: string;
};

export type SubmitAnswerRequest = {
  operator: string;
  competition_id: string;
  submission: AnswerRecord;
};

export const mockParticipants = {
  a1: {
    id: "A1234567B",
    rank: "2",
    score: "0.9",
  },
  a2: {
    id: "A1234567C",
    rank: "3",
    score: "0.8",
  },
  a3: {
    id: "A1234567D",
    rank: "4",
    score: "0.7",
  },
  a4: {
    id: "A1234567E",
    rank: "4",
    score: "0.7",
  },
  a5: {
    id: "A1234567F",
    rank: "1",
    score: "1",
  },
};

export const mockCompetition: Record<string, CompetitionData> = {
  1: {
    id: 1,
    title: "Competition A",
    competition_start_date: "1344528000",
    competition_end_date: "1596988800",
    competition_descriptions: "Submit the fastest query",
    participants: Object.values(mockParticipants),
  },
  2: {
    id: 2,
    title: "Competition B",
    competition_start_date: "1344528000",
    competition_end_date: "1596988800",
    competition_descriptions: "Submit the fastest query",
    participants: Object.values(mockParticipants),
  },
  3: {
    id: 3,
    title: "Competition C",
    competition_start_date: "1344528000",
    competition_end_date: "1596988800",
    competition_descriptions: "Submit the fastest query",
    participants: Object.values(mockParticipants),
  },
};

export const mockCompetitionData: CompetitionData[] = [
  {
    id: 1,
    title: "Competition A",
    competition_start_date: "1344528000",
    competition_end_date: "1596988800",
    competition_descriptions: "Submit the fastest query",
    participants: Object.values(mockParticipants),
  },
  {
    id: 2,
    title: "Competition B",
    competition_start_date: "1344528000",
    competition_end_date: "1596988800",
    competition_descriptions: "Submit the fastest query",
    participants: Object.values(mockParticipants),
  },
  {
    id: 3,
    title: "Competition C",
    competition_start_date: "1344528000",
    competition_end_date: "1596988800",
    competition_descriptions: "Submit the fastest query",
    participants: Object.values(mockParticipants),
  },
];

export function getCompetition(): Promise<getCompetitionResponseData> {
  const response = {
    competitions: Object.values(mockCompetition),
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(response), 1000);
  });
}

export function getCompetitionById(
  id: number
): Promise<getCompetitionByIdResponseData> {
  const response = {
    competition: !!mockCompetition[id] ? mockCompetition[id] : undefined,
  };
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(response), 1000);
  });
}

export function addCompetition(
  params: Record<string, string>
): Promise<Record<string, string>> {
  const response = { ...params };
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(response), 1000);
  });
}

export function submitQuery(
  params: Record<string, string>
): Promise<Record<string, string>> {
  const response = { ...params };
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(response), 1000);
  });
}
// export function submitAnswer(competition_id: number): Promise<> {}
