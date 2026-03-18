import { requireAuth } from "@/lib/auth-utils";
import { AITestView } from "@/features/ai/components/ai-test";

const Page = async () => {
  await requireAuth();

  return <AITestView />;
};

export default Page;
