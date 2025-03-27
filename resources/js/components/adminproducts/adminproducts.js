import React, { useState, useEffect } from "react";
import {
  Layout,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Space,
  Upload
} from "antd";
import { EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import TopNav from "../topnav";
import AdminSideMenu from "../admin-sidemenu";

const { Content } = Layout;
const { Option } = Select;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Set Authorization token if available
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

  const fetchArchivedProducts = async () => {
    try {
      const response = await axios.get("/api/products/archived");
      setArchivedProducts(response.data);
    } catch (error) {
      message.error("Error fetching archived products");
      console.error("Fetch error:", error);
    }
  };

  const showEditModal = (record) => {
    setIsAdding(false);
    setEditingProduct(record);
    form.setFieldsValue({
      image: [],
      name: record.name,
      price: record.price,
      // Set the quantity from the record (if available)
      quantity: record.quantity,
      description: record.description,
      specifications: record.specifications,
      status_id: record.status_id
    });
    setIsModalVisible(true);
  };

  const showAddModal = () => {
    setIsAdding(true);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    if (values.image && values.image.length > 0) {
      formData.append("image", values.image[0].originFileObj);
    }
    formData.append("name", values.name);
    formData.append("price", values.price);
    // Append quantity as well
    formData.append("quantity", values.quantity);
    formData.append("description", values.description || "");
    formData.append("specifications", values.specifications || "");
    formData.append("status_id", values.status_id || "");

    try {
      if (isAdding) {
        await axios.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        message.success("Product added successfully");
      } else {
        formData.append("_method", "PUT");
        await axios.post(`/api/products/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        message.success("Product updated successfully");
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error("Error saving product");
      console.error("Save error:", error);
    }
  };

  const handleArchive = async (record) => {
    try {
      await axios.delete(`/api/products/${record.id}`);
      message.success("Product archived successfully");
      fetchProducts();
    } catch (error) {
      message.error("Error archiving product");
      console.error("Archive error:", error);
    }
  };

  const handleRestore = async (record) => {
    try {
      await axios.put(`/api/products/${record.id}/restore`);
      message.success("Product restored successfully");
      fetchArchivedProducts();
      fetchProducts();
    } catch (error) {
      message.error("Error restoring product");
      console.error("Restore error:", error);
    }
  };

  // Main table columns now include quantity
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
        )
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    // New Quantity column
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Specifications", dataIndex: "specifications", key: "specifications" },
    {
      title: "Status",
      dataIndex: "status_id",
      key: "status_id",
      render: (status) =>
        statuses.find((s) => s.id === status)?.status_name || "N/A"
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Button onClick={() => handleArchive(record)} danger>
            Archive
          </Button>
        </Space>
      )
    }
  ];

  // Archive view columns include quantity as well
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
        )
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Price", dataIndex: "price", key: "price" },
    // Include quantity in archived view
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleRestore(record)} type="primary">
            Restore
          </Button>
        </Space>
      )
    }
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <TopNav />
      <Layout style={{ display: "flex", flexDirection: "row" }}>
        <AdminSideMenu />
        <Layout style={{ padding: "20px", width: "100%" }}>
          <Content style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Product List</h2>
              <div>
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                  Add Product
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    setIsArchiveModalVisible(true);
                    fetchArchivedProducts();
                  }}
                >
                  Show Archived
                </Button>
              </div>
            </div>
            <Table columns={columns} dataSource={products} bordered pagination={{ pageSize: 5 }} />

            {/* Add/Edit Modal */}
            <Modal
              title={isAdding ? "Add Product" : "Edit Product"}
              visible={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onOk={() => form.submit()}
            >
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  label="Product Image"
                  name="image"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) return e;
                    return e && e.fileList;
                  }}
                >
                  <Upload beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>Select Image</Button>
                  </Upload>
                </Form.Item>
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
                  <InputNumber min={0} step={1} style={{ width: "100%" }} />
                </Form.Item>
                {/* New Quantity input */}
                <Form.Item
                  label="Quantity"
                  name="quantity"
                  rules={[{ required: true, message: "Please input the quantity!" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label="Specifications" name="specifications">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label="Status" name="status_id">
                  <Select placeholder="Select status">
                    {statuses.map((status) => (
                      <Option key={status.id} value={status.id}>
                        {status.status_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>
            </Modal>

            {/* Archived Products Modal */}
            <Modal
              title="Archived Products"
              visible={isArchiveModalVisible}
              onCancel={() => setIsArchiveModalVisible(false)}
              footer={null}
            >
              <Table
                columns={archiveColumns}
                dataSource={archivedProducts}
                bordered
                pagination={{ pageSize: 5 }}
              />
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProductPage;
