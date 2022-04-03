/* eslint-disable react/display-name */
import { ColumnProps } from "antd/lib/table";
import { ParticipantData } from "src/_shared/api/mockApi";

export function useColumns() {
  const columns: ColumnProps<ParticipantData>[] = [
    {
      title: "Participant ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 160,
      sorter: { multiple: 1 },
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      width: 140,
      sorter: { multiple: 1 },
    },
    {
      title: "Ranking",
      dataIndex: "rank",
      key: "rank",
      width: 140,
      sorter: { multiple: 1 },
    },
  ];
  return columns;
}
