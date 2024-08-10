import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import { BorderBeam } from "@/components/magicui/border-beam";
import hero from "../assets/hero.png";
import Marquee from "react-fast-marquee";
import prem from "../assets/prem.svg";
import laliga from "../assets/laliga.svg";
import arrow from "../assets/arrowright.svg";
import user from "../assets/user.svg";

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
        // Ensure that user details are populated along with table data
        const tablesWithCreators = await Promise.all(data.map(async (table) => {
          const creatorRes = await fetch(`/api/user/${table.userId._id}`);
          const creatorData = await creatorRes.json();
          return { ...table, creator: creatorData };
        }));
        setTables(tablesWithCreators);
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
    <div className="relative p-3 max-w-screen-xl mx-auto pt-20 sm:pt-24 lg:pt-32">
      <div className="tracking-tight text-center">
        <h1 className="font-extrabold text-4xl  text-[#00684A] sm:text-5xl lg:text-9xl font-fraunces">
          Track, Manage, and Export your Local Leagues
        </h1>
        <div className="mt-6 text-lg text-center max-w-3xl mx-auto">
          <p className="text-xl sm:text-3xl lg:text-3xl font-fraunces">
            Replace the old ways of tracking, managing, and recording football
            tournament’s results by FutBoard
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <button className="bg-[#00684A] hover:bg-white hover:ring font-fraunces hover:ring-[#00684A] hover:text-black text-white font-semibold py-2 px-6 rounded-lg text-lg sm:text-xl lg:text-lg transition duration-300">
              <Link to="/create-table-team">Create Table</Link>
            </button>
            <button className="bg-white ring-2 hover:text-white font-fraunces hover:bg-[#00684A] ring-[#00684A] font-bold py-2 px-6 rounded-lg text-lg sm:text-xl lg:text-lg transition duration-300">
              <Link to="/display-result"> Match Results</Link>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl flex justify-center mt-32 mx-auto">
        <div className="relative lg:h-[500px] w-full flex flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
            <img src={hero} alt="" />
          </span>
          <BorderBeam size={250} duration={12} delay={9} />
        </div>
      </div>
      <div className="mt-44 flex gap-12 flex-col justify-center items-center">
        <h1 className="lg:text-3xl  text-xl text-center p-3   font-semibold font-poppins">
          Having minimal features like the following companies
        </h1>
        <Marquee>
          <img src={prem} className="w-29 h-20 mx-20" alt="" />
          <img src={laliga} className="w-29 h-20 mx-20" alt="" />
        </Marquee>
      </div>

      <div className="mt-36 max-w-screen-xl py-4 p-3 mx-auto">
        <div className="flex mb-9 space-x-3">
          <div className="bg-[#00684A] rounded-lg h-12 w-2">.</div>
          <h1 className="lg:text-[28.125px] md:text-[20.125px] text-[20.125px] font-fraunces text-[#00684A] font-bold">
            Tables from our community
          </h1>
        </div>

        <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
          {tables.map((table) => (
            <div
              key={table._id}
              className="flex flex-col bg-white rounded-lg shadow-lg p-4 ring-2 ring-[#00684A]"
            >
              <div className="flex justify-between">
                <div className="flex flex-col gap-3">
                  <div className="ring-2 gap-2 flex ring-[#00684A] font-bold rounded-md font-poppins py-1 px-2 text-center">
                    <h4 className="text-md font-light">by <span className="font-bold">{table.creator.username}</span></h4>
                  <img src={user} className="w-6 h-6" alt="" />
                  </div>
                  <div className="text-white bg-[#00684A] font-bold rounded-md font-poppins py-1 px-2 text-center">
                    <h3 className="text-lg lg:text-xl font-semibold">
                      {table.name.substring(0, 4)}
                      {table.name.length > 4 ? "..." : ""}
                    </h3>
                  </div>
                  <div className="flex items-center">
                    {table.clubs.slice(0, 3).map((club) => (
                      <div key={club.clubId._id} className="flex items-center">
                        {club.clubId.logoUrl && (
                          <img
                            src={club.clubId.logoUrl}
                            alt={`${club.clubId.name} logo`}
                            className="lg:w-6 lg:h-6 w-6 h-6"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center">
                  <Link to={`/display-table/${table._id}`}>
                    <button className=" ring ring-[#00684A] text-white font-semibold py-1 px-2 rounded-md text-md transition duration-300 hover:bg-white hover:text-[#00684A] hover:ring hover:ring-[#00684A]">
                      <img src={arrow} className="h-6 w-6" alt="" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
