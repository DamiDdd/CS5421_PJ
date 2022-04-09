import { Spin, Table } from "antd";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useParticipantSubmissionsQuery } from "src/_shared/queries";
import { useColumns } from "./columns";

function Submissions() {
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get("participant_id") ?? undefined;
  console.log("Submissions Participant Id");
  const { data: submissionsData, isFetching } =
    useParticipantSubmissionsQuery(participantId);
  const submissions = submissionsData ?? [];

  const columns = useColumns();
  return (
    <Spin spinning={isFetching}>
      <Table dataSource={submissions} columns={columns} />
    </Spin>
  );
}

export default Submissions;
