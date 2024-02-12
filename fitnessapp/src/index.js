import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import HomePage from "./Pages/homePage";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools';
import SignInPage from "./Pages/loginPage";
import SignUpPage from "./Pages/signUpPage";
import ProtectedRoutes from "./protectedRoutes";
import AuthContextProvider from "./Contexts/authContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 360000,
      refetchInterval: 360000,
      refetchOnWindowFocus: false
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <AuthContextProvider>
          <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/home" element={<HomePage />} />
            </Route>
            <Route path="/signup" element={ <SignUpPage /> } />
            <Route path="/" element={<SignInPage />} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthContextProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const rootElement = createRoot(document.getElementById("root"))
rootElement.render(<App />);