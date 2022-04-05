import { Spin, Table } from "antd";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { CompetitionData } from "src/_shared/api/api";
import { useSubmissionsQuery } from "src/_shared/queries";
import { useColumns } from "./columns";

export type LeaderboardProps = {
  competition: CompetitionData;
};

function Leaderboard(props: LeaderboardProps) {
  const [searchParams] = useSearchParams();
  const competitionId = searchParams.get("competition_id") ?? undefined;
  const { data: submissionsData, isFetching } = useSubmissionsQuery(
    Number(competitionId)
  );
  const submissions = submissionsData ?? [];

  const columns = useColumns();
  return (
    <Spin spinning={isFetching}>
      <Table dataSource={submissions} columns={columns} />
    </Spin>
  );
}

export default Leaderboard;
