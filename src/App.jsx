import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import GuardRoute from "./components/GuardRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AppLayout />}>
            <Route element={<GuardRoute />}>
                <Route path="/home" element={<HomePage />} />
            </Route>
            <Route path="/users/register" element={<RegisterPage />} />
            <Route path="*" element={<LoginPage />} />
        </Route>
    )
);

function App() {
    console.log("RouterApp render");
    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}

export default App;
