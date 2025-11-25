import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Home,
  Building,
  Hotel,
  Car,
  Map,
  Store,
  MoveUpRight,
} from "lucide-react";

// Mapping property types to icons
const typeIcons = {
  house: Home,
  apartment: Building,
  hotel: Hotel,
  garages: Car,
  lots: Map,
  commercial: Store,
};

const ApartmentTypes = ({ propertyTypes = [] }) => {
  const navigate = useNavigate();

  return (
    <section className="max-w-6xl mx-auto px-10 py-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Apartment Types</h2>

        <a
          href="/properties/search"
          className="text-sm flex font-semibold hover:underline"
        >
          View All Types
          <MoveUpRight className="text-gray-500 ml-2 w-5 h-5" />
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {propertyTypes.slice(0, 6).map((type, i) => {
          // Dynamically choose icon
          const Icon = typeIcons[type.toLowerCase()] || Home;

          return (
            <div
              key={i}
              onClick={() => navigate(`/properties/search?type=${type}`)}
              className="cursor-pointer group bg-white shadow-md p-6 rounded-xl flex flex-col items-center justify-center hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition">
                <Icon className="w-8 h-8 text-gray-700 group-hover:text-black" />
              </div>

              {/* Type Name */}
              <h3 className="mt-4 text-lg font-semibold text-gray-800 text-center">
                {type}
              </h3>

              {/* Explore Link */}
              <p className="text-sm text-gray-500 group-hover:text-gray-700 mt-1 flex items-center">
                Explore
                <MoveUpRight className="w-4 h-4 ml-1" />
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ApartmentTypes;
