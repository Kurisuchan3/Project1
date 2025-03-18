import React, { useState, useEffect } from "react";
import { Layout, Table, Button, Modal, Form, Input, InputNumber, Select, message, Space } from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import TopNav from "../topnav"; // Importing Top Navigation
import AdminSideMenu from "../admin-sidemenu"; // Importing Sidebar

const { Content } = Layout;
const { Option } = Select;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Read token from localStorage and set the axios header if it exists.
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    axios.defaults.headers.common["Authorization"] = authToken;
  }

  useEffect(() => {
    fetchProducts();
    fetchStatuses();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data);
    } catch (error) {
      message.error("Error fetching products");
      console.error("Fetch error:", error);
    }
  };

  const fetchStatuses = async () => {
    try {
      const response = await axios.get("/api/statuses");
      setStatuses(response.data);
    } catch (error) {
      message.error("Error fetching statuses");
      console.error("Fetch error:", error);
    }
  };

  const showEditModal = (record) => {
    setIsAdding(false);
    setEditingProduct(record);
    form.setFieldsValue({
      name: record.name,
      price: record.price,
      description: record.description,
      specifications: record.specifications,
      statuses_id: record.statuses_id,
    });
    setIsModalVisible(true);
  };

  const showAddModal = () => {
    setIsAdding(true);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (isAdding) {
        await axios.post("/api/products", values);
        message.success("Product added successfully");
      } else {
        await axios.put(`/api/products/${editingProduct.id}`, values);
        message.success("Product updated successfully");
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error("Error saving product");
      console.error("Save error:", error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Specifications", dataIndex: "specifications", key: "specifications" },
    {
      title: "Status",
      dataIndex: "statuses_id",
      key: "statuses_id",
      render: (status) => statuses.find((s) => s.id === status)?.name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
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
              <h2 className="text-xl font-bold">Product List</h2>
              <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                Add Product
              </Button>
            </div>

            <Table columns={columns} dataSource={products} bordered pagination={{ pageSize: 5 }} />

            <Modal
              title={isAdding ? "Add Product" : "Edit Product"}
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onOk={() => form.submit()}
            >
              <Form form={form} onFinish={handleSubmit}>
                <Form.Item
                  label="Product Name"
                  name="name"
                  rules={[{ required: true, message: "Please input the product name!" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Price"
                  name="price"
                  rules={[{ required: true, message: "Please input the price!" }]}
                >
                  <InputNumber min={0} step={1} />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label="Specifications" name="specifications">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  label="Status"
                  name="statuses_id"
                  rules={[{ required: false, message: "Please select a status!" }]}
                >
                  <Select>
                    {statuses.map((status) => (
                      <Option key={status.id} value={status.id}>
                        {status.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProductPage;
