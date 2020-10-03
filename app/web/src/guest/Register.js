import React from "react";
import AuthCodeForm from "./AuthCodeForm";
import PasswordForm from "./PasswordForm";

function Register() {
  return (
    <AuthCodeForm
      handler="/api/user"
      submit="同意使用规范和免责声明，并创建帐号"
      next={<PasswordForm />}
    >
      <fieldset>
        [
        <a href="/todo" target="_blank">
          网站使用规范
        </a>
        ] [
        <a href="/term" target="_blank">
          免责声明
        </a>
        ]
      </fieldset>
    </AuthCodeForm>
  );
}

export default Register;
