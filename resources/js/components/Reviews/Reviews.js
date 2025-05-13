import React from "react";
import { Layout, Button, Avatar, Rate } from "antd";
import { UserOutlined } from "@ant-design/icons";
import TopNav from "../topnav";
import AdminSideMenu from "../admin-sidemenu";
import "../../../sass/components/_topnav.scss";
import "../../../sass/components/_reviews.scss";

const { Sider, Content } = Layout;

const NAV_HEIGHT = 76;
const SIDEBAR_WIDTH = 200;

const Reviews = () => {
  const reviews = [
    {
      username: "YanzzieBoi",
      date: "01/31/2025",
      content:
        "A good laptop for its price. It’s a gaming and work laptop in one. I played Hogwarts Legacy on high settings, and the gameplay was smooth. It’s definitely worth it for its price. Kudos to MSI.",
    },
    {
      username: "AnotherUser",
      date: "02/05/2025",
      content:
        "Solid build quality and performance. Battery life could be better, but overall a great machine for both gaming and productivity.",
    },
    {
      username: "TechFan99",
      date: "02/10/2025",
      content:
        "Fantastic display and speakers. Ran heavy workloads without a hitch. Fans can get loud under load, but it’s manageable.",
    },
  ];

  return (
    <div className="reviews-page">
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
          <Content style={{ padding: 24, background: "#fff" }}>
            <div className="reviews-container">
              <div className="reviews-header">Reviews</div>

              {reviews.map((r, i) => (
                <div key={i} className="review-item">
                  <div className="review-item-header">
                    <div className="user-info">
                      <Avatar size="small" icon={<UserOutlined />} />
                      <span className="username">{r.username}</span>
                      <Rate disabled defaultValue={5} className="star-rating" />
                    </div>
                    <span className="review-date">{r.date}</span>
                  </div>

                  <p className="review-content">{r.content}</p>

                  {i < reviews.length - 1 && <div className="divider" />}
                </div>
              ))}

              <div className="view-more">
                <Button>View more</Button>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default Reviews;
