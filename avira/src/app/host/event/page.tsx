"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { useHostEventStore } from "@/Store/useHostEventStore";
import PhotoStep from "@/app/components/PhotoStep";
type StepKey = "basic" | "photos" | "location" | "schedule" | "review";
const stepsOrder: StepKey[] = [
  "basic",
  "photos",
  "location",
  "schedule",
  "review",
];
function ProgressStep({ active, done }: { active: boolean; done?: boolean }) {
  const base = "h-2 w-2 rounded-full";
  const cls = active
    ? "bg-emerald-600"
    : done
    ? "bg-emerald-300"
    : "bg-slate-300";
  return <div className={`${base} ${cls}`} />;
}
function StepHeader({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      {desc ? <p className="text-sm text-slate-600 mt-1">{desc}</p> : null}
    </div>
  );
}
export default function CreateEventPage() {
  const {
    draft,
    setBasic,
    setLocation,
    addPhotos,
    removePhoto,
    setSchedule,
    reset,
  } = useHostEventStore();
  const [step, setStep] = useState<StepKey>("basic");
  const stepIndex = stepsOrder.indexOf(step);
  const basicValid = useMemo(() => {
    return (
      draft.title.trim().length >= 5 &&
      draft.description.trim().length >= 20 &&
      !!draft.category
    );
  }, [draft]);
  const photosValid = draft.photos.length >= 1;
  const locationValid =
    draft.location.country && draft.location.city && draft.location.venue;
  const scheduleValid =
    draft.schedule.dates.length > 0 &&
    draft.schedule.ticketPrice > 0 &&
    draft.schedule.capacity > 0;
  function goNext() {
    const idx = stepsOrder.indexOf(step);
    const next = stepsOrder[idx + 1];
    if (next) setStep(next);
  }
  function goPrev() {
    const idx = stepsOrder.indexOf(step);
    const prev = stepsOrder[idx - 1];
    if (prev) setStep(prev);
  }
  function handlePublish() {
    alert("Your event has been published (demo).");
    reset();
  }
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/host/dashboard">
              <button className="flex items-center gap-1 border rounded-md px-3 py-1 text-sm hover:bg-slate-100 transition">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            </Link>
            <h1 className="text-xl font-semibold">Host an Event</h1>
          </div>
          <div className="flex items-center gap-2">
            {stepsOrder.map((_, i) => (
              <ProgressStep
                key={i}
                active={i === stepIndex}
                done={i < stepIndex}
              />
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8">
            <div className="rounded-xl border border-slate-200 p-5 bg-white shadow-sm">
              {step === "basic" && (
                <>
                  <StepHeader
                    title="Basic Info"
                    desc="Set your event title, description, and category."
                  />
                  <label className="block text-sm font-medium text-slate-700">
                    Title
                  </label>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={draft.title}
                    onChange={(e) => setBasic({ title: e.target.value })}
                    placeholder="e.g., Afrobeat Summer Festival"
                  />
                  <label className="block text-sm font-medium text-slate-700 mt-4">
                    Description
                  </label>
                  <textarea
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={draft.description}
                    onChange={(e) => setBasic({ description: e.target.value })}
                    placeholder="Tell people about your event..."
                  />
                  <label className="block text-sm font-medium text-slate-700 mt-4">
                    Category
                  </label>
                  <select
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={draft.category}
                    onChange={(e) => setBasic({ category: e.target.value })}
                  >
                    <option value="">Choose a category</option>
                    <option value="Music">Music</option>
                    <option value="Festival">Festival</option>
                    <option value="Culture">Culture</option>
                    <option value="Film">Film</option>
                    <option value="Art">Art</option>
                  </select>
                </>
              )}
              {step === "photos" && (
                <PhotoStep
                  draft={draft}
                  addPhoto={addPhotos}
                  removePhoto={removePhoto}
                  photosValid={photosValid}
                />
              )}
              {step === "location" && (
                <>
                  <StepHeader
                    title="Location"
                    desc="Where is your event taking place?"
                  />
                  <label className="block text-sm font-medium text-slate-700">
                    Country
                  </label>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={draft.location.country}
                    onChange={(e) => setLocation({ country: e.target.value })}
                  />
                  <label className="block text-sm font-medium text-slate-700 mt-4">
                    City
                  </label>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={draft.location.city}
                    onChange={(e) => setLocation({ city: e.target.value })}
                  />
                  <label className="block text-sm font-medium text-slate-700 mt-4">
                    Venue
                  </label>
                  <input
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                    value={draft.location.venue}
                    onChange={(e) => setLocation({ venue: e.target.value })}
                  />
                </>
              )}
              {step === "schedule" && (
                <>
                  <StepHeader
                    title="Schedule & Tickets"
                    desc="Pick event dates, ticket price, and capacity."
                  />
                  {/* Replace with your custom calendar later */}
                  <div className="border rounded-md p-4 text-sm text-slate-600 bg-slate-50">
                    Calendar component placeholder
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        Ticket Price (₦)
                      </label>
                      <input
                        type="number"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        value={draft.schedule.ticketPrice}
                        onChange={(e) =>
                          setSchedule({ ticketPrice: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">
                        Capacity
                      </label>
                      <input
                        type="number"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500"
                        value={draft.schedule.capacity}
                        onChange={(e) =>
                          setSchedule({ capacity: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
              {step === "review" && (
                <>
                  <StepHeader
                    title="Review & Publish"
                    desc="Check everything before publishing your event."
                  />
                  <div className="border rounded-lg p-4 bg-slate-50">
                    <h3 className="text-lg font-medium">
                      {draft.title || "Untitled Event"}
                    </h3>
                    <p className="mt-2 text-sm text-slate-700">
                      {draft.description}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {draft.location.venue}, {draft.location.city},{" "}
                      {draft.location.country}
                    </p>
                  </div>
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 mt-4 text-emerald-800 text-sm inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" /> Looks good! Ready to
                    publish.
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 pt-4">
              {step !== "basic" && (
                <button
                  className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                  onClick={goPrev}
                >
                  Back
                </button>
              )}
              {step !== "review" ? (
                <button
                  className="px-4 py-2 rounded-md bg-[#00b894] text-white hover:bg-[#00a57e] transition"
                  onClick={goNext}
                  disabled={
                    (step === "basic" && !basicValid) ||
                    (step === "photos" && !photosValid) ||
                    (step === "location" && !locationValid) ||
                    (step === "schedule" && !scheduleValid)
                  }
                >
                  Next
                </button>
              ) : (
                <button
                  className="px-4 py-2 rounded-md bg-[#00b894] text-white hover:bg-[#00a57e] transition"
                  onClick={handlePublish}
                >
                  Publish Event
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
