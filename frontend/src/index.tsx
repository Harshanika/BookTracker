import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const container = document.getElementById("root") as HTMLElement; // 👈 force non-null
const root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
