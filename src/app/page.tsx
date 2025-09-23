"use client";
import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

// Define bag status interface
interface BagStatus {
  checkedIn: boolean;
  loaded: boolean;
  arrived: boolean;
  onBelt: boolean;
  currentStatus: string;
  statusMessage: string;
}

export default function Home() {
  // State for bag tracking
  const [bagStatus, setBagStatus] = useState<BagStatus>({
    checkedIn: false,
    loaded: false,
    arrived: false,
    onBelt: false,
    currentStatus: "Not tracked",
    statusMessage: "Enter your bag tag to track your luggage",
  });

  const [inputValue, setInputValue] = useState("");
  const [isTracking, setIsTracking] = useState(false);

  // Dynamic steps based on current bag status
  const steps = [
    { name: "Checked in", completed: bagStatus.checkedIn },
    { name: "Loaded", completed: bagStatus.loaded },
    { name: "Arrived", completed: bagStatus.arrived },
    { name: "On belt", completed: bagStatus.onBelt },
  ];

  // Mock tracking function - replace with real API call
  const handleTrackBag = () => {
    if (!inputValue.trim()) return;

    setIsTracking(true);

    // Simulate API call and progressive status updates
    setTimeout(() => {
      setBagStatus({
        checkedIn: true,
        loaded: false,
        arrived: false,
        onBelt: false,
        currentStatus: "Checked In",
        statusMessage: "Your bag has been checked in successfully",
      });
    }, 1000);

    setTimeout(() => {
      setBagStatus({
        checkedIn: true,
        loaded: true,
        arrived: false,
        onBelt: false,
        currentStatus: "Loaded",
        statusMessage: "Your bag is loaded into the aircraft",
      });
    }, 3000);

    // You can continue this pattern for other statuses
    setTimeout(() => {
      setIsTracking(false);
    }, 3500);
  };

  return (
    <>
      <div className="items-center justify-center">
        <h1 className="text-2xl font-bold text-center mt-5">TRACK YOUR BAG</h1>
        <main className="mt-5 text-center">
          <p>Enter Booking Code or Bag Tag</p>
          <div className="flex justify-center mt-2">
            <input
              type="text"
              placeholder="e.g. AbC123"
              className="border border-gray-300 rounded-md p-2"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              onClick={handleTrackBag}
              disabled={isTracking}
              className="ml-2 bg-blue-600 text-white rounded-xl p-2 px-4 disabled:opacity-50"
            >
              {isTracking ? "Tracking..." : "Track"}
            </button>
          </div>
          <MapView />
        </main>

        <section className="flex items-center justify-center mt-10">
          <div className="flex items-center w-full max-w-xl">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2
                ${
                  step.completed
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
                >
                  {step.completed ? "✓" : ""}
                </div>
                {/* Label */}
                <div className="mt-2 text-sm text-gray-700 text-center">
                  {step.name}
                </div>
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 w-full
                ${
                  steps[index + 1].completed
                    ? "bg-blue-600"
                    : step.completed
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 ml-6">
          <p>Status</p>
          <div className="flex gap-2 mt-4">
            <Image
              src="/image/airplane-svgrepo-com.svg"
              alt="Airplane"
              width={30}
              height={10}
            />
            <span>{bagStatus.statusMessage}</span>
          </div>
          <div className="mt-4">
            <Image
              src="/image/exclamation-mark-round-svgrepo-com.svg"
              alt="Info"
              width={30}
              height={10}
            />
            <span>Current Status: {bagStatus.currentStatus}</span>
          </div>
        </section>
      </div>
    </>
  );
}
