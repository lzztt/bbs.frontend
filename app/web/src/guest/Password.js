import React from "react";
import AuthCodeForm from "./AuthCodeForm";
import PasswordForm from "./PasswordForm";

function Password() {
  return (
    <AuthCodeForm
      handler="/api/identificationcode"
      submit="请求重设密码"
      next={<PasswordForm />}
    />
  );
}

export default Password;
