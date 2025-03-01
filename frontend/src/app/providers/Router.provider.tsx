import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IndexPage } from "pages/Index/IndexPage";
import { AuthPage } from "pages/Auth/AuthPage";
import { PageLayout } from "shared/layouts/PageLayout";

export const RouterProvider = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
