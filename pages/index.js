import { useEffect, useState } from "react";

export default function Home() {

  //fetch data from API
  const [data, setData] = useState(null);

  useEffect(()=> {
    
    fetch('/api/hello')
    .then((res) => res.json())
    .then((data) => setData(data))
  },[])
  
  return (
    <div>
      <h1>Testing API</h1>
      <p>{data ? data.message : 'Loading...'} </p>
    </div>
  );
}
