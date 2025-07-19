import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Hello World</h1>
        <p className="text-lg">This is a test</p>
      </div>
    </MainLayout>
  );
}
