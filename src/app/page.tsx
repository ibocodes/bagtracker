import React from "react";
import Image from "next/image";
import MapView from "./MapView";

const steps = [
  { name: "Checked in", completed: true },
  { name: "Loaded", completed: true },
  { name: "Arrived", completed: false },
  { name: "On belt", completed: false },
];

export default function Home() {
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
            />
            <button className="ml-2 bg-blue-600 text-white rounded-xl p-2 px-4">
              Track
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

        <section  className="mt-10 ">
          <p>Status</p>
          <div className="flex justify-center gap-2 items-center">
            <Image
              src="/image/airplane-svgrepo-com.svg"
              alt="Airplane"
              width={30}
              height={10}
            />
            <span>Loaded into the aircraft</span>
          </div>

          <div>
            <Image
              src="/image/exclamation-mark-round-svgrepo-com.svg"
              alt="Airplane"
              width={100}
              height={100}
            />
            <span>Your bag is arriving on time</span>
          </div>
        </section>
      </div>
    </>
  );
}
