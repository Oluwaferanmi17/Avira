"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, Plus, X } from "lucide-react";
import { useHostExperienceStore } from "@/Store/useHostExperienceStore";
import PhotoStep from "@/app/components/PhotoStep";
import { useRouter } from "next/navigation";
import NavBar from "@/app/components/Home/NavBar";

// Schema-aligned types
type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";
type ExperienceCategory =
  | "Tour"
  | "Class"
  | "Workshop"
  | "Hike"
  | "Culture"
  | "Food"
  | "Outdoor";

type StepKey =
  | "basic"
  | "details"
  | "photos"
  | "location"
  | "schedule"
  | "review";

const stepsOrder: StepKey[] = [
  "basic",
  "details", // Added for Duration & Highlights
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

export default function CreateExperiencePage() {
  const router = useRouter();

  const {
    draft,
    setBasic,
    setDetails, // You need to add this to your store
    setLocation,
    addPhotos,
    removePhoto,
    setSchedule,
    reset,
  } = useHostExperienceStore();

  const [step, setStep] = useState<StepKey>("basic");
  // Local state for adding a highlight before pushing to store
  const [tempHighlight, setTempHighlight] = useState("");

  const stepIndex = stepsOrder.indexOf(step);

  // VALIDATION LOGIC
  const basicValid = useMemo(() => {
    return (
      draft.title.trim().length >= 5 &&
      draft.description.trim().length >= 20 &&
      !!draft.category
    );
  }, [draft]);

  const detailsValid =
    draft.duration &&
    draft.duration.length > 0 &&
    draft.highlights &&
    draft.highlights.length >= 1;

  const photosValid = draft.photos.length >= 1;

  const locationValid = draft.location.country && draft.location.city;

  const scheduleValid =
    draft.schedule.availableDays &&
    draft.schedule.availableDays.length > 0 &&
    draft.schedule.price > 0;

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

  // Highlights Helper
  const addHighlight = () => {
    if (!tempHighlight.trim()) return;
    const currentHighlights = draft.highlights || [];
    setDetails({ highlights: [...currentHighlights, tempHighlight] });
    setTempHighlight("");
  };

  const removeHighlight = (index: number) => {
    const current = draft.highlights || [];
    setDetails({ highlights: current.filter((_, i) => i !== index) });
  };

  // Weekday Helper
  const toggleDay = (day: WeekDay) => {
    const currentDays = draft.schedule.availableDays || [];
    if (currentDays.includes(day)) {
      setSchedule({
        availableDays: currentDays.filter((d: WeekDay) => d !== day),
      });
    } else {
      setSchedule({ availableDays: [...currentDays, day] });
    }
  };

  async function handlePublish() {
    try {
      // Payload matching your Prisma Schema
      const payload = {
        title: draft.title,
        description: draft.description,
        category: draft.category,
        duration: draft.duration,
        price: draft.schedule.price, // Int
        photos: draft.photos,
        country: draft.location.country,
        city: draft.location.city,
        venue: draft.location.venue,
        highlights: draft.highlights,
        availableDays: draft.schedule.availableDays, // WeekDay[]
      };

      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
        return;
      }

      await res.json();
      alert("Experience published successfully!");
      reset();
      router.push("/host/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  }

  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <NavBar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Link href="/host/dashboard">
              <button className="flex items-center gap-1 border rounded-md px-3 py-1 text-sm bg-white hover:bg-slate-50 transition">
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Host an Experience
            </h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8">
            <div className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm">
              {/* --- STEP 1: BASIC INFO --- */}
              {step === "basic" && (
                <>
                  <StepHeader
                    title="Basic Info"
                    desc="Start with the essentials."
                  />

                  <label className="label-style">Experience Title</label>
                  <input
                    className="input-style"
                    value={draft.title}
                    onChange={(e) => setBasic({ title: e.target.value })}
                    placeholder="e.g., Sunset Kayaking in Lagos"
                  />

                  <label className="label-style mt-4">Category</label>
                  <select
                    className="input-style"
                    value={draft.category}
                    onChange={(e) =>
                      setBasic({
                        category: e.target.value as ExperienceCategory,
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    <option value="Tour">Tour</option>
                    <option value="Class">Class</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Food">Food</option>
                    <option value="Culture">Culture</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>

                  <label className="label-style mt-4">Description</label>
                  <textarea
                    className="input-style min-h-[120px]"
                    value={draft.description}
                    onChange={(e) => setBasic({ description: e.target.value })}
                    placeholder="Describe what makes this experience unique..."
                  />
                </>
              )}

              {/* --- STEP 2: DETAILS (Duration & Highlights) --- */}
              {step === "details" && (
                <>
                  <StepHeader
                    title="Details & Highlights"
                    desc="Give guests more specifics."
                  />

                  <label className="label-style">Duration</label>
                  <input
                    className="input-style"
                    value={draft.duration || ""}
                    onChange={(e) => setDetails({ duration: e.target.value })}
                    placeholder="e.g. 2 hours, 1 day, 30 mins"
                  />

                  <label className="label-style mt-4">
                    Highlights (Add at least 1)
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="input-style"
                      value={tempHighlight}
                      onChange={(e) => setTempHighlight(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addHighlight()}
                      placeholder="e.g. Traditional lunch included"
                    />
                    <button
                      onClick={addHighlight}
                      className="bg-slate-900 text-white px-4 rounded-md hover:bg-slate-800"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Highlights List */}
                  <ul className="mt-4 space-y-2">
                    {draft.highlights?.map((h: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center justify-between bg-slate-50 p-2 rounded border"
                      >
                        <span className="text-sm text-slate-700">• {h}</span>
                        <button
                          onClick={() => removeHighlight(i)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* --- STEP 3: PHOTOS --- */}
              {step === "photos" && (
                <PhotoStep
                  draft={draft}
                  addPhoto={addPhotos}
                  removePhoto={removePhoto}
                  photosValid={photosValid}
                />
              )}

              {/* --- STEP 4: LOCATION --- */}
              {step === "location" && (
                <>
                  <StepHeader title="Location" desc="Where will you meet?" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-style">Country</label>
                      <input
                        className="input-style"
                        value={draft.location.country}
                        onChange={(e) =>
                          setLocation({ country: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="label-style">City</label>
                      <input
                        className="input-style"
                        value={draft.location.city}
                        onChange={(e) => setLocation({ city: e.target.value })}
                      />
                    </div>
                  </div>

                  <label className="label-style mt-4">
                    Venue / Meeting Point (Optional)
                  </label>
                  <input
                    className="input-style"
                    value={draft.location.venue || ""}
                    onChange={(e) => setLocation({ venue: e.target.value })}
                    placeholder="e.g. National Museum Entrance"
                  />
                </>
              )}

              {/* --- STEP 5: SCHEDULE (Recurring Days) --- */}
              {step === "schedule" && (
                <>
                  <StepHeader
                    title="Schedule & Price"
                    desc="When is this available?"
                  />

                  <label className="label-style mb-2 block">
                    Price per person (₦)
                  </label>
                  <input
                    type="number"
                    className="input-style mb-6"
                    value={draft.schedule.price || ""}
                    onChange={(e) =>
                      setSchedule({ price: Number(e.target.value) })
                    }
                  />

                  <label className="label-style mb-3 block">
                    Available Days
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      "MONDAY",
                      "TUESDAY",
                      "WEDNESDAY",
                      "THURSDAY",
                      "FRIDAY",
                      "SATURDAY",
                      "SUNDAY",
                    ].map((day) => {
                      const isSelected = draft.schedule.availableDays?.includes(
                        day as WeekDay,
                      );
                      return (
                        <button
                          key={day}
                          onClick={() => toggleDay(day as WeekDay)}
                          className={`py-3 px-2 text-xs sm:text-sm font-medium rounded-lg border transition-all ${
                            isSelected
                              ? "bg-[#00b894] text-white border-[#00b894]"
                              : "bg-white text-slate-600 border-slate-200 hover:border-[#00b894]"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* --- STEP 6: REVIEW --- */}
              {step === "review" && (
                <>
                  <StepHeader title="Review" desc="Ready to publish?" />
                  <div className="bg-slate-50 p-6 rounded-lg border space-y-3">
                    <h3 className="text-xl font-bold">{draft.title}</h3>
                    <p className="text-slate-600">{draft.description}</p>
                    <hr className="border-slate-200" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-semibold block">Price:</span> ₦
                        {draft.schedule.price}
                      </div>
                      <div>
                        <span className="font-semibold block">Duration:</span>{" "}
                        {draft.duration}
                      </div>
                      <div>
                        <span className="font-semibold block">Location:</span>{" "}
                        {draft.location.city}, {draft.location.country}
                      </div>
                      <div>
                        <span className="font-semibold block">Days:</span>{" "}
                        {draft.schedule.availableDays?.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded border border-emerald-200">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-medium">
                      All set! Your experience is ready to go live.
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* --- ACTION BUTTONS --- */}
            <div className="flex items-center gap-3 pt-6">
              {step !== "basic" && (
                <button
                  onClick={goPrev}
                  className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition"
                >
                  Back
                </button>
              )}

              <button
                onClick={step === "review" ? handlePublish : goNext}
                disabled={
                  (step === "basic" && !basicValid) ||
                  (step === "details" && !detailsValid) ||
                  (step === "photos" && !photosValid) ||
                  (step === "location" && !locationValid) ||
                  (step === "schedule" && !scheduleValid)
                }
                className={`px-6 py-2.5 rounded-lg text-white font-medium transition ml-auto ${
                  step === "review"
                    ? "bg-slate-900 hover:bg-slate-800"
                    : "bg-[#00b894] hover:bg-[#00a180]"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {step === "review" ? "Publish Experience" : "Next Step"}
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Styles Helper */}
      <style jsx>{`
        .input-style {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          padding: 0.6rem 1rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-style:focus {
          border-color: #00b894;
          box-shadow: 0 0 0 1px #00b894;
        }
        .label-style {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #334155;
          margin-bottom: 0.4rem;
        }
      `}</style>
    </main>
  );
}
