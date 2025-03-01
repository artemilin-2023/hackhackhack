import { BrowserRouter, Routes, Route } from "react-router-dom";
import { IndexPage } from "pages/Index/IndexPage";
import { AuthPage } from "pages/Auth/AuthPage";
import { LotsPage } from "pages/Lots/LotsPage"
import { PersonalPage } from "pages/Personal/PersonalPage"
import { AdminPage } from "pages/Admin/AdminPage"
import { CartPage } from "pages/Cart/CartPage";

import { PageLayout } from "shared/layouts/PageLayout";
import { SingleLot } from "pages/SingleLot/SingleLot";

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
					<Route path="/lots/:id" element={<SingleLot />} />
					<Route path="/cart" element={<CartPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
