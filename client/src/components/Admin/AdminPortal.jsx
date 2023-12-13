import {
  SearchOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Highlighter from "react-highlight-words";
import {
  Button,
  Input,
  Space,
  Table,
  Popconfirm,
  Modal,
  Form,
  InputNumber,
  Typography,
} from "antd";
import {
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import "./custom-button.css";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AdminPortal = (props) => {
  const { onUserDeleted } = props;
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record._id === editingKey;
  const dispatch = useDispatch();

  const edit = (record) => {
    form.setFieldsValue({
      role: "",
      avatar: "",
      username: "",
      firstname: "",
      lastname: "",
      description: "",
      email: "",
      location: "",
      createdAt: "",
      ...record,
    });
    setEditingKey(record._id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      row._id = key;
      const newData = [...allUsers];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        const updateItemData = {
          ...item,
          ...row,
        };

        newData.splice(index, 1, updateItemData);

        handleUpdateUser(row, newData);
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  useEffect(() => {
    setAllUsers(props.allUsers);
  }, [props.allUsers]);

  useEffect(() => {}, [allUsers]);

  const showModal = (title, content) => {
    Modal.error({
      title,
      content,
    });
  };
  const handleDeleteUser = async (userId) => {
    try {
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        console.log(data);
        setAllUsers((prevAllUsers) =>
          prevAllUsers.filter((user) => user._id !== userId)
        );
        await onUserDeleted();
      } else {
        console.error(data.message);
        showModal("Failed to delete user", "Please try again later.");
      }
    } catch (err) {
      console.error(err);
      showModal("Failed to delete user", "Please try again later.");
    }
  };

  const handleUpdateUser = async (updateItemData, newData) => {
    try {
      fetch(`/api/user/update/${updateItemData._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateItemData),
      })
        .then(async (res) => {
          if (res.status === 200) {
            setAllUsers(newData);
            setEditingKey("");
            const data = await res.json();
            if (currentUser._id === updateItemData._id) {
              dispatch(updateUserSuccess(data));
            }
            return data;
          } else {
            console.log("failed");
            showModal("Failed to update user", "Please try again later.");
            setEditingKey("");
            return res.json();
          }
        })
        .then((data) => {
          console.log(data);
        });
    } catch (error) {
      showModal("Failed to update user", "Please try again later.");
      setEditingKey("");
      console.log(error);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      const dataIndexValue = record[dataIndex];
      if (dataIndexValue !== null && dataIndexValue !== undefined) {
        return dataIndexValue
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
      return false;
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Role",
      dataIndex: "type",
      key: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => {
        return (
          <img
            src={avatar || "/default-avatar.png"}
            alt="Creator's Avatar"
            className="rounded-full"
            style={{ width: "3em", height: "3em", objectFit: "cover" }}
          />
        );
      },
      responsive: ["lg"],
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      editable: true,
      ...getColumnSearchProps("username"),
    },
    {
      title: "Fisrt Name",
      dataIndex: "firstname",
      key: "firstname",
      responsive: ["md"],
      editable: true,
      ...getColumnSearchProps("firstname"),
      render: (firstname) => {
        return firstname || "N/A";
      },
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
      responsive: ["md"],
      editable: true,
      ...getColumnSearchProps("lastname"),
      render: (lastname) => {
        return lastname || "N/A";
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      responsive: ["xl"],
      editable: true,
      ...getColumnSearchProps("description"),
      width: "20%",
      render: (description) => {
        const defaultText = description ? description.slice(0, 100) : "N/A";
        const shouldExpand = description && description.length > 100;
        const expandedText = shouldExpand ? description.slice(100) : "";

        return (
          <div>
            <div>
              {defaultText}
              {expandedText && (
                <span>
                  {isExpanded ? <span>{expandedText}</span> : " ......"}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsExpanded(!isExpanded);
                    }}
                  >
                    {
                      <Button
                        type="link"
                        icon={
                          isExpanded ? (
                            <CaretUpOutlined />
                          ) : (
                            <CaretDownOutlined />
                          )
                        }
                      >
                        {isExpanded ? "Show less" : "Expand"}
                      </Button>
                    }
                  </a>
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
      editable: true,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      responsive: ["lg"],
      editable: true,
      ...getColumnSearchProps("location"),
      render: (location) => {
        return location || "N/A";
      },
    },
    {
      title: "Registration Date",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["xl"],
      ...getColumnSearchProps("createdAt"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      sortDirections: ["descend", "ascend"],
      render: (createdAt) => {
        const formattedDate = new Date(createdAt).toLocaleString();
        return formattedDate;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => {
        const editable = isEditing(record);

        if (editable) {
          return (
            <div className="flex flex-col place-content-start">
              <div style={{ paddingLeft: "7px" }}>
                <Typography.Link
                  onClick={() => save(record._id)}
                  style={{
                    marginRight: 8,
                  }}
                >
                  <EditOutlined /> Save
                </Typography.Link>
                <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                  <a>Cancel</a>
                </Popconfirm>
              </div>
              <div>
                <Popconfirm
                  title="Delete the user"
                  description="Are you sure you want to delete this user?"
                  onConfirm={() => handleDeleteUser(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<DeleteOutlined />} size="small">
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </div>
          );
        } else {
          return (
            <div className="flex flex-col place-content-start">
              <div style={{ paddingLeft: "7px" }}>
                <Typography.Link
                  disabled={editingKey !== ""}
                  onClick={() => edit(record)}
                >
                  <EditOutlined /> Edit
                </Typography.Link>
              </div>
              <div>
                <Popconfirm
                  title="Delete the user"
                  description="Are you sure you want to delete this user?"
                  onConfirm={() => handleDeleteUser(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<DeleteOutlined />} size="small">
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </div>
          );
        }
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        columns={mergedColumns}
        dataSource={allUsers}
        rowClassName="editable-row"
        rowKey="_id"
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      />
    </Form>
  );
};
export default AdminPortal;
