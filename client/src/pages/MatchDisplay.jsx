import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import football from "../assets/football.svg";
import boots from "../assets/boots.svg";
import arrowright from "../assets/arrowright.svg";

const MatchDisplay = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState(null);
  const [tableName, setTableName] = useState(null);
  const [matchDate, setMatchDate] = useState(null);
  const [manOfMatch, setManOfMatch] = useState(null);
  
  const [tableMatches, setTableMatches] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(`/api/table/match/${matchId}`);
        setMatch(response.data.match);
        setTableName(response.data.tableName);
        setManOfMatch(response.data.manOfMatch);
        setMatchDate(response.data.matchDate);
        setTableMatches(response.data.tableMatches);
      } catch (err) {
        setError(
          err.response
            ? err.response.data.message
            : "Error fetching match details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const groupMatchesByDate = (matches) => {
    return matches.reduce((groups, matchItem) => {
      const date = formatDate(matchItem.matchDate);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(matchItem);
      return groups;
    }, {});
  };

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const groupedMatches = tableMatches ? groupMatchesByDate(tableMatches) : {};

  return (
    <div className="flex flex-col-reverse lg:flex-row max-w-7xl mx-auto rounded-lg p-6">
      {/* Left Sidebar - Other Matches */}
      <div className="lg:w-[30%] ring ring-[#00684A] rounded-lg shadow-md lg:order-first mb-4 lg:mb-0">
        <div className="flex items-center justify-center p-4 text-xl lg:text-2xl text-white font-extrabold tracking-widest bg-[#00684A]">
          {tableName}
        </div>
        <div className=" rounded-lg p-4">
          {tableMatches && tableMatches.length > 0 ? (
            Object.keys(groupedMatches).map((date) => (
              <div key={date} className="space-y-4 mb-4">
                <h3 className="text-lg text-center font-semibold text-[#00684A] font-fraunces">
                  {date}
                </h3>
                {groupedMatches[date].map((matchItem) => (
                  <Link to={`/match/${matchItem._id}`} key={matchItem._id}>
                    <div className="flex justify-between items-center p-2 mt-3 bg-white rounded-lg hover:ring hover:ring-[#00684A] transition duration-200 ease-in-out">
                      <div className="flex items-center w-1/3 justify-center">
                        <span className="text-sm lg:text-lg font-extrabold font-poppins uppercase text-gray-800">
                          {matchItem.homeClubId.name.substring(0, 3)}
                        </span>
                        <img
                          src={matchItem.homeClubId.logoUrl}
                          alt={matchItem.homeClubId.name}
                          className="h-6 w-6 lg:h-8 lg:w-8 mx-2"
                        />
                      </div>
                      <div className="text-sm lg:text-lg font-bold py-1 text-white rounded-md bg-[#00684A] w-1/3 text-center">
                        {matchItem.homeGoals} - {matchItem.awayGoals}
                      </div>
                      <div className="flex items-center w-1/3 justify-center">
                        <img
                          src={matchItem.awayClubId.logoUrl}
                          alt={matchItem.awayClubId.name}
                          className="h-6 w-6 lg:h-8 lg:w-8 mx-2"
                        />
                        <span className="text-sm lg:text-lg font-extrabold font-poppinsuppercase text-gray-800">
                          {matchItem.awayClubId.name.substring(0, 3)}
                        </span>
                      </div>
                      <div className="ml-2">
                        <img
                          src={arrowright}
                          alt="arrow right"
                          className="h-3 w-3 lg:h-4 lg:w-4"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No matches found.</p>
          )}
        </div>
      </div>

      {/* Right Side - Match Details */}
      {/* Right Side - Match Details */}
      {/* Right Side - Match Details */}
      <div className="w-full lg:w-5/6 lg:pl-4 mb-4 lg:mb-0 lg:order-last">
        <div className="rounded-lg">
          <div className="text-center text-xs md:text-md mb-2 text-black font-fraunces">
            {formatDate(matchDate)}
          </div>
          <div className="flex justify-center text-white">
            <div className="flex items-center flex-1 justify-center md:gap-3 h-[4rem] md:h-[7rem] bg-white rounded-r-none text-black rounded-lg p-3 md:p-3 ring-2 ring-[#00684A]">
              <span className="text-xs md:text-xl font-bold font-fraunces mr-2">
                {match.homeClubId.name}
              </span>
              <img
                src={match.homeClubId.logoUrl}
                alt={match.homeClubId.name}
                className="h-6 md:h-16 w-6 md:w-16"
              />
            </div>

            <div className="relative">
              <div className="text-2xl ml-2 mr-2 md:text-6xl font-fraunces font-bold bg-[#00684A] rounded-t-none rounded-lg flex flex-col text-center justify-center w-[7rem] md:w-[11rem] h-[5rem] md:h-[9rem]">
                <div className="py-2 lg:text-5xl md:text-3xl text-xl  font-poppins px-3 md:px-5">
                  {match.homeGoals} - {match.awayGoals}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-center">
                  FT
                </div>
              </div>
            </div>

            <div className="flex items-center flex-1 justify-center gap-2 md:gap-3 h-[4rem] md:h-[7rem] bg-white text-black rounded-l-none rounded-lg p-3 md:p-3 ring-2 ring-[#00684A]">
              <img
                src={match.awayClubId.logoUrl}
                alt={match.awayClubId.name}
                className="h-6 md:h-16 w-6 md:w-16"
              />
              <span className="text-xs md:text-xl font-fraunces  ml-2">
                {match.awayClubId.name}
              </span>
            </div>
          </div>

          <div className="flex lg:gap-[14rem] md:gap-[10rem] gap-[6rem]  justify-center mt-4">
            <div className="pb-4">
              {match.homeScorers.length ? (
                <ul className="list-none space-y-2 md:space-y-3">
                  {match.homeScorers.map((scorer, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 md:gap-3"
                    >
                      <span className="text-sm md:text-lg flex flex-col text-gray-600">
                        <div>
                          <span className="font-bold font-poppins">
                            {scorer.time}'{" "}
                          </span>
                          <img
                            src={football}
                            alt="football"
                            className="inline h-3 md:h-4 w-3 md:w-4"
                          />
                        </div>
                        <span className="text-sm font-poppins uppercase md:text-lg font-bold text-gray-700">
                          {scorer.scorer}
                        </span>
                        {scorer.assistor && (
                          <div className="text-sm font-poppins lowercase flex gap-2 text-gray-600">
                            <span className="ml-1">{scorer.assistor}</span>
                            <img
                              src={boots}
                              alt="assist"
                              className="inline h-3 md:h-4 w-3 md:w-4"
                            />
                          </div>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm md:text-base"></p>
              )}
            </div>

            <div className="pb-4">
              {match.awayScorers.length ? (
                <ul className="list-none space-y-2 md:space-y-3">
                  {match.awayScorers.map((scorer, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 md:gap-3"
                    >
                      <span className="text-sm md:text-lg flex flex-col text-gray-600">
                        <div>
                          {scorer.time}'{" "}
                          <img
                            src={football}
                            alt="football"
                            className="inline h-3 md:h-4 w-3 md:w-4"
                          />
                        </div>
                        <span className="text-sm md:text-lg font-bold font-poppins text-gray-700">
                          {scorer.scorer}
                        </span>
                        {scorer.assistor && (
                          <div className="text-sm flex gap-2 text-gray-600">
                            <span className="ml-1 lowercase">
                              {scorer.assistor}
                            </span>
                            <img
                              src={boots}
                              alt="assist"
                              className="inline h-3 md:h-4 w-3 md:w-4"
                            />
                          </div>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm md:text-base"></p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="bg-[#00684A] lg:px-4 md:px-3 px-2 py-1 font-poppins lg:text-xl text-md font-bold text-white rounded-md">Player of the match</div>
          <img src={arrowright} alt="" className="lg:h-10 lg:w-10 md:h-8 md:w-8 h-6 w-6" />

          <div className="bg-[#EDE4E4] text-[#00684A] lg:px-4 md:px-3 px-2  py-1 text-md font-poppins text-xl font-bold uppercase rounded-md">{manOfMatch}</div>
        </div>
      </div>
    </div>
  );
};

export default MatchDisplay;
