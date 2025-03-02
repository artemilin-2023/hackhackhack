import { Header } from "widgets/Header/Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const PageLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <ToastContainer 
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                toastClassName="custom-toast"
                progressClassName="custom-toast-progress"
            />
        </>
    )
}
