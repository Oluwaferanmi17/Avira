"use client";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";

export default function AddEventForm({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  // Mock state
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    category: "Cultural",
    location: "",
    date: "",
    price: "",
    capacity: "",
    photos: [] as string[],
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handlePublish = () => {
    alert("🎉 Event Published (mock)!");
    onClose();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
      <h2 className="text-xl font-bold mb-4">Add New Event</h2>

      {/* Step Content */}
      {step === 1 && (
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Event Title"
            className="w-full border rounded-lg px-3 py-2"
          />
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Event Description"
            className="w-full border rounded-lg px-3 py-2"
          />
          <select
            name="category"
            value={eventData.category}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          >
            <option>Cultural</option>
            <option>Business</option>
            <option>Music</option>
            <option>Sports</option>
          </select>
          <input
            type="text"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            placeholder="Event Location"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="text-gray-600 mb-2">Upload Event Photos (mock)</p>
          <div className="border-2 border-dashed rounded-lg p-6 text-center text-gray-500">
            Drag & drop or click to upload
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            name="price"
            value={eventData.price}
            onChange={handleChange}
            placeholder="Ticket Price (₦)"
            className="w-full border rounded-lg px-3 py-2"
          />
          <input
            type="number"
            name="capacity"
            value={eventData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      )}

      {step === 4 && (
        <div>
          <h3 className="font-semibold mb-3">Review Your Event</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              <strong>Title:</strong> {eventData.title}
            </li>
            <li>
              <strong>Description:</strong> {eventData.description}
            </li>
            <li>
              <strong>Category:</strong> {eventData.category}
            </li>
            <li>
              <strong>Location:</strong> {eventData.location}
            </li>
            <li>
              <strong>Date:</strong> {eventData.date}
            </li>
            <li>
              <strong>Price:</strong> ₦{eventData.price}
            </li>
            <li>
              <strong>Capacity:</strong> {eventData.capacity}
            </li>
          </ul>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            <FaArrowLeft /> Back
          </button>
        ) : (
          <span />
        )}

        {step < 4 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-4 py-2 bg-[#00b894] text-white rounded-lg hover:bg-[#019a7a]"
          >
            Next <FaArrowRight />
          </button>
        ) : (
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FaCheck /> Publish
          </button>
        )}
      </div>
    </div>
  );
}
