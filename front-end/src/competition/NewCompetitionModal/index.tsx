import { Form, Input, message, Modal, Radio } from "antd";
import React from "react";
import moment from "moment";
import { useForm } from "antd/lib/form/Form";
import s from "./s.module.scss";
import { useAddCompetitionMutation } from "src/_shared/mutations";
import { getUnixDateTimeRangeForMonth } from "src/_shared/utils/date";

const NEW_COMPETITION_FORM_ID = "new-competition-form";
const requiredRule = { required: true, message: "Required" };
const whiteSpaceRule = { whitespace: true, message: "Required" };

enum CompetitionType {
  FASTEST = 1,
  SLOWEST = 2,
}

type NewCompetitionFormValues = {
  type: CompetitionType;
  title: string;
  description: string;
  answer: string;
  period: string;
};

type NewCompetitionFormProps = {
  onSubmit: (values: NewCompetitionFormValues) => void;
  month: moment.Moment;
};

type NewCompetitionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  month: moment.Moment;
};

function NewCompetitionForm(props: NewCompetitionFormProps) {
  const { month, onSubmit } = props;
  const [form] = useForm();

  return (
    <Form
      id={NEW_COMPETITION_FORM_ID}
      form={form}
      labelAlign="left"
      labelWrap
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 17 }}
      initialValues={{
        type: CompetitionType.FASTEST,
        period: month,
        name: "Competition",
      }}
      onFinish={onSubmit}
    >
      <Form.Item name="type" label="Type" rules={[requiredRule]}>
        <Radio.Group className={s.radioGroup}>
          <Radio.Button value={CompetitionType.FASTEST}>FASTEST</Radio.Button>
          <Radio.Button value={CompetitionType.SLOWEST}>SLOWEST</Radio.Button>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="title"
        label="Competition Title"
        rules={[requiredRule, whiteSpaceRule]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Competition Description">
        <Input.TextArea maxLength={255} />
      </Form.Item>
      <Form.Item name="answer" label="Sample Solution" rules={[requiredRule]}>
        <Input.TextArea maxLength={255} />
      </Form.Item>
    </Form>
  );
}

function NewCompetitionModal(props: NewCompetitionModalProps) {
  const { isOpen, onClose, month } = props;

  const { mutateAsync: addCompetitionMutateAsync, isLoading } =
    useAddCompetitionMutation();

  async function handleSubmit(values: NewCompetitionFormValues) {
    const { type, title, description, answer, period } = values;
    const [from, to] = getUnixDateTimeRangeForMonth(period);
    const data = await addCompetitionMutateAsync({
      type,
      start_time: from,
      end_time: to,
      name: title,
      description,
      answer,
    });
    if (data) {
      message.success("Competition added successfully!");
      onClose();
    } else {
      message.error("Failed to add a competition");
    }
    return;
  }

  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      title="Create New Competition"
      closable={false}
      maskClosable={false}
      okText="Create"
      destroyOnClose
      okButtonProps={{
        htmlType: "submit",
        form: NEW_COMPETITION_FORM_ID,
        loading: isLoading,
      }}
      cancelButtonProps={{
        disabled: isLoading,
      }}
    >
      <NewCompetitionForm onSubmit={handleSubmit} month={month} />
    </Modal>
  );
}

export default NewCompetitionModal;
