import { LoginForm } from "@/features/auth/components/login-form";
import { authUiConfig } from "@/lib/auth-config";

const Page = () => {
    return (
        <div>
            <LoginForm
                googleEnabled={authUiConfig.googleEnabled}
                githubEnabled={authUiConfig.githubEnabled}
            />
        </div>
    )
}

export default Page;
