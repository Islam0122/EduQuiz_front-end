import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/api";
import { setAuthData } from "../../redux/slices/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Импортируем иконки
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
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    setErrorMessage("");

    try {
      const response = await login(data).unwrap();
      dispatch(setAuthData({
        token: response.access,
        user: data.username,
        refreshToken: response.refresh
      }));
      localStorage.setItem("username", data.username);

      navigate("/");
    } catch (err) {
      let errorMsg = "Ошибка входа.";
      if (err?.data) {
        errorMsg = err.data.non_field_errors?.join(", ") ||
            err.data.detail ||
            "Неправильный логин или пароль.";
      }
      setErrorMessage(errorMsg);
    }
  };

  return (
      <div className="auth">
        <div className="container">
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <h2>Войти в систему</h2>
            <h5>Введите логин и пароль, выданные администрацией</h5>

            <div className="form-group">
              <input
                  type="text"
                  placeholder="Логин"
                  className={errors.username ? "input-error" : ""}
                  {...register("username", {
                    required: "Поле Логин обязательно.",
                    minLength: { value: 5, message: "Минимум 5 символов." },
                  })}
              />

              <div className="password-input-container">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Пароль"
                    className={errors.password ? "input-error" : ""}
                    {...register("password", {
                      required: "Поле Пароль обязательно.",
                      minLength: { value: 5, message: "Минимум 5 символов." },
                    })}
                />
                <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              </div>

              {/* Ошибки ввода */}
              {(errors.username || errors.password) && !errorMessage && (
                  <p className="error-message">
                    {errors.username?.message || errors.password?.message}
                  </p>
              )}
              {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}

              <div className="forgot-password">
                <p className="text">Забыли логин/пароль?</p>
                <p><a href="https://t.me/duishobaevislam01" className="admin-url">
                  Написать администратору
                </a></p>
              </div>

              <button type="submit" disabled={isLoading} className={isLoading ? "loading" : ""}>
                {isLoading ? "Загрузка..." : "Войти"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};

export default Login;
