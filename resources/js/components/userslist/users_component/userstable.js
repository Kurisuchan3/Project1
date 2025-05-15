import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layout, Table, Tag, Tooltip, Button } from "antd";
import { EditOutlined, StopOutlined, PlusOutlined } from "@ant-design/icons";
import TopNav from "../../topnav";
import AdminSideMenu from "../../admin-sidemenu";
import "../../../../sass/components/_usertable.scss";

const { Header, Sider, Content } = Layout;

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
        <div className="action-buttons">
          <Tooltip title="Edit">
            <Button
              className="edit-btn"
              icon={<EditOutlined />}
              onClick={() => handleEdit(user)}
            />
          </Tooltip>
          <Tooltip title={user.deleted_at ? "Restore" : "Archive"}>
            <Button
              className={user.deleted_at ? "restore-btn" : "archive-btn"}
              icon={<StopOutlined />}
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
      <Header style={{ padding: 0, background: "#008cff", position: "fixed", width: "100%", zIndex: 1000 }}>
        <TopNav />
      </Header>
      <Layout style={{ marginTop: 64 }}>
        <Sider width={200}>
          <AdminSideMenu />
        </Sider>
        <Layout>
          <Content style={{ margin: "24px 16px", padding: 24, background: "#fff", minHeight: 280 }}>
            <div className="user-table-container">
              <div className="user-table-header">
                <h2 className="user-table-title">User List</h2>
                <div className="button-container">
                  <Button className="add-user-btn" type="primary" icon={<PlusOutlined />}>
                    Add User
                  </Button>
                  <Button className="toggle-view-btn" type="default" onClick={toggleView}>
                    {viewArchived ? "View Active" : "View Archived"}
                  </Button>
                </div>
              </div>

              <Table
                className="user-table"
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