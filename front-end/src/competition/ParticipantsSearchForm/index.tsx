import { Form, Select } from "antd";
import React from "react";
import { useParticipantsQuery } from "src/_shared/queries";
import s from "./s.module.scss";

export type ParticipantSearchFormProps = {
  onParticipantChange: (id: string) => void;
  participantId?: string;
  competitionId?: number;
};
function ParticipantsSearchForm(props: ParticipantSearchFormProps) {
  const { onParticipantChange, participantId, competitionId } = props;
  const { data, isFetching } = useParticipantsQuery(Number(competitionId));
  console.log("Participants");
  console.log(data);

  const participants = data ?? [];

  return (
    <Form labelAlign="left" layout="inline" colon={false}>
      <Form.Item
        label="Participants"
        className={s.searchFormItem}
        style={{ width: 320 }}
      >
        <Select<string>
          onChange={onParticipantChange}
          loading={isFetching}
          value={participantId}
          options={participants.map((participant) => ({
            label: participant.participant_id!,
            value: participant.participant_id!,
          }))}
        />
      </Form.Item>
    </Form>
  );
}

export default ParticipantsSearchForm;
