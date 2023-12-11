import {
  SearchOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Popconfirm, Modal } from "antd";
import "./custom-button.css";

const AdminPortal = (props) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  //   const { allUsers } = props;
  const searchInput = useRef(null);
  console.log(allUsers);
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

  const showModal = (title, content) => {
    Modal.error({
      title,
      content,
    });
  };

  const handleDeleteUser = (userId) => {
    try {
      fetch(`/api/user/delete/${userId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
            setAllUsers((prevAllUsers) =>
              prevAllUsers.filter((user) => user._id !== userId)
            );
          } else {
            console.error(data.message);
            showModal("Failed to delete user", "Please try again later.");
          }
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.error(err);
      showModal("Failed to delete user", "Please try again later.");
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
      ...getColumnSearchProps("username"),
    },
    {
      title: "Fisrt Name",
      dataIndex: "firstname",
      key: "firstname",
      responsive: ["md"],
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
      ...getColumnSearchProps("description"),
      width: "30%",
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
      ...getColumnSearchProps("email"),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      responsive: ["md"],
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
      title: "Latest Update Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      responsive: ["xl"],
      ...getColumnSearchProps("updatedAt"),
      sorter: (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt),
      sortDirections: ["descend", "ascend"],
      render: (updatedAt) => {
        const formattedDate = new Date(updatedAt).toLocaleString();
        return formattedDate;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Popconfirm
          title="Delete the user"
          description="Are you sure you want to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger" icon={<DeleteOutlined />} size="small">
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return <Table columns={columns} dataSource={allUsers} />;
};
export default AdminPortal;
