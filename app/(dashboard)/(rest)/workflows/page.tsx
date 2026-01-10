import { requireAuth } from "@/lib/auth-utils"

const Page = async () => {
    await requireAuth;
    return (
        <p>
            workflows
        </p>
    )
}

export default Page;