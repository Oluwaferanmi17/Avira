"use client";
export default function StepHeader({ title }: { title: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
