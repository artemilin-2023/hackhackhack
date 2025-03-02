import { AuthForm } from "widgets/Auth/AuthForm";
import { useEffect } from "react";
import { useStore } from "shared/store/store";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

export const AuthPage = observer(() => {
    const navigate = useNavigate();
    const store = useStore();

    useEffect(() => {
        console.log("Current user state:", store.user);
        if (store.user) {
            console.log("Redirecting to home page");
            navigate("/");
        }
    }, [store.user, navigate]);

    return (
        <div className="max-w-md mx-auto py-12">
            <AuthForm />
        </div>
    )
})
