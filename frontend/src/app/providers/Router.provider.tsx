import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IndexPage } from "pages/Index/IndexPage";
import { AuthPage } from "pages/Auth/AuthPage";
import { PageLayout } from "shared/layouts/PageLayout";
import { LotsPage } from "pages/Lots/LotsPage"
import { PersonalPage } from "pages/Personal/PersonalPage"
import { AdminPage } from "pages/Admin/AdminPage"

export const RouterProvider = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PageLayout />}>
                    <Route path="/" element={<IndexPage />} />
                    <Route path="/auth" element={<AuthPage />} />
					<Route path="/lots" element={<LotsPage />} />
					<Route path="/personal" element={<PersonalPage />} />
					<Route path="/admin" element={<AdminPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
