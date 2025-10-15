/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import Link from "next/link";
import { useMemo } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, ChevronLeft, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHostCreateStore } from "@/Store/useHostCreateStore";
import PhotoStep from "../../components/PhotoStep";
import PhotoGrid from "../../components/PhotoGrid";
import { Calendar } from "../../../components/ui/calendar";
import { toast } from "react-hot-toast";
type StepKey =
  | "basic"
  | "photos"
  | "location"
  | "pricing"
  | "amenities"
  | "review";
const stepsOrder: StepKey[] = [
  "basic",
  "photos",
  "location",
  "pricing",
  "amenities",
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
const ALL_AMENITIES = [
  "Wi‑Fi",
  "Air conditioning",
  "Kitchen",
  "Washer",
  "Workspace",
  "Free parking",
  "Breakfast",
  "Pool",
  "Ocean view",
  "Gym access",
];
const DEFAULT_RULES = [
  "No smoking",
  "No pets",
  "No parties",
  "Quiet hours after 10pm",
];
export default function CreateStayPage() {
  const {
    // draft,
    setBasic,
    addPhoto,
    removePhoto,
    setAddress,
    // setPricing,
    toggleAmenity,
    reset,
    // New actions
    setCapacity,
    toggleRule,
    setAdditionalRules,
  } = useHostCreateStore();
  const draft = useHostCreateStore((s) => s.draft);
  const setPricing = useHostCreateStore((s) => s.setPricing);
  const unavailable = useHostCreateStore(
    (s) => s.draft.availability.unavailable
  );
  const setAvailability = useHostCreateStore((s) => s.setAvailability);
  const [step, setStep] = useState<StepKey>("basic");
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
  const basicValid = useMemo(() => {
    const t = draft.title.trim();
    const d = draft.description.trim();
    const typeOk = !!draft.homeType;
    const capacityOk = draft.capacity.guests >= 1;
    return t.length >= 5 && d.length >= 20 && typeOk && capacityOk;
  }, [draft.title, draft.description, draft.homeType, draft.capacity.guests]);
  const photosValid = draft.photos.length >= 3;
  const locationValid =
    draft.address.country.trim().length > 0 &&
    draft.address.city.trim().length > 0 &&
    draft.address.line1.trim().length > 0;
  const pricingValid =
    draft.pricing.basePrice > 0 && draft.pricing.cleaningFee >= 0;
  const amenitiesValid = draft.amenities.length >= 3;
  function handleNext() {
    if (step === "basic" && !basicValid) return;
    if (step === "photos" && !photosValid) return;
    if (step === "location" && !locationValid) return;
    if (step === "pricing" && !pricingValid) return;
    if (step === "amenities" && !amenitiesValid) return;
    goNext();
  }
  const router = useRouter();
  async function handlePublish() {
    try {
      const res = await fetch("/api/stays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to publish stay");
      }
      toast.success("Listing Created 🎉");
      reset();
      router.push("/host/dashboard");
    } catch (error: any) {
      console.error("Publish error:", error);
      toast.error(error.message || "Something went wrong");
    }
  }
  const stepIndex = stepsOrder.indexOf(step);
  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/host">
              <Button variant="outline" className="bg-transparent" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Create a stay</h1>
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
            <div className="rounded-xl border border-slate-200 p-5">
              {step === "basic" && (
                <>
                  <StepHeader
                    title="Basic details"
                    desc="Introduce your place to guests with a clear title, description, type, capacity, and house rules."
                  />
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="e.g., Cozy apartment near Calabar Carnival"
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
                      value={draft.title}
                      onChange={(e) => setBasic({ title: e.target.value })}
                    />
                    {!basicValid && draft.title.trim().length < 5 ? (
                      <p className="text-xs text-rose-600 mt-1">
                        Title should be at least 5 characters.
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-slate-700 mb-1"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Describe your place and what makes it unique..."
                      rows={5}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition resize-none"
                      value={draft.description}
                      onChange={(e) =>
                        setBasic({ description: e.target.value })
                      }
                    />
                    {!basicValid && draft.description.trim().length < 20 ? (
                      <p className="text-xs text-rose-600 mt-1">
                        Description should be at least 20 characters.
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Home type
                    </label>
                    <select
                      value={draft.homeType}
                      onChange={(e) =>
                        setBasic({
                          homeType: e.target.value as
                            | ""
                            | "entire"
                            | "private"
                            | "shared"
                            | "boutique",
                        })
                      }
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition"
                    >
                      <option value="">Select a type</option>
                      <option value="entire">Entire home</option>
                      <option value="private">Private room</option>
                      <option value="shared">Shared room</option>
                      <option value="boutique">Boutique stay</option>
                    </select>
                    {!basicValid && !draft.homeType ? (
                      <p className="text-xs text-rose-600 mt-1">
                        Please select a home type.
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-6">
                    <StepHeader
                      title="Capacity"
                      desc="Tell guests how many people you can host and sleeping details."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Guests
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={draft.capacity.guests}
                          onChange={(e) =>
                            setCapacity({
                              guests: Math.max(1, Number(e.target.value || 0)),
                            })
                          }
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        {!basicValid && draft.capacity.guests < 1 ? (
                          <p className="text-xs text-rose-600 mt-1">
                            At least 1 guest is required.
                          </p>
                        ) : null}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Bedrooms
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={draft.capacity.bedrooms}
                          onChange={(e) =>
                            setCapacity({
                              bedrooms: Math.max(
                                0,
                                Number(e.target.value || 0)
                              ),
                            })
                          }
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Beds
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={draft.capacity.beds}
                          onChange={(e) =>
                            setCapacity({
                              beds: Math.max(0, Number(e.target.value || 0)),
                            })
                          }
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Baths
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={draft.capacity.baths}
                          onChange={(e) =>
                            setCapacity({
                              baths: Math.max(0, Number(e.target.value || 0)),
                            })
                          }
                          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <StepHeader
                      title="House rules"
                      desc="Set clear expectations for guests."
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {DEFAULT_RULES.map((rule) => {
                        const checked = draft.rules.includes(rule);
                        return (
                          <label
                            key={rule}
                            className="inline-flex items-center gap-2 rounded-md border border-slate-200 p-3 cursor-pointer hover:bg-slate-50"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleRule(rule)}
                              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                            />
                            <span className="text-sm text-slate-700">
                              {rule}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="additional-rules"
                        className="block text-sm font-medium text-slate-700 mb-1"
                      >
                        Additional rules (optional)
                      </label>
                      <textarea
                        id="additional-rules"
                        placeholder="e.g., Please remove shoes indoors. No loud music after 9pm."
                        rows={3}
                        value={draft.additionalRules}
                        onChange={(e) => setAdditionalRules(e.target.value)}
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
                      />
                    </div>
                  </div>
                </>
              )}
              {step === "photos" && (
                <PhotoStep
                  draft={draft}
                  addPhoto={addPhoto}
                  removePhoto={removePhoto}
                  photosValid={photosValid}
                />
              )}
              {step === "location" && (
                <>
                  <StepHeader
                    title="Location"
                    desc="Help guests find your place by providing accurate location details."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <input
                        placeholder="Nigeria"
                        value={draft.address.country}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#00b894] focus:ring focus:ring-[#00b894]/30"
                        onChange={(e) =>
                          setAddress({ country: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        placeholder="Calabar"
                        value={draft.address.city}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#00b894] focus:ring focus:ring-[#00b894]/30"
                        onChange={(e) => setAddress({ city: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Address / Area
                      </label>
                      <input
                        placeholder="e.g., 12 Carnival Road, Green Estate"
                        value={draft.address.line1}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#00b894] focus:ring focus:ring-[#00b894]/30"
                        onChange={(e) => setAddress({ line1: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Latitude (optional)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 4.9513"
                        value={draft.address.lat ?? ""}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#00b894] focus:ring focus:ring-[#00b894]/30"
                        onChange={(e) =>
                          setAddress({
                            lat:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Longitude (optional)
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 8.3220"
                        value={draft.address.lng ?? ""}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-[#00b894] focus:ring focus:ring-[#00b894]/30"
                        onChange={(e) =>
                          setAddress({
                            lng:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  {!locationValid ? (
                    <p className="text-xs text-rose-600 mt-3">
                      Country, city, and address are required.
                    </p>
                  ) : null}
                </>
              )}
              {step === "pricing" && (
                <>
                  <section className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FaCalendarAlt className="text-[#00b894]" /> Pricing
                    </h2>
                    <p className="text-gray-500 mb-4">
                      Set your nightly price and fees.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nightly Price (₦)
                        </label>
                        <input
                          type="number"
                          value={draft.pricing.basePrice ?? ""}
                          onChange={(e) =>
                            setPricing({
                              basePrice: Number(e.target.value),
                            })
                          }
                          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#00b894]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Cleaning Fee (₦)
                        </label>
                        <input
                          type="number"
                          value={draft.pricing.cleaningFee ?? ""}
                          onChange={(e) =>
                            setPricing({
                              cleaningFee: Number(e.target.value),
                            })
                          }
                          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#00b894]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Service Fee (₦)
                        </label>
                        <input
                          type="number"
                          value={draft.pricing.serviceFee ?? ""}
                          onChange={(e) =>
                            setPricing({
                              serviceFee: Number(e.target.value),
                            })
                          }
                          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#00b894]"
                        />
                      </div>
                    </div>
                    <StepHeader
                      title="Availability"
                      desc="Block dates when your place is not available (optional)."
                    />
                    <div className="mb-6 rounded-xl border border-slate-200 p-4">
                      <div className="p-5">
                        <h3 className="text-sm font-medium mb-2">
                          Unavailable dates
                        </h3>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-6">
                        <Calendar
                          mode="multiple"
                          selected={unavailable}
                          onSelect={(dates: any) =>
                            setAvailability(dates || [])
                          }
                          initialFocus
                        />
                        <div className="flex-1">
                          <div className="text-sm text-slate-700">
                            Selected {unavailable.length} date
                            {unavailable.length === 1 ? "" : "s"}.
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition text-sm"
                              onClick={() => setAvailability([])}
                            >
                              Clear dates
                            </button>
                          </div>
                          <div className="text-xs text-slate-600 mt-3">
                            Tip: You can manage seasonal availability later from
                            your dashboard.
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  {!pricingValid ? (
                    <p className="text-xs text-rose-600 mt-3">
                      Base price must be greater than 0.
                    </p>
                  ) : null}
                </>
              )}
              {step === "amenities" && (
                <>
                  <StepHeader
                    title="Amenities"
                    desc="Select amenities guests can expect. Choose at least 3."
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ALL_AMENITIES.map((a) => {
                      const checked = draft.amenities.includes(a);
                      return (
                        <label
                          key={a}
                          className="inline-flex items-center gap-2 rounded-md border border-slate-200 p-3 cursor-pointer hover:bg-slate-50"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleAmenity(a)}
                          />
                          <span className="text-sm text-slate-700">{a}</span>
                        </label>
                      );
                    })}
                  </div>
                  {!amenitiesValid ? (
                    <p className="text-xs text-rose-600 mt-3">
                      Please select at least 3 amenities.
                    </p>
                  ) : null}
                </>
              )}
              {step === "review" && (
                <>
                  <StepHeader
                    title="Review & publish"
                    desc="Confirm your details before publishing your stay."
                  />
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
                      <div className="pb-2  border-slate-200 mb-3">
                        <h3 className="text-sm text-slate-600 font-semibold mb-5">
                          Overview
                        </h3>
                      </div>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div className="font-medium">
                          {draft.title || "Untitled"}
                        </div>
                        <div className="text-slate-600">
                          {draft.description || "No description provided."}
                        </div>
                        <div>
                          <span className="text-slate-600">Type: </span>
                          <span className="font-medium capitalize">
                            {draft.homeType || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
                      <div className="pb-2 border-slate-200 mb-3">
                        <h3 className="text-sm text-slate-600 font-semibold mb-5">
                          Capacity
                        </h3>
                      </div>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div>
                          Guests:{" "}
                          <span className="font-medium">
                            {draft.capacity.guests}
                          </span>
                        </div>
                        <div className="text-slate-700">
                          {draft.capacity.bedrooms} bedrooms •{" "}
                          {draft.capacity.beds} beds • {draft.capacity.baths}{" "}
                          baths
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
                      <div className="pb-2 border-slate-200 mb-3">
                        <h3 className="text-sm text-slate-600 font-semibold mb-5">
                          Photos
                        </h3>
                      </div>
                      <div className="text-sm text-slate-700 space-y-2">
                        <PhotoGrid photos={draft.photos} />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
                      <div className="pb-2 border-slate-200 mb-3">
                        <h3 className="text-sm text-slate-600 font-semibold mb-5">
                          Location
                        </h3>
                      </div>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div className="inline-flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          {draft.address.line1
                            ? `${draft.address.line1}, `
                            : ""}
                          {draft.address.city ? `${draft.address.city}, ` : ""}
                          {draft.address.country || "—"}
                        </div>
                        {draft.address.lat !== undefined &&
                        draft.address.lng !== undefined ? (
                          <div className="text-xs text-slate-600 mt-1">
                            ({draft.address.lat}, {draft.address.lng})
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
                      <div className="pb-2 border-slate-200 mb-3">
                        <h3 className="text-sm text-slate-600 font-semibold mb-5">
                          Pricing
                        </h3>
                      </div>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div className="inline-flex items-center gap-2">
                          <span className="h-4 w-4">₦</span>
                          {draft.pricing.basePrice ?? ""}
                          {draft.pricing.basePrice} / night
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Cleaning fee: {draft.pricing.cleaningFee ?? ""}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
                      <div className="pb-2 border-slate-200 mb-3">
                        <h3 className="text-sm text-slate-600 font-semibold mb-5">
                          Availability
                        </h3>
                      </div>
                      <div className="text-sm text-slate-700 space-y-2">
                        {draft.availability.unavailable.length ? (
                          <div>
                            {draft.availability.unavailable.length} date
                            {draft.availability.unavailable.length === 1
                              ? ""
                              : "s"}{" "}
                            blocked (saved).
                          </div>
                        ) : (
                          <div>No dates blocked.</div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
                      <div className="pb-2 border-slate-200 mb-3">
                        <h3 className="text-sm text-slate-600 font-semibold mb-5">
                          Amenities
                        </h3>
                      </div>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {draft.amenities.length ? (
                            draft.amenities.map((a) => (
                              <span
                                key={a}
                                className="text-xs px-3 py-1 rounded-full border border-slate-200 bg-slate-50"
                              >
                                {a}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-600">
                              No amenities selected.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
                      <div className="pb-2 border-slate-200 mb-3">
                        <h3 className="text-sm text-slate-600 font-semibold mb-5">
                          House rules
                        </h3>
                      </div>
                      <div className="text-sm text-slate-700 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {draft.rules.length ? (
                            draft.rules.map((r) => (
                              <span
                                key={r}
                                className="text-xs px-3 py-1 rounded-full border border-slate-200 bg-slate-50"
                              >
                                {r}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-slate-600">
                              No specific rules selected.
                            </span>
                          )}
                        </div>
                        {draft.additionalRules.trim() ? (
                          <div className="mt-2 text-slate-700">
                            <span className="font-medium">Additional: </span>
                            {draft.additionalRules}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 inline-flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      Everything looks good. You can publish your stay now.
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 pt-4">
              {step !== "basic" && (
                <button
                  className="px-4 py-2 border border-slate-300 rounded-lg bg-transparent text-slate-700 hover:bg-slate-100 transition"
                  onClick={goPrev}
                >
                  Back
                </button>
              )}
              {step !== "review" ? (
                <button
                  onClick={handleNext}
                  className="bg-[#00b894] text-white px-3 py-1 rounded-l hover:bg-[#019a7a]"
                  disabled={
                    (step === "basic" && !basicValid) ||
                    (step === "photos" && !photosValid) ||
                    (step === "location" && !locationValid) ||
                    (step === "pricing" && !pricingValid) ||
                    (step === "amenities" && !amenitiesValid)
                  }
                >
                  Next
                </button>
              ) : (
                <button
                  className="bg-[#00b894] text-white px-3 py-1 rounded-xl hover:bg-[#019a7a]"
                  onClick={handlePublish}
                >
                  Publish
                </button>
              )}
            </div>
          </section>{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
