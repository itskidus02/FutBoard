import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { BorderBeam } from "@/components/magicui/border-beam";
import hero from "../assets/hero.png"
import Marquee from "react-fast-marquee";
import prem from "../assets/prem.svg"

const Home = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const res = await fetch("/api/table/get");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch tables");
        }
        // Update tables state with fetched data
        setTables(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative p-2 max-w-screen-xl mx-auto pt-20 sm:pt-24 lg:pt-32">
      <div className="tracking-tight text-center">
        <h1 className="font-extrabold text-4xl text-[#00684A] sm:text-5xl lg:text-9xl font-fraunces">
          Track, Manage, and Export your Local Leagues
        </h1>
        <div className="mt-6 text-lg text-center max-w-3xl mx-auto">
          <p className=" text-xl sm:text-3xl lg:text-3xl font-fraunces">
            Replace the old ways of tracking, managing, and recording football tournament’s results by FutBoard
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <button className="bg-[#00684A] hover:bg-white hover:ring font-fraunces hover:ring-[#00684A] hover:text-black text-white font-semibold py-2 px-6 rounded-lg text-lg sm:text-xl lg:text-lg transition duration-300">
              Create Table
            </button>
            <button className="bg-white ring-2 hover:text-white font-fraunces hover:bg-[#00684A] ring-[#00684A] font-bold py-2 px-6 rounded-lg text-lg sm:text-xl lg:text-lg transition duration-300">
              Match Results
            </button>
          </div>
        </div>
      </div>

      {/* Render BorderBeam component below other content */}
      <div className="max-w-screen-xl flex justify-center mt-32 mx-auto">
        <div className="relative lg:h-[500px] w-full flex flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            <img src={hero} alt="" />
          </span>
          <BorderBeam size={250} duration={12} delay={9} />
        </div>
      </div>
      <div className="mt-44 flex gap-12 flex-col justify-center items-center"> 
  <h1 className="text-3xl font-semibold font-poppins">Having minimal features like the following companies</h1>
  <Marquee>
    <img src={prem} className="w-29 h-20 mx-20" alt="" />
    <img src={prem} className="w-29 h-20 mx-20" alt="" />
    <img src={prem} className="w-29 h-20 mx-20" alt="" />
    <img src={prem} className="w-29 h-20 mx-20" alt="" />
    <img src={prem} className="w-29 h-20 mx-20" alt="" />
   

  </Marquee>
</div>

    </div>
  
  
  
    // <div className='px-4 py-12 max-w-2xl mx-auto'>
    //   <h1 className='text-3xl font-bold mb-4 text-slate-800'>
    //     Soccer Tables
    //   </h1>
    //   <div className='flex gap-4'>
    //     <button className='ring-2 ring-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded'>
    //       <Link to="/create-table-team">Create Table</Link>
    //     </button>
    //     <button className='ring-2 ring-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white font-bold py-2 px-4 rounded'>
    //       <Link to="/display-result">Results</Link>
    //     </button>
    //   </div>
    //   <div className='mt-3'>
    //     <h2 className='text-xl font-bold mb-2'>Tables:</h2>
    //     <ul>
    //       {tables.map((table) => (
    //         <li key={table._id}>
    //           <Link to={`/display-table/${table._id}`}>
    //             <p className='text-blue-500 cursor-pointer'>{table.name}</p>
    //           </Link>
    //           {/* Display club logos for each table */}
    //           <div className="flex flex-wrap gap-2 mt-1">
    //             {table.clubs.map((club) => (
    //               <div key={club.clubId._id} className="flex items-center">
    //                 {club.clubId.logoUrl && (
    //                   <img
    //                     src={club.clubId.logoUrl}
    //                     alt={`${club.clubId.name} logo`}
    //                     className="w-8 h-8 mr-1"
    //                   />
    //                 )}
    //               </div>
    //             ))}
    //           </div>
    //         </li>
    //       ))}
    //     </ul>
    //   </div>
    // </div>
  );
};

export default Home;
