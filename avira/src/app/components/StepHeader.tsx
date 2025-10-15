"use client";
export default function StepHeader({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
  );
}
