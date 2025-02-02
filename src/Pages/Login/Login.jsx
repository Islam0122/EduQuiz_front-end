import React, { useState } from "react";
import { useLoginMutation } from "../../redux/api";

const Login = () => {
    const [password, setPassword] = useState(false);
    const [login, { isLoading, error }] = useLoginMutation();

    const handlePassword = () => {
        setPassword(!password);
    };

    const register = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const user = {
            username: formData.get("username"),
            password: formData.get("password"),
        };
        console.log(user)

        try {
            const response = await login(user).unwrap();
            console.log("Успешная авторизация:", response);
        } catch (err) {
            console.error("Ошибка авторизации:", err?.data?.message || err?.message || "Неизвестная ошибка");
        }
    };

    return (
        <div>
            <div className="container">
                <form onSubmit={register}>
                    <input type="text" name="username" placeholder="Email" required />
                    <input type={password ? "text" : "password"} name="password" placeholder="Password" required />
                    <p onClick={handlePassword} style={{ cursor: "pointer" }}>
                        {password ? "Скрыть пароль" : "Показать пароль"}
                    </p>
                    <button type="submit" disabled={isLoading}>Авторизация</button>
                </form>
                {error && <p style={{ color: "red" }}>Ошибка авторизации: {error?.data?.message || error?.message}</p>}
            </div>
        </div>
    );
};

export default Login;
