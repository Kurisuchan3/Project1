import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Modal, Form, Input, InputNumber, message, Space } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import TopNav from "../topnav"; // Importing Top Navigation
import AdminSideMenu from "../admin-sidemenu"; // Importing Sidebar

const { Content } = Layout;

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // Track add mode
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Read token from localStorage and set the axios header if it exists.
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
      setProducts(
        response.data.map((item) => ({
          ...item,
          key: item.id,
          cost: item.cost,
          last_restock_date: item.last_restock_date
            ? new Date(item.last_restock_date).toLocaleDateString()
            : new Date().toLocaleDateString(), // Default to today's date if empty
        }))
      );
    } catch (error) {
      message.error("Error fetching inventory data");
      console.error("Fetch error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      message.success("Item deleted successfully");
      fetchInventory();
    } catch (error) {
      message.error("Error deleting item");
      console.error("Delete error:", error);
    }
  };

  const showEditModal = (record) => {
    setIsAdding(false); // Not in add mode
    setEditingProduct(record);
    form.setFieldsValue({
      itemname: record.itemname,
      stock_quantity: record.stock_quantity,
      cost: parseFloat(record.cost),
      warehouse_location: record.warehouse_location,
    });
    setIsModalVisible(true);
  };

  const showAddModal = () => {
    setIsAdding(true); // Enable add mode
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (isAdding) {
        // Add new item with current date as "Last Restock"
        const newItem = {
          ...values,
          last_restock_date: new Date().toISOString().split("T")[0], // Format YYYY-MM-DD
        };

        await axios.post("/api/inventory", newItem);
        message.success("Item added successfully");
      } else {
        // Edit existing item
        await axios.put(`/api/inventory/${editingProduct.id}`, values);
        message.success("Item updated successfully");
      }
      setIsModalVisible(false);
      fetchInventory();
    } catch (error) {
      message.error("Error saving item");
      console.error("Save error:", error);
    }
  };

  const columns = [
    { title: "Item Name", dataIndex: "itemname", key: "itemname" },
    { title: "Stock Quantity", dataIndex: "stock_quantity", key: "stock_quantity" },
    { title: "Cost", dataIndex: "cost", key: "cost" },
    { title: "Warehouse", dataIndex: "warehouse_location", key: "warehouse_location" },
    { title: "Last Restock", dataIndex: "last_restock_date", key: "last_restock_date" }, // Now properly filled
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Top Navigation */}
      <TopNav />

      <Layout style={{ display: "flex", flexDirection: "row" }}>
        {/* Sidebar Navigation */}
        <AdminSideMenu />

        {/* Content Area */}
        <Layout style={{ padding: "20px", width: "100%" }}>
          <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Inventory List</h2>
              <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                Add Item
              </Button>
            </div>

            <Table columns={columns} dataSource={products} bordered pagination={{ pageSize: 5 }} />

            <Modal
              title={isAdding ? "Add Inventory Item" : "Edit Inventory Item"}
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onOk={() => form.submit()}
            >
              <Form form={form} onFinish={handleSubmit}>
                <Form.Item
                  label="Item Name"
                  name="itemname"
                  rules={[{ required: true, message: "Please input the item name!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Stock Quantity"
                  name="stock_quantity"
                  rules={[{ required: true, message: "Please input the stock quantity!" }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
                <Form.Item
                  label="Cost"
                  name="cost"
                  rules={[{ required: true, message: "Please input the cost!" }]}
                >
                  <InputNumber min={0} step={100} />
                </Form.Item>
                <Form.Item
                  label="Warehouse"
                  name="warehouse_location"
                  rules={[{ required: true, message: "Please input the warehouse location!" }]}
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Inventory;