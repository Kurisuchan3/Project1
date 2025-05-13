import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Table, Tag, Tooltip, Button } from "antd";
import { EditOutlined, StopOutlined, PlusOutlined } from "@ant-design/icons";
import TopNav from "../../topnav";
import AdminSideMenu from "../../admin-sidemenu";
import "../../../../sass/components/_usertable.scss"; // ✅ your updated SCSS

const { Content } = Layout;

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [archivedUsers, setArchivedUsers] = useState([]);
  const [viewArchived, setViewArchived] = useState(false);

  const rawToken = localStorage.getItem("authToken");
  const authToken = rawToken?.startsWith("Bearer ")
    ? rawToken
    : `Bearer ${rawToken}`;

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
      const resp = await axios.get("/api/users", axiosConfig);
      if (resp.data.success) setUsers(resp.data.data);
    } catch (e) {
      console.error("Error fetching users:", e);
    }
  };

  const fetchArchivedUsers = async () => {
    try {
      const resp = await axios.get("/api/users/archived", axiosConfig);
      if (resp.data.success) setArchivedUsers(resp.data.data);
    } catch (e) {
      console.error("Error fetching archived users:", e);
    }
  };

  const toggleView = () => setViewArchived((v) => !v);

  const handleEdit = (user) => {
    alert(`Editing user: ${user.username}`);
  };

  const handleArchiveRestore = async (user) => {
    const action = user.deleted_at ? "restore" : "archive";
    if (!window.confirm(`Are you sure you want to ${action} ${user.username}?`))
      return;
    try {
      await axios.put(`/api/users/${user.user_id}/${action}`, {}, axiosConfig);
      fetchUsers();
      fetchArchivedUsers();
    } catch (e) {
      console.error(`Error trying to ${action}:`, e);
    }
  };

  const columns = [
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <div style={{ display: "flex", gap: 12 }}>
          <Tooltip title="Edit">
            <EditOutlined
              style={{ fontSize: 18, color: "#24067e", cursor: "pointer" }}
              onClick={() => handleEdit(user)}
            />
          </Tooltip>
          <Tooltip title={user.deleted_at ? "Restore" : "Archive"}>
            <StopOutlined
              style={{
                fontSize: 18,
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
      render: (r) => r || "N/A",
    },
    {
      title: "Status",
      dataIndex: "deleted_at",
      key: "status",
      render: (del) =>
        del ? (
          <Tag color="red">ARCHIVED</Tag>
        ) : (
          <Tag color="green">ACTIVE</Tag>
        ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <TopNav />
      <Layout style={{ display: "flex" }}>
        <AdminSideMenu />
        <Layout style={{ padding: 20, width: "100%" }}>
          <Content
            style={{ background: "#f5f5f5", padding: 20, borderRadius: 8 }}
          >
            <div className="user-table-container">
              <div className="button-container">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => alert("Add User")}
                >
                  Add User
                </Button>
                <Button onClick={toggleView}>
                  {viewArchived ? "View Active" : "View Archived"}
                </Button>
              </div>
              <Table
                dataSource={viewArchived ? archivedUsers : users}
                columns={columns}
                rowKey="user_id"
                pagination={{ pageSize: 10 }}
                bordered
                scroll={{ x: true }}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default UserTable;
