// import { useEffect } from "react";
import prisma from "@/lib/db"
const Page = async () => {
  const users = await prisma.user.findMany();
  

  return( 
    <div className="text-red-300">
      { JSON.stringify(users) }
    </div>
  )
}

export default Page;