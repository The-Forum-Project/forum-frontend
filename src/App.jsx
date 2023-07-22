import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import GuardRoute from "./components/GuardRoute";
import AdminGuardRoute from "./components/AdminGuardRoute"
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import PostDetailPage from "./pages/PostDetailPage";
import ContactAdminPage from "./pages/ContactAdminPage";
import MMPage from "./pages/MMPage";
import UMPage from "./pages/UMPage";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AppLayout />}>
            <Route element={<GuardRoute />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/users/profile/:userId" element={<ProfilePage />} />
                <Route path="/posts/:postId" element={<PostDetailPage />} />
                <Route element={<AdminGuardRoute/>}>
                    <Route path="/messages" element={<MMPage />} />
                    <Route path="/users" element={<UMPage />} />
                </Route>
            </Route>
            <Route path="/contactus" element={<ContactAdminPage />} />
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
