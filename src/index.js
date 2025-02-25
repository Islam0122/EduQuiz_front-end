import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from '../src/redux/store'
import { HashRouter } from "react-router-dom";  // ✅ Меняем BrowserRouter на HashRouter

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <HashRouter>  {/* ✅ Здесь тоже изменяем */}
            <Provider store={store}>
                <App />
            </Provider>
        </HashRouter>
    </React.StrictMode>
);
