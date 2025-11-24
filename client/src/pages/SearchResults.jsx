import { useSearchParams, Link } from "react-router-dom";
import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import PropertyCards from "@/components/PropertyCards";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SearchResults() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [results, setResults] = useState([]);

  const keyword = params.get("search") || "";
  const type = params.get("type") || "";
  const status = params.get("status") || "";

  // Map raw status values to human-readable text
  const statusTextMap = {
    for_sale: "for-sale",
    for_rent: "for-rent",
  };

  const readableStatus = statusTextMap[status] || "";

  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        const { data } = await axios.get(
          `/properties/all?${params.toString()}`
        );
        setResults(data.data.properties);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFiltered();
  }, [params]);

  const buildHeading = () => {
    if (keyword && type && readableStatus) {
      return `${type} for ${readableStatus} in ${keyword}`;
    }
    if (keyword && type) {
      return `${type} in ${keyword}`;
    }
    if (keyword && readableStatus) {
      return `${keyword} - ${readableStatus} properties`;
    }
    if (keyword) {
      return `Properties in ${keyword}`;
    }
    if (type) {
      return `${type} properties`;
    }
    if (readableStatus) {
      return `${readableStatus} properties`;
    }
    return "All Properties";
  };

  return (
    <div className="p-10">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 flex flex-wrap gap-2 items-center">
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <ChevronRight size={16} className="text-gray-500" />
          <span className="text-gray-800 font-medium">{buildHeading()}</span>
        </div>
      </div>

      {/* Search Result Summary */}
      <div className="bg-gray-100 p-4 rounded-lg mb-10">
        <p className="text-lg font-semibold text-gray-700">
          Showing {results.length} properties
          {keyword && (
            <>
              {" "}
              for "<span className="text-black">{keyword}</span>"
            </>
          )}
          {type && (
            <>
              {" "}
              in "<span className="text-black">{type}</span>"
            </>
          )}
        </p>
      </div>

      {/* RESULTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {results.length > 0 ? (
          results.map((p, i) => <PropertyCards key={i} property={p} />)
        ) : (
          <p>No properties found.</p>
        )}
      </div>
    </div>
  );
}
