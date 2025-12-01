import React, { Suspense } from "react";
import { useRoutes } from "react-router-dom";
import Loader from "@/components/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { routes } from "@/routes/AppRoutes";

const App = () => {
  const element = useRoutes(routes);

  return (
    <Suspense fallback={<Loader />}>
      {element}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        theme="light"
        toastStyle={{ backgroundColor: "#f8fafc", color: "#111827" }}
      />
    </Suspense>
  );
};

export default App;
