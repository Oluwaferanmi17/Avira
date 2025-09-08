/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Heart,
  Trash2,
  Plus,
  Download,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import NavBar from "../../components/NavBar";
const Trips = () => {
  const [savedEvents] = useState([
    {
      id: 1,
      type: "event",
      name: "Ojude Oba Festival",
      location: "Ijebu-Ode, Ogun State",
      date: "August 15-17, 2024",
      image: "photo-1466442929976-97f336a657be",
      price: "Free",
      category: "Cultural Festival",
    },
    {
      id: 2,
      type: "event",
      name: "Calabar Carnival",
      location: "Calabar, Cross River",
      date: "December 1-31, 2024",
      image: "photo-1472396961693-142e6e269027",
      price: "Free",
      category: "Street Carnival",
    },
  ]);
  const [savedStays] = useState([
    {
      id: 1,
      type: "stay",
      name: "Luxury Apartment in Victoria Island",
      location: "Victoria Island, Lagos",
      checkIn: "Aug 14, 2024",
      checkOut: "Aug 18, 2024",
      price: "₦35,000",
      rating: 4.8,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      type: "stay",
      name: "Cozy Studio near Calabar Beach",
      location: "Calabar, Cross River",
      checkIn: "Nov 30, 2024",
      checkOut: "Dec 5, 2024",
      price: "₦18,000",
      rating: 4.6,
      image: "/placeholder.svg",
    },
  ]);
  const [savedExperiences] = useState([
    {
      id: 1,
      type: "experience",
      name: "Lagos Food & Culture Tour",
      location: "Victoria Island, Lagos",
      duration: "4-5 hours",
      price: "₦8,000",
      rating: 4.9,
      image: "photo-1466442929976-97f336a657be",
      category: "Food Tour",
    },
  ]);
  const allSavedItems = [...savedEvents, ...savedStays, ...savedExperiences];
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="bg-gradient-to-r from-green-300 to-green-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-2">My Trip Plan</h1>
          <p className="text-center text-lg opacity-90">
            Plan your perfect Nigerian adventure
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Trip Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button className="bg-[#00b894] hover:bg-[#018c71]">
            <Download className="w-4 h-4 mr-2" />
            Export Itinerary
          </Button>
          <Button variant="outline">
            <Share2 className="w-4 h-4 mr-2" />
            Share Trip
          </Button>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Item
          </Button>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All Items ({allSavedItems.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              Events ({savedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="stays">Stays ({savedStays.length})</TabsTrigger>
            <TabsTrigger value="experiences">
              Experiences ({savedExperiences.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allSavedItems.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="max-w-sm bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48  overflow-hidden">
                    <img
                      src={
                        item.image?.includes("photo-")
                          ? `https://images.unsplash.com/${item.image}?auto=format&fit=crop&w=400&q=80`
                          : item.image
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-[#00b894] hover:bg-[#018c71] text-white backdrop-blur-sm">
                        {item.type === "event" && "🎉 Event"}
                        {item.type === "stay" && "🏠 Stay"}
                        {item.type === "experience" && "🎯 Experience"}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="rounded-full bg-white/90 hover:bg-white p-2 shadow hover:scale-105 transition-all duration-300">
                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1" />
                      {item.location}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2 mb-4">
                      {item.type === "event" && (
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {(item as any).date}
                        </div>
                      )}
                      {item.type === "stay" && (
                        <div className="flex items-center text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {(item as any).checkIn} - {(item as any).checkOut}
                        </div>
                      )}
                      {item.type === "experience" && (
                        <div className="flex items-center text-sm">
                          <Clock className="w-3 h-3 mr-1" />
                          {(item as any).duration}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-600">
                        {item.price}
                      </span>
                      <button className="p-2 text-red-500 hover:text-black cursor-pointer hover:bg-gray-100 transition rounded-md border">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedEvents.map((event) => (
                <div
                  key={event.id}
                  className="max-w-sm bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${event.image}?auto=format&fit=crop&w=400&q=80`}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-[#00b894] hover:bg-[#018c71] text-white backdrop-blur-sm">
                      {event.category}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {event.name}
                    </h3>
                    <p className="text-gray-500 text-sm">{event.location}</p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{event.date}</span>
                      <button className="p-2 text-red-500 hover:text-black cursor-pointer hover:bg-gray-100 transition rounded-md border">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="stays" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedStays.map((stay) => (
                <div
                  key={stay.id}
                  className="max-w-sm bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-video bg-muted">
                    <img
                      src={stay.image}
                      alt={stay.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {stay.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {stay.location}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        {stay.checkIn} - {stay.checkOut}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600">
                          {stay.price}/night
                        </span>
                        <button className="p-2 text-red-500 hover:text-black cursor-pointer hover:bg-gray-100 transition rounded-md border">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experiences" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedExperiences.map((experience) => (
                <div
                  key={experience.id}
                  className="max-w-sm bg-white rounded-2xl shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${experience.image}?auto=format&fit=crop&w=400&q=80`}
                      alt={experience.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-[#00b894] hover:bg-[#018c71] text-white backdrop-blur-sm">
                      {experience.category}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {experience.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {experience.location}
                    </p>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-green-600">
                        {experience.price}
                      </span>
                      <button className="p-2 text-red-500 hover:text-black cursor-pointer hover:bg-gray-100 transition rounded-md border">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default Trips;
