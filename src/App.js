import React, { useState } from "react";
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
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useForm } from "antd/es/form/Form";
import Tasks from "./components/tasks";

const App = () => {
  const [form] = useForm();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listData, setListData] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Success",
    });
  };

  const handleOk = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const { data } = useQuery("lists-data", () => {
    return axios.get("http://localhost:3001/lists");
  });

  const { mutate: pustList, isLoading } = useMutation(
    (newData) => {
      return axios.put(`http://localhost:3001/lists/${listData?.id}`, newData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["lists-data"]);
        handleCancel();
        success();
      },
    }
  );

  const onFinish = (values) => {
    pustList(values);
  };

  return (
    <div className="h-[100vh] flex items-center justify-center">
      {contextHolder}
      {data?.data.map((list, index) => {
        return (
          <div key={index} className="min-w-[300px] px-1">
            <div
              className="rounded-xl bg-white pb-2"
              style={{
                boxShadow: "1px 0px 11px -2px rgba(34, 60, 80, 0.32)",
              }}
            >
              <div className="mt-5 p-3 flex items-center justify-between">
                <Typography>{list?.listName}</Typography>

                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={() => {
                          handleOk();
                          setListData(list);
                        }}
                        key={"1"}
                      >
                        <EditOutlined />
                        edit
                      </Menu.Item>
                    </Menu>
                  }
                  placement="bottomCenter"
                  arrow
                >
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <FaEllipsisVertical />
                    </Space>
                  </a>
                </Dropdown>
              </div>

              <div>
                <Tasks listId={list?.id} />
              </div>
            </div>
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
          <Form form={form} onFinish={onFinish} initialValues={listData}>
            <Form.Item label="taskName" name="listName">
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
    </div>
  );
};
export default App;
