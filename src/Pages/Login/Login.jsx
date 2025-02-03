import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../redux/api";
import { setAuthData } from "../../redux/slices/authSlice"; 

import "./Login.scss";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth); 
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [login, { isLoading, error: apiError }] = useLoginMutation();

    useEffect(() => {
        if (token) {
            navigate("/"); 
        }
    }, [token, navigate]);

    const onSubmit = async (data) => {
        try {
            const response = await login(data).unwrap();

            dispatch(setAuthData({ token: response.access, user: response.user })); 
        } catch (err) {
            console.error("Ошибка авторизации:", err?.data?.message || "Неизвестная ошибка");
        }
    };

    return (
        <div className="auth">
            <div className="container">
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <h4>Войти в систему</h4>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            className={errors.username ? "input-error" : ""}
                            {...register("username", {
                                required: "Поле Username обязательно.",
                                minLength: { value: 5, message: "Минимум 5 символов." }
                            })}
                        />
                        {errors.username && (
                            <p className="error-message">{errors.username.message}</p>
                        )}
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            className={errors.password ? "input-error" : ""}
                            {...register("password", {
                                required: "Поле Пароль обязательно.",
                                minLength: { value: 5, message: "Минимум 5 символов." }
                            })}
                        />
                        {errors.password && (
                            <p className="error-message">{errors.password.message}</p>
                        )}
                    </div>
                    <button type="submit" disabled={isLoading}>Войти</button>
                    {apiError && (
                        <p className="error-message">{apiError?.data?.message || "Ошибка. Попробуйте снова."}</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Login;