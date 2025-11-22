// import { useEffect } from "react";
import prisma from "@/lib/db"
import { useTRPC } from "@/trpc/client"
import { caller } from "@/trpc/server"
import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query"
import { Client } from "./client"
import { getQueryClient } from "@/trpc/server"
import { trpc } from "@/trpc/server"
import { Suspense } from "react"
const Page = async () => {
  const users = await caller.getUsers();
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <Client/>
      </Suspense>
    </HydrationBoundary>
  )
}

export default Page;