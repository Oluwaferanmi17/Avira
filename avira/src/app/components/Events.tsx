"use client";
import { Heart, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { Calendar } from "@/components/ui/calendar";
const Events = () => {
  const events = [
    {
      name: "Ojude Oba Festival",
      location: "Ijebu-Ode, Ogun State",
      date: "August 2025",
      image: "photo-1466442929976-97f336a657be",
      stays: "12 stays nearby",
    },
    {
      name: "Calabar Carnival",
      location: "Calabar, Cross River",
      date: "December 2025",
      image: "photo-1472396961693-142e6e269027",
      stays: "8 stays nearby",
    },
    {
      name: "TechFest Lagos",
      location: "Landmark Center, Lagos",
      date: "August 2025",
      image:
        "https://images.unsplash.com/photo-1652965784451-33fd5195c2e3?auto=format&fit=crop&w=600&q=80",
      stays: "5 stays nearby",
    },
  ];
  return (
    <section className="py-16 bg-white px-6 md:px-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Upcoming Events To Plan For
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {events.map((event, index) => (
          <Card
            key={index}
            className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={`https://images.unsplash.com/${event.image}?auto=format&fit=crop&w=800&q=80`}
                alt={event.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm hover:bg-[#25453f]">
                  {event.stays}
                </Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800">
                {event.name}
              </CardTitle>
              <div className="flex items-center text-gray-600 space-x-4">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">{event.date}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link href={`/stays?city=${event.location}`}>
                <Button className="w-full bg-gradient-to-r from-[#00b894] to-[#00b894] hover:from-[#00b894] hover:to-[#007860] text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Trip Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
export default Events;
