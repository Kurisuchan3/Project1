import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, InputNumber, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Fetch data from Laravel API
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("/api/inventory");
      setProducts(response.data.map(item => ({
        ...item,
        key: item.id,
        cost: item.cost, // Keep cost as a number, not formatted
        last_restock_date: item.last_restock_date 
          ? new Date(item.last_restock_date).toLocaleDateString() 
          : "N/A"
      })));
    } catch (error) {
      message.error("Error fetching inventory data");
    }
  };

  

  // Delete Function
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/inventory/${id}`);
      message.success("Item deleted successfully");
      fetchInventory();
    } catch (error) {
      message.error("Error deleting item");
    }
  };

  // Edit Functions
  const showEditModal = (record) => {
    setEditingProduct(record);
    form.setFieldsValue({
      itemname: record.itemname,
      stock_quantity: record.stock_quantity,
      cost: parseFloat(record.cost.replace('₱', '')),
      warehouse_location: record.warehouse_location,
      last_restock_date: record.last_restock_date,
    });
    setIsModalVisible(true);
  };

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(`/api/inventory/${editingProduct.id}`, values);
      message.success("Item updated successfully");
      setIsModalVisible(false);
      fetchInventory();
    } catch (error) {
      message.error("Error updating item");
    }
  };

  // Table Columns
  const columns = [
    { title: "Item Name", dataIndex: "itemname", key: "itemname" },
    { title: "Stock Quantity", dataIndex: "stock_quantity", key: "stock_quantity" },
    { title: "Cost", dataIndex: "cost", key: "cost" },
    { title: "Warehouse", dataIndex: "warehouse_location", key: "warehouse_location" },
    { title: "Last Restock", dataIndex: "last_restock_date", key: "last_restock_date" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => showEditModal(record)}
          />
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => handleDelete(record.id)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Inventory List</h2>
      
      <Table 
        columns={columns} 
        dataSource={products} 
        bordered 
        pagination={{ pageSize: 5 }}
      />

      {/* Edit Modal */}
      <Modal
        title="Edit Inventory Item"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleEditSubmit}>
          <Form.Item label="Item Name" name="itemname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Stock Quantity" name="stock_quantity" rules={[{ required: true }]}>
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item label="Cost" name="cost" rules={[{ required: true }]}>
            <InputNumber min={0} step={100} />
          </Form.Item>
          <Form.Item label="Warehouse" name="warehouse_location" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Inventory;