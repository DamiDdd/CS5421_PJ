/* eslint-disable react/display-name */
import React from "react";
import { Tag } from "antd";
import { ColumnProps } from "antd/lib/table";
import { SubmissionData } from "src/_shared/api/api";

enum SubmissionStatus {
  PASS = 1,
  FAIL = 2,
  EVALUATING = 3,
}

export function useColumns() {
  const columns: ColumnProps<SubmissionData>[] = [
    {
      title: "Matric No",
      dataIndex: "participant_id",
      key: "participant_id",
      fixed: "left",
      width: 160,
      sorter: { multiple: 1 },
    },
    {
      title: "Submission Status",
      dataIndex: "submission_status",
      key: "submission_status",
      width: 140,
      sorter: { multiple: 1 },
      render: (value: any, _) => {
        switch (value) {
          case SubmissionStatus.PASS: {
            return <Tag color={"green"}>PASS</Tag>;
          }
          case SubmissionStatus.FAIL: {
            return <Tag color={"red"}>FAIL</Tag>;
          }
          default:
            return <Tag color={"orange"}>EVALUATING</Tag>;
        }
      },
    },
    {
      title: "Time Spent",
      dataIndex: "time_spend",
      key: "time_spend",
      width: 140,
      sorter: { multiple: 1 },
    },
  ];
  return columns;
}
