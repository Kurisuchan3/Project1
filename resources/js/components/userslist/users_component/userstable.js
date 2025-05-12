import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Table, Tag, Tooltip, Button } from "antd";
import { EditOutlined, StopOutlined, PlusOutlined } from "@ant-design/icons";
import TopNav from "../../topnav";
import AdminSideMenu from "../../admin-sidemenu";
import "../../../../sass/components/_usertable.scss"; // ✅ Import SCSS styles

const { Content } = Layout;

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [viewArchived, setViewArchived] = useState(false);

  const rawToken = localStorage.getItem("authToken");
  const authToken = rawToken?.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken,
    },
  };

  useEffect(() => {
    fetchUsers();
    fetchArchivedUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users", axiosConfig);
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error("API returned unsuccessful response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error.response?.data || error.message);
    }
  };

  const fetchArchivedUsers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/users/archived", axiosConfig);
      if (response.data.success) {
        setArchivedUsers(response.data.data);
      } else {
        console.error("API returned unsuccessful response:", response.data);
      }
    } catch (error) {
      console.error("Error fetching archived users:", error.response?.data || error.message);
    }
  };

  const toggleView = () => {
    setViewArchived(!viewArchived);
  };

  const handleEdit = (user) => {
    alert(`Editing user: ${user.username}`);
  };

  const handleArchiveRestore = async (user) => {
    const action = user.deleted_at ? "restore" : "archive";
    const confirmAction = window.confirm(`Are you sure you want to ${action} ${user.username}?`);

    if (!confirmAction) return;

    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${user.user_id}/${action}`, {}, axiosConfig);
      fetchUsers();
      fetchArchivedUsers();
    } catch (error) {
      console.error(`Error trying to ${action} user:`, error.response?.data || error.message);
    }
  };

  const columns = [
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Tooltip title="Edit">
            <EditOutlined
              style={{ fontSize: "18px", color: "#1890ff", cursor: "pointer" }}
              onClick={() => handleEdit(user)}
            />
          </Tooltip>
          <Tooltip title={user.deleted_at ? "Restore" : "Archive"}>
            <StopOutlined
              style={{
                fontSize: "18px",
                color: user.deleted_at ? "#52c41a" : "#ff4d4f",
                cursor: "pointer",
              }}
              onClick={() => handleArchiveRestore(user)}
            />
          </Tooltip>
        </div>
      ),
    },
    { title: "User Name", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
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
    <Layout style={{ minHeight: "100vh" }}>
      <TopNav />
      <Layout style={{ display: "flex", flexDirection: "row" }}>
        <AdminSideMenu />
        <Layout style={{ padding: "20px", width: "100%" }}>
          <Content style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
            <div className="user-table-container">
              <div className="button-container">
                <Button type="primary" icon={<PlusOutlined />}>
                  Add User
                </Button>
                <Button type="default" onClick={toggleView}>
                  {viewArchived ? "View Active" : "View Archived"}
                </Button>
              </div>

              <Table
                dataSource={viewArchived ? archivedUsers : users}
                columns={columns}
                rowKey="user_id"
                pagination={{ pageSize: 10 }}
                bordered
                scroll={{ x: true }} // ✅ Ant Design native responsive scroll
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default UserTable;
