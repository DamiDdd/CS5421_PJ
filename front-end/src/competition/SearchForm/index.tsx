import { DatePicker, Form, Select } from "antd";
import moment from "moment";
import React from "react";
import { MONTH_DISPLAY, MONTH_FORMAT } from "src/_shared/constants";
import { useCompetitionsQuery } from "src/_shared/queries";
import s from "./s.module.scss";

const { MonthPicker } = DatePicker;

export type SearchFormProps = {
  month: moment.Moment;
  competitionId?: number;
  onMonthChange: (month: moment.Moment) => void;
  onCompetitionChange: (id: number) => void;
};
function SearchForm(props: SearchFormProps) {
  const { month, competitionId, onMonthChange, onCompetitionChange } = props;
  const selectedMonth = month.format(MONTH_FORMAT);
  const { data, isFetching } = useCompetitionsQuery(selectedMonth);
  const competitions = data ?? [];

  return (
    <Form labelAlign="left" layout="inline" colon={false}>
      <Form.Item label="Period" className={s.searchFormItem}>
        <MonthPicker
          value={month}
          onChange={onMonthChange}
          allowClear={false}
          placeholder="Select month"
          format={MONTH_DISPLAY}
        />
      </Form.Item>
      <Form.Item
        label="Competition"
        className={s.searchFormItem}
        style={{ width: 320 }}
      >
        <Select
          onChange={onCompetitionChange}
          loading={isFetching}
          value={competitionId}
          options={competitions.map((competition) => ({
            label: competition.name!,
            value: competition.id!,
          }))}
        />
      </Form.Item>
    </Form>
  );
}

export default SearchForm;
