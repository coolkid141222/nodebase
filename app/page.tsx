import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query"
import { Client } from "./client"
import { getQueryClient } from "@/trpc/server"
import { trpc } from "@/trpc/server"
import { Suspense } from "react"
const Page = async () => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <Client />
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page;