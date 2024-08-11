import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Spinner from "../components/Spinner";
import arrowdown from "../assets/arrowdown.svg"

const DisplayTable = () => {
  const [table, setTable] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchTable = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/table/get/${params.tableId}`);
        if (!res.ok) throw new Error("Failed to fetch table");
        const data = await res.json();
        // Sort clubs by points and then by goal difference
        data.clubs.sort((a, b) => {
          if (b.points === a.points) {
            return b.goalDifference - a.goalDifference;
          }
          return b.points - a.points;
        });
        setTable(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching table:", error);
        setError(true);
        setLoading(false);
      }
    };
    fetchTable();
  }, [params.tableId]);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await fetch(`/api/user/${table.userId._id}`);
        if (!res.ok) throw new Error("Failed to fetch creator");
        const data = await res.json();
        setCreator(data);
      } catch (error) {
        console.error("Error fetching creator:", error);
      }
    };
    if (table) {
      fetchCreator();
    }
  }, [table]);

  const exportToExcel = () => {
    const tableWorksheet = XLSX.utils.json_to_sheet(
      table.clubs.map((club, index) => ({
        Position: index + 1,
        Club: club.clubId.name,
        Played: club.played,
        Won: club.won,
        Lost: club.lost,
        Drawn: club.drawn,
        "Goals Scored": club.goalsScored,
        "Goals Conceded": club.goalsConceded,
        "Goal Difference": club.goalDifference,
        Points: club.points,
      }))
    );

    const matchesWorksheet = XLSX.utils.json_to_sheet(
      table.matches.map((match) => {
        const homeClub = table.clubs.find(
          (club) => club.clubId._id === match.homeClubId
        );
        const awayClub = table.clubs.find(
          (club) => club.clubId._id === match.awayClubId
        );

        return {
          Match: `${homeClub?.clubId.name || "Unknown"} vs ${
            awayClub?.clubId.name || "Unknown"
          }`,
          Result: `${match.homeGoals} - ${match.awayGoals}`,
          "Match Date": new Date(match.matchDate).toLocaleDateString(),
        };
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, tableWorksheet, "Table");
    XLSX.utils.book_append_sheet(workbook, matchesWorksheet, "Matches");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `${table.name}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(table.name, 20, 10);

    const tableData = table.clubs.map((club, index) => [
      index + 1,
      club.clubId.name,
      club.played,
      club.won,
      club.lost,
      club.drawn,
      club.goalsScored,
      club.goalsConceded,
      club.goalDifference,
      club.points,
    ]);

    const matchesData = table.matches.map((match) => {
      const homeClub = table.clubs.find(
        (club) => club.clubId._id === match.homeClubId
      );
      const awayClub = table.clubs.find(
        (club) => club.clubId._id === match.awayClubId
      );

      return [
        `${homeClub?.clubId.name || "Unknown"} vs ${
          awayClub?.clubId.name || "Unknown"
        }`,
        `${match.homeGoals} - ${match.awayGoals}`,
        new Date(match.matchDate).toLocaleDateString(),
      ];
    });

    doc.autoTable({
      head: [
        [
          "Position",
          "Club",
          "Played",
          "Won",
          "Lost",
          "Drawn",
          "Goals Scored",
          "Goals Conceded",
          "Goal Difference",
          "Points",
        ],
      ],
      body: tableData,
      startY: 20,
    });

    doc.autoTable({
      head: [["Match", "Result", "Match Date"]],
      body: matchesData,
      startY: doc.lastAutoTable.finalY + 10,
    });

    // Add "made by SoccerBoard" text at the bottom right of the page
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    doc.text("made by SoccerBoard", pageWidth - 80, pageHeight - 10);

    doc.save(`${table.name}.pdf`);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (loading) {
    return <div className='flex justify-center items-center h-screen'><Spinner/></div>;
  }

  if (error) {
    return <p>Error loading table</p>;
  }

  return (
    <main>
      {table && (
        <div className="max-w-screen-xl mx-auto p-3 my-7">
          <h1 className="text-xl text-[#00684A] font-fraunces gap-2 lg:text-3xl flex font-semibold text-center my-7">
            <div className="bg-[#00684A] rounded-xl">.</div>
            {table.name}
          </h1>
          <div className="ring-2 p-3 rounded-lg ring-[#00684A]">
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full gap-3 border-collapse">
                <thead className="gap-3">
                  {/* This row will only appear on large screens and up */}
                  <tr className="hidden md:table-row ">
                    <th className="lg:py-1 bg-[#00684A] text-white rounded-md md:py-0 md:px-2 lg:px-2 border-b text-center">Position</th>
                    <th className="py-2 px-4 border-b text-left">Club</th>
                    <th className="py-2 px-4 border-b text-left">Played</th>
                    <th className="py-2 px-4 border-b text-left">Won</th>
                    <th className="py-2 px-4 border-b text-left">Lost</th>
                    <th className="py-2 px-4 border-b text-left">Drawn</th>
                    <th className="py-2 px-4 border-b text-left">Goal Scored</th>
                    <th className="py-2 px-4 border-b text-left">Goal Conceded</th>
                    <th className="py-2 px-4 border-b text-left">Goal Difference</th>
                    <th className="py-2 px-4 border-b text-left">Points</th>
                  </tr>
                  {/* This row will appear on medium screens and down */}
                  <tr className="table-row md:hidden text-center">
                    <th className="py-2 px-4 border-b">P</th>
                    <th className="py-2 px-4 border-b">C</th>
                    <th className="py-2 px-4 border-b">P</th>
                    <th className="py-2 px-4 border-b">W</th>
                    <th className="py-2 px-4 border-b">L</th>
                    <th className="py-2 px-4 border-b">D</th>
                    <th className="py-2 px-4 border-b">GS</th>
                    <th className="py-2 px-4 border-b">GC</th>
                    <th className="py-2 px-4 border-b">GD</th>
                    <th className="py-2 px-4 border-b">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {table.clubs.map((club, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4 border-b">{index + 1}</td>
                      <td className="py-2 px-4 border-b flex items-center">
                        {club.clubId.logoUrl && (
                          <img
                            src={club.clubId.logoUrl}
                            alt={`${club.clubId.name} logo`}
                            className="w-6 h-6 mr-2"
                          />
                        )}
                        <span className="hidden font-bold uppercase md:block">{club.clubId.name}</span>
                        <span className="md:hidden font-bold uppercase">
                          {club.clubId.name.slice(0, 3)}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{club.played}</td>
                      <td className="py-2 px-4 border-b">{club.won}</td>
                      <td className="py-2 px-4 border-b">{club.lost}</td>
                      <td className="py-2 px-4 border-b">{club.drawn}</td>
                      <td className="py-2 px-4 border-b">{club.goalsScored}</td>
                      <td className="py-2 px-4 border-b">{club.goalsConceded}</td>
                      <td className="py-2 px-4 border-b">{club.goalDifference}</td>
                      <td className="py-2 px-4 border-b">{club.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex mt-3 justify-between">
            {creator && (
              <div className="flex p-2 pt-2 bg-[#00684A] text-white rounded-md px-4 py-2  mb-4 flex-col gap-">
                <p>
                  Listed by{" "}
                  <span className="font-semibold">{creator.username}</span>{" "}
                </p>
              </div>
            )}
            <div className="relative">
              <button
                className="px-4 py-2 flex gap-2 bg-white text-[#00684A] ring-2 ring-[#00684A] rounded-md mb-4"
                onClick={toggleDropdown}
              >
                Export As
                <img src={arrowdown} className="w-6 h-6" alt="" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                  <button
                    onClick={exportToExcel}
                    className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                  >
                    Export to Excel
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
                  >
                    Export to PDF
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="overflow-x-auto mt-4 rounded-lg ring-2 ring-black ">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Match</th>
                  <th className="py-2 px-4 border-b">Match Date</th>
                </tr>
              </thead>
              <tbody>
                {table.matches.map((match, index) => {
                  const homeClub = table.clubs.find(
                    (club) => club.clubId._id === match.homeClubId
                  );
                  const awayClub = table.clubs.find(
                    (club) => club.clubId._id === match.awayClubId
                  );
  
                  return (
                    <tr key={index} className="text-center">
                      <td className="py-2 px-4 border-b flex items-center justify-center">
                        <span className="hidden md:block">{homeClub?.clubId.name}</span>
                        <span className="md:hidden">{homeClub?.clubId.name.slice(0, 3)}</span>
                        {homeClub?.clubId.logoUrl && (
                          <img
                            src={homeClub.clubId.logoUrl}
                            alt={`${homeClub.clubId.name} logo`}
                            className="w-6 h-6 mx-2"
                          />
                        )}
                        {match.homeGoals} - {match.awayGoals}
                        {awayClub?.clubId.logoUrl && (
                          <img
                            src={awayClub.clubId.logoUrl}
                            alt={`${awayClub.clubId.name} logo`}
                            className="w-6 h-6 mx-2"
                          />
                        )}
                        <span className="hidden md:block">{awayClub?.clubId.name}</span>
                        <span className="md:hidden">{awayClub?.clubId.name.slice(0, 3)}</span>
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(match.matchDate).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
  
  
};

export default DisplayTable;
