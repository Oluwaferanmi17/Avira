"use client";
import dynamic from "next/dynamic";
// Dynamically import the Map component with SSR disabled
const AviraMap = dynamic(() => import("./AviraMapCore"), {
  ssr: false,
});
export default AviraMap;
