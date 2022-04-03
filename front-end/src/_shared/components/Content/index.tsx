import React from "react";
import { Layout } from "antd";
import cx from "classnames";
import s from "./s.module.scss";

type Page = {
  children: React.ReactNode;
  className?: string;
};

type Content = {
  children: React.ReactNode;
  className?: string;
};

export const ContentPage = ({ children, className }: Page) => {
  return (
    <Layout.Content className={cx(s.page, className)}>
      {children}
    </Layout.Content>
  );
};

export const ContentCard = ({
  children,
  className,
  ...rest
}: React.HTMLProps<HTMLDivElement>) => (
  <section className={cx(className, s.content, s.card)} {...rest}>
    {children}
  </section>
);

export const ContentTitle = ({ children, className }: Content) => (
  <h1 className={cx(className, s.contentTitle)}>{children}</h1>
);
