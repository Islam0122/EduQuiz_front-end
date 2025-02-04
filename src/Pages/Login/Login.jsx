import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api";
import { setAuthData } from "../../redux/slices/authSlice";

import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMessage, setErrorMessage] = useState(""); // ✅ Добавили состояние для ошибок

  const onSubmit = async (data) => {
    setErrorMessage("");
    try {
      const response = await login(data).unwrap();
      dispatch(setAuthData({ token: response.access, user: data.username }));
      navigate("/"); // ✅ Перенаправление после успешного входа
    } catch (err) {
      const errorMsg = err?.data?.non_field_errors?.[0] || "Ошибка входа.";
      setErrorMessage(errorMsg); // ✅ Показываем ошибку в UI
    }
  };

  return (
    <div className="auth">
      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <h4>Добро пожаловать в EduQuiz!<br/>Войдите, чтобы продолжить тестирование  </h4>
          {/* Глобальная ошибка */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              className={errors.username ? "input-error" : ""}
              {...register("username", {
                required: "Поле Username обязательно.",
                minLength: { value: 5, message: "Минимум 5 символов." },
              })}
            />
            {errors.username && (
              <p className="error-message">{errors.username.message}</p> // Ошибка под полем
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              className={errors.password ? "input-error" : ""}
              {...register("password", {
                required: "Поле Пароль обязательно.",
                minLength: { value: 5, message: "Минимум 5 символов." },
              })}
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p> // Ошибка под полем
            )}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
