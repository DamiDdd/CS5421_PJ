import { Form, Input, message, Modal } from "antd";
import React from "react";
import { useForm } from "antd/lib/form/Form";
import { useSubmitQueryMutation } from "src/_shared/mutations";

const QUERY_SUBMISSION_FORM_ID = "query-submission-form";
const requiredRule = { required: true, message: "Required" };
const whiteSpaceRule = { whitespace: true, message: "Required" };

type QuerySubmissionFormValues = {
  id: string;
  answer: string;
};

type QuerySubmissionFormProps = {
  onSubmit: (values: QuerySubmissionFormValues) => void;
};

type QuerySubmissionModalProps = {
  isOpen: boolean;
  onClose: () => void;
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
        id: "A12345678B",
        answer: "SELECT A FROM B WHERE C ",
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        name="id"
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
  const { isOpen, onClose } = props;

  const { mutateAsync: submitQueryMutateAsync, isLoading } =
    useSubmitQueryMutation();

  async function handleSubmit(values: QuerySubmissionFormValues) {
    const { id, answer } = values;
    const data = await submitQueryMutateAsync({
      id,
      answer,
    });
    if (data) {
      message.success("Query submitted successfully!");
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
