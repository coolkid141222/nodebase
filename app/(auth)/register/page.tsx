import { RegisterForm } from "@/features/auth/components/register-form";
import { authUiConfig } from "@/lib/auth-config";

const Page = () => {
    return (
        <div>
            <RegisterForm {...authUiConfig} />
        </div>
    )
}

export default Page;
