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
  Upload,
} from "antd";
import { EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import TopNav from "../topnav";
import AdminSideMenu from "../admin-sidemenu";
import "../../../sass/components/_adminproducts.scss";

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  const rawToken = localStorage.getItem("authToken");
  const authToken = rawToken?.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;
  if (authToken) {
    axios.defaults.headers.common["Authorization"] = authToken;
  }

  useEffect(() => {
    fetchProducts();
    fetchStatuses();
    fetchSubcategories();
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
      setStatuses(response.data.data || []);
    } catch (error) {
      message.error("Error fetching statuses");
      console.error("Fetch error:", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get("/api/subcategories");
      setSubcategories(response.data);
    } catch (error) {
      message.error("Error fetching subcategories");
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
      quantity: record.quantity,
      description: record.description,
      specifications: record.specifications,
      status_id: record.status_id,
      subcategory_id: record.subcategory_id,
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
    formData.append("quantity", values.quantity);
    formData.append("description", values.description || "");
    formData.append("specifications", values.specifications || "");
    formData.append("status_id", values.status_id || "");
    formData.append("subcategory_id", values.subcategory_id || "");

    try {
      if (isAdding) {
        await axios.post("/api/products", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product added successfully");
      } else {
        formData.append("_method", "PUT");
        await axios.post(`/api/products/${editingProduct.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
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
            style={{ width: 60, height: "auto", objectFit: "contain" }}
          />
        ) : (
          "No Image"
        ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Brand",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (subcategory) => (subcategory ? subcategory.name : "N/A"),
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Specifications", dataIndex: "specifications", key: "specifications" },
    {
      title: "Status",
      dataIndex: "status_id",
      key: "status_id",
      render: (status) =>
        statuses.find((s) => s.id === status)?.status_name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button className="edit-btn" icon={<EditOutlined />} onClick={() => showEditModal(record)} />
          <Button className="archive-btn-action" onClick={() => handleArchive(record)} danger>
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
            style={{ width: 60, height: "auto", objectFit: "contain" }}
          />
        ) : (
          "No Image"
        ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Brand",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (subcategory) => (subcategory ? subcategory.name : "N/A"),
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button className="restore-btn" onClick={() => handleRestore(record)} type="primary">
            Restore
          </Button>
        </Space>
      ),
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
            <div className="products-header">
              <h2 className="products-title">Product List</h2>
              <div className="products-actions">
                <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
                  Add Product
                </Button>
                <Button className="archive-btn" onClick={() => { setIsArchiveModalVisible(true); fetchArchivedProducts(); }}>
                  Show Archived
                </Button>
              </div>
            </div>
            <Table className="products-table" columns={columns} dataSource={products} bordered pagination={{ pageSize: 5 }} />

            <Modal
              title={isAdding ? "Add Product" : "Edit Product"}
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onOk={() => form.submit()}
              className="products-modal"
            >
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                <Form.Item
                  label="Product Image"
                  name="image"
                  getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                >
                  <Upload beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>Select Image</Button>
                  </Upload>
                </Form.Item>
                <Form.Item label="Product Name" name="name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item label="Brand" name="subcategory_id" rules={[{ required: true }]}>
                  <Select placeholder="Select brand">
                    {subcategories.map((subcategory) => (
                      <Option key={subcategory.id} value={subcategory.id}>
                        {subcategory.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                  <InputNumber min={0} step={1} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Quantity" name="quantity" rules={[{ required: true }]}>
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

            <Modal
              title={<span className="archived-modal-title">Archived Products</span>}
              open={isArchiveModalVisible}
              onCancel={() => setIsArchiveModalVisible(false)}
              footer={null}
              className="archived-products-modal"
              width={800}
            >
              <div className="archived-products-content">
                <Table className="archived-products-table" columns={archiveColumns} dataSource={archivedProducts} bordered pagination={{ pageSize: 5 }} />
              </div>
            </Modal>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProductPage;