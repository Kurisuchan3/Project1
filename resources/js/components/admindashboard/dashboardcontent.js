import React from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

const DashboardContent = () => {
  return (
    <Card style={{ textAlign: "center", margin: "20px", padding: "20px" }}>
      <Title level={2}>Welcome to Dashboard</Title>
    </Card>
  );
};

export default DashboardContent;
