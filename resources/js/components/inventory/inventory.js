import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

import TopNav from "../topnav";
import AdminSideMenu from "../admin-sidemenu";

// ensure your nav styles are loaded
import "../../../sass/components/_topnav.scss";
// your inventory-header styles (including our overrides)
import "../../../sass/components/_inventory.scss";

const { Sider, Content } = Layout;
const NAV_HEIGHT = 76; // 44px input + 16px top padding +16px bottom padding

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [archivedInventory, setArchivedInventory] = useState([]);
  const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState(null);
  const [editForm] = Form.useForm();

  // apply Bearer prefix if needed
  const rawToken = localStorage.getItem("authToken");
  const authToken = rawToken?.startsWith("Bearer ")
    ? rawToken
    : `Bearer ${rawToken}`;
  if (authToken) {
    axios.defaults.headers.common["Authorization"] = authToken;
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const { data } = await axios.get("/api/inventory");
      setInventoryItems(
        data.map((item) => ({
          key: item.id,
          product_id: item.product?.id,
          image: item.product?.image,
          product_name: item.product?.name,
          price: item.product?.price,
          stock_quantity: item.stock_quantity,
          stock_status:
            item.stock_status ||
            (item.stock_quantity === 0 ? "Out of Stock" : "In Stock"),
          last_restock: item.last_restock
            ? new Date(item.last_restock).toLocaleDateString()
            : new Date().toLocaleDateString(),
        }))
      );
    } catch (err) {
      message.error("Error fetching inventory data");
      console.error(err);
    }
  };

  const fetchArchivedInventory = async () => {
    try {
      const { data } = await axios.get("/api/inventory/archived");
      setArchivedInventory(
        data.map((item) => ({
          key: item.id,
          image: item.product?.image,
          product_name: item.product?.name,
          price: item.product?.price,
          stock_quantity: item.stock_quantity,
          stock_status:
            item.stock_status ||
            (item.stock_quantity === 0 ? "Out of Stock" : "In Stock"),
          last_restock: item.last_restock
            ? new Date(item.last_restock).toLocaleDateString()
            : new Date().toLocaleDateString(),
        }))
      );
    } catch (err) {
      message.error("Error fetching archived inventory");
      console.error(err);
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      message.success("Inventory item archived successfully");
      fetchInventory();
    } catch (err) {
      message.error("Error archiving inventory item");
      console.error(err);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`/api/inventory/${id}/restore`);
      message.success("Inventory item restored successfully");
      fetchArchivedInventory();
      fetchInventory();
    } catch (err) {
      message.error("Error restoring inventory item");
      console.error(err);
    }
  };

  const showEditModal = (record) => {
    setEditingInventoryItem(record);
    editForm.setFieldsValue({
      product_name: record.product_name,
      price: record.price,
      stock_quantity: record.stock_quantity,
    });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(`/api/products/${editingInventoryItem.product_id}`, {
        name: values.product_name,
        price: values.price,
        quantity: values.stock_quantity,
      });
      message.success("Inventory item updated successfully");
      setIsEditModalVisible(false);
      fetchInventory();
    } catch (err) {
      message.error("Error updating inventory item");
      console.error(err);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src) =>
        src ? (
          <img
            src={window.location.origin + src}
            alt="product"
            style={{ width: 50 }}
          />
        ) : (
          "No Image"
        ),
    },
    { title: "Product Name", dataIndex: "product_name", key: "product_name" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
    },
    { title: "Stock Status", dataIndex: "stock_status", key: "stock_status" },
    { title: "Last Restock", dataIndex: "last_restock", key: "last_restock" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleArchive(record.key)}
          >
            Archive
          </Button>
        </Space>
      ),
    },
  ];

  const archiveColumns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src) =>
        src ? (
          <img
            src={window.location.origin + src}
            alt="product"
            style={{ width: 50 }}
          />
        ) : (
          "No Image"
        ),
    },
    { title: "Product Name", dataIndex: "product_name", key: "product_name" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Stock Quantity",
      dataIndex: "stock_quantity",
      key: "stock_quantity",
    },
    { title: "Stock Status", dataIndex: "stock_status", key: "stock_status" },
    { title: "Last Restock", dataIndex: "last_restock", key: "last_restock" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          type="primary"
          style={{ backgroundColor: "#24067e", borderColor: "#24067e" }}
          onClick={() => handleRestore(record.key)}
        >
          Restore
        </Button>
      ),
    },
  ];

  return (
    <div className="inventory-page">
      {/* fixed top nav */}
      <TopNav />

      {/* push layout down by NAV_HEIGHT */}
      <Layout style={{ minHeight: "100vh", marginTop: NAV_HEIGHT }}>
        <Sider width={200}>
          <AdminSideMenu />
        </Sider>
        <Layout>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: "#fff",
              minHeight: 280,
            }}
          >
            <div className="inventory-header">
              <h2>Inventory List</h2>
              <Button
                type="primary"
                style={{ backgroundColor: "#24067e", borderColor: "#24067e" }}
                onClick={() => {
                  setIsArchiveModalVisible(true);
                  fetchArchivedInventory();
                }}
              >
                Show Archived
              </Button>
            </div>

            <Table
              columns={columns}
              dataSource={inventoryItems}
              bordered
              pagination={{ pageSize: 5 }}
            />

            {/* Edit Modal */}
            <Modal
              title="Edit Inventory Item"
              open={isEditModalVisible}
              onCancel={() => setIsEditModalVisible(false)}
              onOk={() => editForm.submit()}
            >
              <Form form={editForm} onFinish={handleEditSubmit} layout="vertical">
                <Form.Item
                  label="Product Name"
                  name="product_name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  label="Stock Quantity"
                  name="stock_quantity"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Form>
            </Modal>

            {/* Archived Inventory Modal */}
            <Modal
              title="Archived Inventory"
              open={isArchiveModalVisible}
              onCancel={() => setIsArchiveModalVisible(false)}
              footer={null}
            >
              <Table
                columns={archiveColumns}
                dataSource={archivedInventory}
                bordered
                pagination={{ pageSize: 5 }}
              />
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
