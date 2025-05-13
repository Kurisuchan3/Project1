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

import "../../../sass/components/_topnav.scss";
import "../../../sass/components/_adminproducts.scss";

const { Sider, Content } = Layout;
const { Option } = Select;

const NAV_HEIGHT = 76;
const SIDEBAR_WIDTH = 200;

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isArchiveModalVisible, setIsArchiveModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // attach auth header
  const rawToken = localStorage.getItem("authToken");
  const authToken = rawToken?.startsWith("Bearer ")
    ? rawToken
    : `Bearer ${rawToken}`;
  if (authToken) axios.defaults.headers.common["Authorization"] = authToken;

  useEffect(() => {
    fetchProducts();
    fetchStatuses();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data);
    } catch {
      message.error("Error fetching products");
    }
  };

  const fetchStatuses = async () => {
    try {
      const { data } = await axios.get("/api/statuses");
      setStatuses(data.data || []);
    } catch {
      message.error("Error fetching statuses");
    }
  };

  const fetchSubcategories = async () => {
    try {
      const { data } = await axios.get("/api/subcategories");
      setSubcategories(data);
    } catch {
      message.error("Error fetching subcategories");
    }
  };

  const fetchArchivedProducts = async () => {
    try {
      const { data } = await axios.get("/api/products/archived");
      setArchivedProducts(data);
    } catch {
      message.error("Error fetching archived products");
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
    const fd = new FormData();
    if (values.image?.length) fd.append("image", values.image[0].originFileObj);
    fd.append("name", values.name);
    fd.append("price", values.price);
    fd.append("quantity", values.quantity);
    fd.append("description", values.description || "");
    fd.append("specifications", values.specifications || "");
    fd.append("status_id", values.status_id || "");
    fd.append("subcategory_id", values.subcategory_id || "");

    try {
      if (isAdding) {
        await axios.post("/api/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product added");
      } else {
        fd.append("_method", "PUT");
        await axios.post(`/api/products/${editingProduct.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product updated");
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch {
      message.error("Error saving product");
    }
  };

  const handleArchive = async (record) => {
    try {
      await axios.delete(`/api/products/${record.id}`);
      message.success("Product archived");
      fetchProducts();
    } catch {
      message.error("Error archiving");
    }
  };

  const handleRestore = async (record) => {
    try {
      await axios.put(`/api/products/${record.id}/restore`);
      message.success("Product restored");
      fetchArchivedProducts();
      fetchProducts();
    } catch {
      message.error("Error restoring");
    }
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (img) =>
        img ? (
          <img src={window.location.origin + img} alt="" style={{ width: 50 }} />
        ) : (
          "No Image"
        ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Brand",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (s) => s?.name || "N/A",
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Specifications",
      dataIndex: "specifications",
      key: "specifications",
    },
    {
      title: "Status",
      dataIndex: "status_id",
      key: "status_id",
      render: (id) => statuses.find((s) => s.id === id)?.status_name || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showEditModal(r)} />
          <Button danger onClick={() => handleArchive(r)}>
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
      render: (img) =>
        img ? (
          <img src={window.location.origin + img} alt="" style={{ width: 50 }} />
        ) : (
          "No Image"
        ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Brand",
      dataIndex: "subcategory",
      key: "subcategory",
      render: (s) => s?.name || "N/A",
    },
    { title: "Price", dataIndex: "price", key: "price" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Button
          type="primary"
          onClick={() => handleRestore(r)}
          style={{ backgroundColor: "#24067e", borderColor: "#24067e" }}
        >
          Restore
        </Button>
      ),
    },
  ];

  return (
    <div className="products-page">
      <TopNav />

      <Layout style={{ minHeight: "100vh", marginTop: NAV_HEIGHT }}>
        <Sider width={SIDEBAR_WIDTH}>
          <AdminSideMenu />
        </Sider>

        <Layout
          style={{
            marginLeft: SIDEBAR_WIDTH,
            width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
          }}
        >
          <Content
            style={{
              margin: "24px 0",
              padding: 24,
              background: "#fff",
              minHeight: 280,
            }}
          >
            <div className="products-header">
              <h2>Product List</h2>
              <div>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={showAddModal}
                  style={{ backgroundColor: "#24067e", borderColor: "#24067e" }}
                >
                  Add Product
                </Button>
                <Button
                  className="archive-btn"
                  onClick={() => {
                    setIsArchiveModalVisible(true);
                    fetchArchivedProducts();
                  }}
                >
                  Show Archived
                </Button>
              </div>
            </div>

            <Table
              columns={columns}
              dataSource={products}
              bordered
              pagination={{ pageSize: 5 }}
            />

            <Modal
              title={isAdding ? "Add Product" : "Edit Product"}
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              onOk={() => form.submit()}
            >
              <Form form={form} onFinish={handleSubmit} layout="vertical">
                {/* …your form items here… */}
              </Form>
            </Modal>

            <Modal
              title="Archived Products"
              open={isArchiveModalVisible}
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
    </div>
  );
}
