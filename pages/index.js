import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {

  //fetch data from API
  const [data, setData] = useState(null);

  useEffect(() => {

    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setData(data))
  }, [])

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-screen gap-5 overflow-y-hidden">
        {/* Info Div */}
        <div className="flex flex-col items-center justify-center gap-5">
          <h1 className="text-6xl font-bold text-white">Master Your Typing Skills</h1>
          <h2 className="text-4xl text-white font-bold pb-4">With <span className="text-blue-500">TypeSpeed</span></h2>
          <Link href="/type">
            <button className="text-blue hover:before:bg-blue-500 border-blue-500 relative h-[50px] w-40 overflow-hidden border bg-white px-3 text-blue-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-blue-500 before:transition-all before:duration-500 hover:text-white hover:shadow-blue-500 hover:before:left-0 hover:before:w-full">
              <span className="relative z-10 font-bold">
                Start Typing
              </span>
            </button>
          </Link>
        </div>
        {/* Feature Cards Div */}
        

      </div>
    </MainLayout>
  );
}
