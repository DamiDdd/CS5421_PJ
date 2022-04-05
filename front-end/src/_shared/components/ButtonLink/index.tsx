import React from "react";
import { Button } from "antd";
import { ButtonProps } from "antd/lib/button";
import { useNavigate } from "react-router-dom";

type ButtonLinkProps = Omit<ButtonProps, "href"> & {
  to: string;
};

const ButtonLink = (props: ButtonLinkProps) => {
  const { to, onClick, target } = props;
  const navigate = useNavigate();
  return (
    <Button
      {...props}
      href={to}
      onClick={(e) => {
        if (target != null) {
          return;
        }
        if (e.ctrlKey || e.metaKey) {
          return;
        }
        e.preventDefault();
        onClick?.(e);
        navigate(to);
      }}
    />
  );
};

export default ButtonLink;
