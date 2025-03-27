import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Modal, Form, Input, InputNumber, message, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import TopNav from "../topnav";
import AdminSideMenu from "../admin-sidemenu";

const { Content } = Layout;

const Inventory = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [archivedInventory, setArchivedInventory] = useState([]);
  const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState(null);
  const [editForm] = Form.useForm();

  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    axios.defaults.headers.common["Authorization"] = authToken;
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("/api/inventory");
      setInventoryItems(
        response.data.map((item) => ({
          key: item.id,
          product_id: item.product?.id,
          image: item.product?.image,
          product_name: item.product?.name,
          price: item.product?.price,
          stock_quantity: item.stock_quantity,
          stock_status: item.stock_status ? item.stock_status : (item.stock_quantity === 0 ? "Out of Stock" : "In Stock"),
          last_restock: item.last_restock
            ? new Date(item.last_restock).toLocaleDateString()
            : new Date().toLocaleDateString(),
        }))
      );
    } catch (error) {
      message.error("Error fetching inventory data");
      console.error("Fetch error:", error);
    }
  };

  const fetchArchivedInventory = async () => {
    try {
      const response = await axios.get("/api/inventory/archived");
      setArchivedInventory(
        response.data.map((item) => ({
          key: item.id,
          image: item.product?.image,
          product_name: item.product?.name,
          price: item.product?.price,
          stock_quantity: item.stock_quantity,
          stock_status: item.stock_status ? item.stock_status : (item.stock_quantity === 0 ? "Out of Stock" : "In Stock"),
          last_restock: item.last_restock
            ? new Date(item.last_restock).toLocaleDateString()
            : new Date().toLocaleDateString(),
        }))
      );
    } catch (error) {
      message.error("Error fetching archived inventory");
      console.error("Fetch error:", error);
    }
  };

  const handleArchive = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      message.success("Inventory item archived successfully");
      fetchInventory();
    } catch (error) {
      message.error("Error archiving inventory item");
      console.error("Archive error:", error);
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.put(`/api/inventory/${id}/restore`);
      message.success("Inventory item restored successfully");
      fetchArchivedInventory();
      fetchInventory();
    } catch (error) {
      message.error("Error restoring inventory item");
      console.error("Restore error:", error);
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
    } catch (error) {
      message.error("Error updating inventory item");
      console.error("Edit update error:", error);
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) =>
        image ? (
          <img
            src={window.location.origin + image}
            alt="product"
            style={{ width: 50, height: "auto" }}
          />
        ) : (
          "No Image"
        ),
    },
    { title: "Product Name", dataIndex: "product_name", key: "product_name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Stock Quantity", dataIndex: "stock_quantity", key: "stock_quantity" },
    { title: "Stock Status", dataIndex: "stock_status", key: "stock_status" },
    { title: "Last Restock", dataIndex: "last_restock", key: "last_restock" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleArchive(record.key)}>
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
      render: (image) =>
        image ? (
          <img
            src={window.location.origin + image}
            alt="product"
            style={{ width: 50, height: "auto" }}
          />
        ) : (
          "No Image"
        ),
    },
    { title: "Product Name", dataIndex: "product_name", key: "product_name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Stock Quantity", dataIndex: "stock_quantity", key: "stock_quantity" },
    { title: "Stock Status", dataIndex: "stock_status", key: "stock_status" },
    { title: "Last Restock", dataIndex: "last_restock", key: "last_restock" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleRestore(record.key)}>
            Restore
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <TopNav />
      <Layout style={{ display: "flex", flexDirection: "row" }}>
        <AdminSideMenu />
        <Layout style={{ padding: "20px", width: "100%" }}>
          <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2>Inventory List</h2>
              <Button
                type="primary"
                onClick={() => {
                  setIsArchiveModalVisible(true);
                  fetchArchivedInventory();
                }}
              >
                Show Archived
              </Button>
            </div>
            <Table columns={columns} dataSource={inventoryItems} bordered pagination={{ pageSize: 5 }} />

            <Modal
              title="Edit Inventory Item"
              visible={isEditModalVisible}
              onCancel={() => setIsEditModalVisible(false)}
              onOk={() => editForm.submit()}
            >
              <Form form={editForm} onFinish={handleEditSubmit} layout="vertical">
                <Form.Item
                  label="Product Name"
                  name="product_name"
                  rules={[{ required: true, message: "Please input the product name!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: "Please input the price!" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  label="Stock Quantity"
                  name="stock_quantity"
                  rules={[{ required: true, message: "Please input the stock quantity!" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
              </Form>
            </Modal>

            <Modal
              title="Archived Inventory"
              visible={isArchiveModalVisible}
              onCancel={() => setIsArchiveModalVisible(false)}
              footer={null}
            >
              <Table columns={archiveColumns} dataSource={archivedInventory} bordered pagination={{ pageSize: 5 }} />
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Inventory;
