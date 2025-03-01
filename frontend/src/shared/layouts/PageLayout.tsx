import { Header } from "widgets/Header/Header";
import { Outlet } from "react-router-dom";

export const PageLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
        </>
    )
}
