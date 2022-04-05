import { Table } from "antd";
import React from "react";
import { ParticipantData } from "src/_shared/api/mockApi";
import { useColumns } from "./columns";

export type LeaderboardProps = {
  participants: ParticipantData[];
};

function Leaderboard({ participants }: LeaderboardProps) {
  const columns = useColumns();
  return <Table dataSource={participants} columns={columns} />;
}

export default Leaderboard;
