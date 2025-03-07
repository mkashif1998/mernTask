import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRequest, postRequest, putRequest, deleteRequest } from './utils/service';

const App = () => {
  
  const [taskData, setTaskData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getRequest('api/tasks');
      setTaskData(data);
    } catch (error) {
      message.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await deleteRequest(`api/tasks/${id}`);
      if (response) {
        setTaskData(taskData.filter(task => task._id !== id));
        message.success('Task deleted successfully');
      } else {
        message.error('Failed to delete task');
      }
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      const { _id, ...taskWithoutId } = updatedTask;
      const response = await putRequest(`api/tasks/${_id}`, taskWithoutId);
      if (response) {
        setTaskData(taskData.map(task => 
          task._id === _id ? { ...response, _id } : task
        ));
        message.success('Task updated successfully');
      } else {
        message.error('Failed to update task');
      }
    } catch (error) {
      message.error('Failed to update task');
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await postRequest('api/tasks', newTask);
      if (response) {
        setTaskData([...taskData, response]);
        message.success('Task added successfully');
      } else {
        message.error('Failed to add task');
      }
    } catch (error) {
      message.error('Failed to add task');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return String(record.title).toLowerCase().includes(value.toLowerCase()) ||
               String(record.description).toLowerCase().includes(value.toLowerCase()) ||
               String(record.completed ? 'Completed' : 'Pending').toLowerCase().includes(value.toLowerCase());
      },
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Comment',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description)
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const status = record.completed ? 'Completed' : 'Pending';
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
            ${status === 'Completed' ? 'bg-green-100 text-green-800' : 
              status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
              'bg-blue-100 text-blue-800'}`}>
            {status}
          </span>
        );
      },
      sorter: (a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              const formData = {
                title: record.title,
                comment: record.description,
                status: record.completed ? 'true' : 'false'
              };
              setEditTask(record);
              form.setFieldsValue(formData);
              setShowModal(true);
            }}
          />
          <Button 
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              setTaskToDelete(record._id);
              setDeleteConfirmVisible(true);
            }}
          />
        </Space>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 w-full">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
            <Space>
              <Input.Search
                placeholder="Search tasks..."
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Button
                type="primary"
                onClick={() => {
                  setEditTask(null);
                  form.resetFields();
                  setShowModal(true);
                }}
              >
                Add Task
              </Button>
            </Space>
          </div>

          <Spin spinning={loading}>
            <Table
              columns={columns}
              dataSource={taskData}
              rowKey="_id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} items`
              }}
              sortDirections={['ascend', 'descend']}
            />
          </Spin>
        </div>
      </div>

      <Modal
        title={editTask ? 'Edit Task' : 'Add Task'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={async (values) => {
            try {
              const taskData = {
                title: values.title,
                description: values.comment,
                completed: values.status === 'true'
              };

              if (editTask) {
                await updateTask({ ...taskData, _id: editTask._id });
              } else {
                await addTask(taskData);
              }
              setShowModal(false);
              form.resetFields();
            } catch (error) {
              message.error(editTask ? 'Failed to update task' : 'Failed to add task');
            }
          }}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter task title' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          
          <Form.Item
            name="comment"
            label="Comment"
          >
            <Input.TextArea placeholder="Enter task comment" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="false"
          >
            <Select>
              <Select.Option value="false">Pending</Select.Option>
              <Select.Option value="true">Completed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="flex justify-end gap-2">
            <Button onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button className='ml-2' type="primary" htmlType="submit">
              {editTask ? 'Update' : 'Add'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={deleteConfirmVisible}
        onOk={async () => {
          await deleteTask(taskToDelete);
          setDeleteConfirmVisible(false);
        }}
        onCancel={() => setDeleteConfirmVisible(false)}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to delete this task?</p>
      </Modal>
    </div>
  );
}

export default App;
