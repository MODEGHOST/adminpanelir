import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signIn = useSignIn();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const API_URL = `${import.meta.env.VITE_API_KEY}/api/admin/login`; // URL ของ API

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(API_URL, data); // ส่งข้อมูลไปยัง API

      const token = response.data.access_token;

      if (token) {
        // บันทึกสถานะการเข้าสู่ระบบ
        if (
          signIn({
            token: response.data.access_token,
            authState: response.data.user,
            expiresIn: 60, // กำหนดเวลา Token
            tokenType: "Bearer",
          })
        ) {
          navigate("/"); // นำไปยังหน้าแรก
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ!",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.error || "เกิดข้อผิดพลาด!",
      });
      reset({
        email: "",
        password: "",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="login-logo">
          <a href="#">
            <b>WEB</b> THAIRUNG IR
          </a>
        </div>
        <div id="auth_bg" className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">ADMIN SIGNIN</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="input-group mb-3">
                <input
                  className="form-control"
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="Email"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </div>
              {errors.email && (
                <p className="text-danger">This email field is required</p>
              )}
              <div className="input-group mb-3">
                <input
                  className="form-control"
                  type="password"
                  {...register("password", { required: true })}
                  placeholder="Password"
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </div>
              {errors.password && (
                <p className="text-danger">This password field is required</p>
              )}
              <div className="row">
                <div className="col-4 offset-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
