import React from "react";
import { Layout, Button } from "antd";
import s from "./s.module.scss";
import SideMenu from "src/_shared/components/SideMenu";

const { Header, Sider, Content } = Layout;

type PageLayoutProps = {
  children: React.ReactNode;
};

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <Layout style={{ minHeight: "100%" }}>
      <Header className={s.header}>
        <Button type="link" ghost>
          <span className={s.siteName}>PostgreSQL Leaderboard</span>
        </Button>
      </Header>
      <Layout className={s.pageLayout}>
        <Sider className={s.sideNav} width={256} trigger={null} collapsible>
          <SideMenu />
        </Sider>
        <Content className={s.pageContent}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
