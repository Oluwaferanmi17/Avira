import React from "react";
import "./loader.css"; // Import the custom animations here

const Loader = () => {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full">
      {/* Outer Circle */}
      <svg className="absolute h-[86px] w-[86px]" viewBox="0 0 86 86">
        <circle
          className="fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round stroke-[#c3c8de] animate-circleOuterBack"
          cx={43}
          cy={43}
          r={40}
        />
        <circle
          className="fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round stroke-[#4f29f0] animate-circleOuterFront"
          cx={43}
          cy={43}
          r={40}
        />
      </svg>

      {/* Middle Circle */}
      <svg className="absolute h-[60px] w-[60px]" viewBox="0 0 60 60">
        <circle
          className="fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round stroke-[#c3c8de] animate-circleMiddleBack"
          cx={30}
          cy={30}
          r={27}
        />
        <circle
          className="fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round stroke-[#4f29f0] animate-circleMiddleFront"
          cx={30}
          cy={30}
          r={27}
        />
      </svg>

      {/* Inner Circle */}
      <svg className="absolute h-[34px] w-[34px]" viewBox="0 0 34 34">
        <circle
          className="fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round stroke-[#c3c8de] animate-circleInnerBack"
          cx={17}
          cy={17}
          r={14}
        />
        <circle
          className="fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round stroke-[#4f29f0] animate-circleInnerFront"
          cx={17}
          cy={17}
          r={14}
        />
      </svg>

      {/* Text */}
      <div className="absolute -bottom-10 text-sm font-medium lowercase tracking-[0.2px] text-[#414856]">
        <span className="relative before:content-['Searching'] after:absolute after:left-0 after:content-['Searching'] after:text-[#4f29f0] after:animate-textClip" />
      </div>
    </div>
  );
};

export default Loader;
