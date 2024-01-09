import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  Space,
  Typography,
  message,
} from "antd";
import axios from "axios";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "react-query";

import "./style.css";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";

const Tasks = () => {
  const [form] = useForm();
  const [form2] = useForm();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Success",
    });
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { data } = useQuery("tasks-data", () => {
    return axios.get("http://localhost:3001/tasks");
  });
  const { mutate: taskPost } = useMutation(
    (newData) => {
      return axios.post("http://localhost:3001/tasks", newData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks-data"]);
        form2.setFieldValue("name", "");
      },
    }
  );
  const { mutate: pustTask, isLoading } = useMutation(
    (newData) => {
      return axios.put(`http://localhost:3001/tasks/${taskData?.id}`, newData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks-data"]);
        setIsModalOpen(false);
        success();
      },
    }
  );
  const { mutate: deleteTask } = useMutation(
    (id) => {
      return axios.delete(`http://localhost:3001/tasks/${id}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["tasks-data"]);
        success();
      },
    }
  );

  const onFinish = (values) => {
    pustTask(values);
  };

  return (
    <>
      {contextHolder}

      <Form
        name="basic"
        form={form2}
        onFinish={(values) => {
          const newData = {
            listId: 1,
            taskName: values?.name,
          };
          taskPost(newData);
        }}
        className="flex items-center justify-center h-[50px]"
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your taskName!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            +
          </Button>
        </Form.Item>
      </Form>

      {data?.data.map((task, index) => {
        return (
          <div
            key={index}
            className="px-2 py-1 my-1 flex items-center justify-between rounded-sm bg-white task"
          >
            <Typography>{task?.taskName}</Typography>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      setIsModalOpen(true);
                      setTaskData(task);
                      form.setFieldValue("taskName", task.taskName);
                    }}
                    key={"1"}
                  >
                    <EditOutlined />
                    edit
                  </Menu.Item>

                  <Menu.Item
                    key={"2"}
                    onClick={() => {
                      deleteTask(task?.id);
                    }}
                    className="text-red-600"
                  >
                    <DeleteOutlined />
                    delete
                  </Menu.Item>
                </Menu>
              }
              placement="top"
              arrow
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <FaEllipsisVertical />
                </Space>
              </a>
            </Dropdown>
          </div>
        );
      })}

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        {isLoading ? (
          <> Loading... </>
        ) : (
          <Form form={form} onFinish={onFinish} initialValues={taskData}>
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
                o'zgartirish
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </>
  );
};

export default Tasks;
