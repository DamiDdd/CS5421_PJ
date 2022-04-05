import { Form, Input, message, Modal } from "antd";
import React from "react";
import { useForm } from "antd/lib/form/Form";
import { useAddSubmissionMutation } from "src/_shared/mutations";
import moment from "moment";

const QUERY_SUBMISSION_FORM_ID = "query-submission-form";
const requiredRule = { required: true, message: "Required" };
const whiteSpaceRule = { whitespace: true, message: "Required" };

type QuerySubmissionFormValues = {
  participant_id: string;
  answer: string;
};

type QuerySubmissionFormProps = {
  onSubmit: (values: QuerySubmissionFormValues) => void;
};

type QuerySubmissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  competitionId: number;
};

function QuerySubmissionForm(props: QuerySubmissionFormProps) {
  const { onSubmit } = props;
  const [form] = useForm();

  return (
    <Form
      id={QUERY_SUBMISSION_FORM_ID}
      form={form}
      labelAlign="left"
      labelWrap
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 17 }}
      initialValues={{
        participant_id: "A12345678B",
        answer: "SELECT A FROM B WHERE C ",
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="participant_id"
        label="Matric Number"
        rules={[requiredRule, whiteSpaceRule]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="answer" label="Answer">
        <Input.TextArea maxLength={255} />
      </Form.Item>
    </Form>
  );
}

function QuerySubmissionModal(props: QuerySubmissionModalProps) {
  const { isOpen, onClose, competitionId } = props;

  const { mutateAsync: addSubmissionMutateAsync, isLoading } =
    useAddSubmissionMutation();

  async function handleSubmit(values: QuerySubmissionFormValues) {
    const { participant_id, answer } = values;
    console.log(values);
    const data = await addSubmissionMutateAsync({
      competition_id: competitionId,
      participant_id,
      query: answer,
      submission_ts: moment().unix(),
    });
    if (data) {
      message.success("Query submitted successfully!");
      onClose();
    } else {
      message.error("Query failed.");
    }
    return;
  }

  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      title="Submit New Query"
      closable={false}
      destroyOnClose
      okButtonProps={{
        htmlType: "submit",
        form: QUERY_SUBMISSION_FORM_ID,
        loading: isLoading,
      }}
      cancelButtonProps={{
        disabled: isLoading,
      }}
    >
      <QuerySubmissionForm onSubmit={handleSubmit} />
    </Modal>
  );
}

export default QuerySubmissionModal;
