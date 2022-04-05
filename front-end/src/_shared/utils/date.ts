import moment from "moment";
import { DATE_FORMAT } from "../constants";

export function getDateTimeRangeForMonth(month: string | moment.Moment) {
  const selectedMonth = moment(month);
  const from = selectedMonth.startOf("month").format(DATE_FORMAT);
  const to = selectedMonth.endOf("month").format(DATE_FORMAT);
  return [from, to];
}

export function getUnixDateTimeRangeForMonth(month: string | moment.Moment) {
  const selectedMonth = moment(month);
  const from = selectedMonth.startOf("month").unix();
  const to = selectedMonth.endOf("month").unix();
  return [from, to];
}
