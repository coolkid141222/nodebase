interface PageProps {
    params: Promise<{
        workflowId: string;
    }>
}

const Page = async ({ params }: PageProps) => {
    const { workflowId } = await params;
    return (
        <p>Credential id: {workflowId}</p>
    )
}

export default Page;