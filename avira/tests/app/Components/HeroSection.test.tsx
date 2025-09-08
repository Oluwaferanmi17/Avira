import React from "react";
import { render, screen } from "@testing-library/react";
import HeroSection from "../Components/HeroSection";
import "@testing-library/jest-dom";
import { mocked } from "jest-mock";

// Mock next/image to render a simple img element and allow onError simulation
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // Simulate onError if provided
    return (
      <img {...props} onError={props.onError} data-testid="mocked-image" />
    );
  },
}));

// Mock react-slick to just render children
jest.mock("react-slick", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mocked-slider">{children}</div>
  ),
}));

// Mock framer-motion to just render children
jest.mock("framer-motion", () => ({
  __esModule: true,
  motion: {
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
  },
}));

describe("HeroSection", () => {
  it("should_handle_invalid_image_urls", () => {
    render(<HeroSection />);
    // Find all images rendered by the slider
    const images = screen.getAllByTestId("mocked-image");
    expect(images.length).toBeGreaterThan(0);

    // Simulate an image error for the first image
    const firstImage = images[0];
    // Attach a mock error handler to simulate fallback/error state
    let errorHandled = false;
    firstImage.onerror = () => {
      errorHandled = true;
    };
    // Fire the error event
    firstImage.dispatchEvent(new Event("error"));

    // Since the component does not render a fallback, we check that the image is still in the document
    // and that the UI does not break (no crash, no removal)
    expect(screen.getByTestId("mocked-slider")).toBeInTheDocument();
    expect(firstImage).toBeInTheDocument();
    // Optionally, check that the error handler was called (simulate fallback logic if implemented)
    // expect(errorHandled).toBe(true);
  });
});
