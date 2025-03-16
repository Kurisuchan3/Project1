import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tag, Tooltip, Checkbox, Button } from "antd";
import { EditOutlined, StopOutlined, UndoOutlined, PlusOutlined } from "@ant-design/icons";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // Track selected users
  const [viewArchived, setViewArchived] = useState(false); // Toggle state for Active/Archived users

  const authToken = localStorage.getItem("token") || null;

  useEffect(() => {
    fetchUsers();
    fetchArchivedUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            alert("Authentication token is missing. Please log in again.");
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authToken // Ensure token is passed
            }
        };

        const response = await axios.get("http://127.0.0.1:8000/api/users", config);

        if (response.data.success) {
            setUsers(response.data.data);
        } else {
            console.error("API returned unsuccessful response:", response.data);
        }
    } catch (error) {
        console.error("Error fetching users:", error.response ? error.response.data : error.message);
    }
  };


  const fetchArchivedUsers = async () => {
    try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
            alert("Authentication token is missing. Please log in again.");
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authToken
            }
        };

        const response = await axios.get("http://127.0.0.1:8000/api/users/archived", config);

        if (response.data.success) {
            setArchivedUsers(response.data.data);
        } else {
            console.error("API returned unsuccessful response:", response.data);
        }
    } catch (error) {
        console.error("Error fetching archived users:", error.response ? error.response.data : error.message);
    }
  };

  const handleAddUser = () => {
    alert("Opening Add User Form...");
  };

  const toggleView = () => {
    setViewArchived(!viewArchived);
  };

  const handleEdit = (user) => {
    alert(`Editing user: ${user.username}`);
  };

  const handleArchiveRestore = async (user) => {
    const action = user.deleted_at ? "restore" : "archive";
    const confirmAction = window.confirm(
        `Are you sure you want to ${action} ${user.username}?`
    );

    if (!confirmAction) return;

    try {
        const authToken = localStorage.getItem("authToken"); // Ensure correct token retrieval
        if (!authToken) {
            alert("Authentication token is missing. Please log in again.");
            return;
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": authToken // Ensure token is passed
            }
        };

        await axios.put(`http://127.0.0.1:8000/api/users/${user.user_id}/${action}`, {}, config);

        fetchUsers();
        fetchArchivedUsers();
    } catch (error) {
        console.error(`Error trying to ${action} user:`, error.response ? error.response.data : error.message);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedRowKeys.length === 0) {
      alert("Please select at least one user to archive.");
      return;
    }

    const confirmBulkArchive = window.confirm(
      `Are you sure you want to archive ${selectedRowKeys.length} selected users?`
    );

    if (!confirmBulkArchive) return;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (authToken) {
        config.headers["Authorization"] = `Bearer ${authToken}`;
      }

      await axios.put("http://127.0.0.1:8000/api/users/bulk-archive", {
        user_ids: selectedRowKeys,
      }, config);

      fetchUsers();
      fetchArchivedUsers();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Error bulk archiving users:", error.response ? error.response.data : error.message);
    }
  };

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const isAllSelected = selectedRowKeys.length === users.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRowKeys(users.map((user) => user.user_id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  const filteredUsers = viewArchived ? archivedUsers : users;

  const columns = [
    {
      title: (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Checkbox
            onChange={handleSelectAll}
            checked={isAllSelected}
            indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < users.length}
          />
          Actions
        </div>
      ),
      key: "actions",
      render: (_, user) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Checkbox
            checked={selectedRowKeys.includes(user.user_id)}
            onChange={() => {
              const newSelectedRowKeys = selectedRowKeys.includes(user.user_id)
                ? selectedRowKeys.filter((id) => id !== user.user_id)
                : [...selectedRowKeys, user.user_id];

              setSelectedRowKeys(newSelectedRowKeys);
            }}
          />
          <Tooltip title="Edit">
            <EditOutlined
              style={{ fontSize: "18px", color: "#1890ff", cursor: "pointer" }}
              onClick={() => handleEdit(user)}
            />
          </Tooltip>
          <Tooltip title="Archive">
            <StopOutlined
              style={{ fontSize: "18px", color: "#ff4d4f", cursor: "pointer" }}
              onClick={() => handleArchiveRestore(user)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: ["role", "role_name"],
      key: "role",
      render: (role_name) => role_name || "N/A",
    },
    {
      title: "Status",
      dataIndex: "deleted_at",
      key: "status",
      render: (deleted_at) =>
        deleted_at ? <Tag color="red">ARCHIVED</Tag> : <Tag color="green">ACTIVE</Tag>,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
            Add User
          </Button>
          <Button
            type="default"
            style={{ marginLeft: "10px" }}
            onClick={toggleView}
          >
            {viewArchived ? "View Active" : "View Archived"}
          </Button>
          {!viewArchived && (
            <Button
              type="danger"
              style={{ marginLeft: "10px" }}
              onClick={handleBulkArchive}
              disabled={selectedRowKeys.length === 0}
            >
              Bulk Archive
            </Button>
          )}
        </div>
      </div>
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="user_id"
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default UserTable;
