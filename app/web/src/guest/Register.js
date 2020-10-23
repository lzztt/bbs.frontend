import React from "react";
import AuthCodeForm from "./AuthCodeForm";
import PasswordForm from "./PasswordForm";

function Register() {
  return (
    <AuthCodeForm
      handler="/api/user"
      submit="同意服务条款和隐私政策，并创建帐号"
      next={<PasswordForm />}
    >
      <div>
        [
        <a href="/term" target="_blank">
          服务条款
        </a>
        ] [
        <a href="/privacy" target="_blank">
          隐私政策
        </a>
        ]
      </div>
    </AuthCodeForm>
  );
}

export default Register;
