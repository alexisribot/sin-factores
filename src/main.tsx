import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const app = initializeApp(JSON.parse(import.meta.env.VITE_APP_FIREBASE));
initializeFirestore(app, { experimentalAutoDetectLongPolling: true });

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
