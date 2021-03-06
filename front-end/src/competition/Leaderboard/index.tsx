import { Spin, Table } from "antd";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useCompetitionSubmissionsQuery } from "src/_shared/queries";
import { useColumns } from "./columns";

function Leaderboard() {
  const [searchParams] = useSearchParams();
  const competitionId = searchParams.get("competition_id") ?? undefined;
  const { data: submissionsData, isFetching } = useCompetitionSubmissionsQuery(
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
