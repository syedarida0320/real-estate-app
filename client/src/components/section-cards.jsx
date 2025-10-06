import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import property images (replace with actual paths in your assets folder)
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export function SectionCards() {
  return (
    <div className="px-4 lg:px-0">
      {/* Property List with Tabs */}
      <Card className="shadow-sm mt-12">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h3 className="md:text-lg text-[18px] font-semibold">
              Property List
            </h3>

            {/* Tabs Section */}
            <Tabs defaultValue="popular" className="w-full md:w-auto">
              <TabsList className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:flex md:space-x-2">
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="newest">Newest</TabsTrigger>
                <TabsTrigger value="recent">Most Recent</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>

        <CardContent>
          {/* Example static properties */}
          <div className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 md:gap-3 w-full gap-6">
              <Card className="p-0 md:m-0 mt-[10px]">
                <CardContent className="p-1">
                  <img
                    src={property1}
                    alt="property"
                    className="w-full md:h-40 h-50 object-cover rounded-lg"
                  />
                  <h4 className="mt-3 font-semibold">
                    Star Sun Hotel & Apartment
                  </h4>
                 <div className="flex flex-row justify-between px-1">
                   <p className="text-sm text-gray-500">North Carolina, USA</p>
                  <span className="text-blue-600 font-bold">$500</span>
                 </div>
                </CardContent>
              </Card>

            
            <Card className="p-0 md:m-0 mt-[10px]">
              <CardContent className="p-1">
                <img
                  src={property2}
                  alt="property"
                  className="w-full md:h-40 h-50 object-cover rounded-lg"
                />
                <h4 className="mt-3 font-semibold">
                  Letdo Ji Hotel & Apartment
                </h4>
               <div className="flex flex-row justify-between px-1">
                 <p className="text-sm text-gray-500">New York City, USA</p>
                <span className="text-blue-600 font-bold">$500</span>
               </div>
              </CardContent>
            </Card>

            <Card className="p-0 md:m-0 mt-[10px]">
              <CardContent className="p-1">
                <img
                  src={property3}
                  alt="property"
                  className="w-full md:h-40 h-50 object-cover rounded-lg"
                />
                <h4 className="mt-3 font-semibold">Metro Jayakar Apartment</h4>
               <div className="flex flex-row justify-between px-1">
                 <p className="text-sm text-gray-500">North Carolina, USA</p>
                <span className="text-blue-600 font-bold">$500</span>
               </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
