import React from "react";
import { Button, Form, Input, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useForm } from "antd/es/form/Form";
import { api } from "../api";

const EditTask = ({ setIsModalOpen, isModalOpen, taskData }) => {
  const [form] = useForm();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (newData) => {
      return api.get(`tasks/${taskData?.id}`, newData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks-data"]);
      },
    }
  );

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values) => {
    mutate(values);
  };

  return (
    <>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          initialValues={taskData}
        >
          <Form.Item label="taskName" name="taskName">
            <Input />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default EditTask;
