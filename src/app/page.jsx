"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

const BagStatus = {
  checkedIn: false,
  loaded: false,
  arrived: false,
  onBelt: false,
  currentStatus: "",
  statusMessage: "",
  location: "",
  coordinates: null,
  flightNumber: "",
  terminal: "",
  gate: ""
};

const Toast = {
  id: "",
  type: 'success',
  message: "",
  duration: 3000
};

const AirportData = {
  name: "",
  code: "",
  coordinates: [0, 0],
  terminals: [],
  gates: []
};

const airports = {
  'JFK': {
    name: 'John F. Kennedy International Airport',
    code: 'JFK',
    coordinates: [40.6413, -73.7781],
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 4', 'Terminal 5', 'Terminal 7', 'Terminal 8'],
    gates: ['A1-A20', 'B1-B25', 'C1-C30', 'D1-D15']
  },
  'LAX': {
    name: 'Los Angeles International Airport',
    code: 'LAX',
    coordinates: [33.9416, -118.4085],
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 4', 'Terminal 5', 'Terminal 6', 'Terminal 7', 'Terminal 8'],
    gates: ['A1-A15', 'B1-B20', 'C1-C25', 'D1-D10']
  },
  'LHR': {
    name: 'London Heathrow Airport',
    code: 'LHR',
    coordinates: [51.4700, -0.4543],
    terminals: ['Terminal 2', 'Terminal 3', 'Terminal 4', 'Terminal 5'],
    gates: ['A1-A30', 'B1-B25', 'C1-C20', 'D1-D15']
  },
  'CDG': {
    name: 'Charles de Gaulle Airport',
    code: 'CDG',
    coordinates: [49.0097, 2.5479],
    terminals: ['Terminal 1', 'Terminal 2A', 'Terminal 2B', 'Terminal 2C', 'Terminal 2D', 'Terminal 2E', 'Terminal 2F', 'Terminal 3'],
    gates: ['A1-A20', 'B1-B15', 'C1-C25', 'D1-D10']
  }
};

const mockBagDatabase = {
  'JFK123': {
    bagTag: 'JFK123',
    passengerName: 'John Smith',
    flightNumber: 'AA1234',
    airport: 'John F. Kennedy International Airport',
    terminal: 'Terminal 4',
    gate: 'A12',
    status: 'Checked In',
    currentLocation: 'JFK Terminal 4 - Check-in Area',
    coordinates: [40.6413, -73.7781],
    trackingHistory: [
      {
        timestamp: '2024-01-15T10:30:00Z',
        location: 'JFK Terminal 4 - Check-in Area',
        coordinates: [40.6413, -73.7781],
        status: 'Checked In',
        description: 'Bag checked in at Terminal 4'
      },
      {
        timestamp: '2024-01-15T11:15:00Z',
        location: 'JFK Terminal 4 - Loading Bay',
        coordinates: [40.6420, -73.7790],
        status: 'Loaded',
        description: 'Bag loaded onto aircraft AA1234'
      },
      {
        timestamp: '2024-01-15T14:45:00Z',
        location: 'JFK Terminal 5 - Arrival Gate',
        coordinates: [40.6400, -73.7770],
        status: 'Arrived',
        description: 'Bag arrived at destination'
      },
      {
        timestamp: '2024-01-15T15:20:00Z',
        location: 'JFK Terminal 5 - Baggage Claim',
        coordinates: [40.6395, -73.7765],
        status: 'On Belt',
        description: 'Bag ready for pickup'
      }
    ]
  },
  'LAX456': {
    bagTag: 'LAX456',
    passengerName: 'Sarah Johnson',
    flightNumber: 'UA5678',
    airport: 'Los Angeles International Airport',
    terminal: 'Terminal 1',
    gate: 'B8',
    status: 'Loaded',
    currentLocation: 'LAX Terminal 1 - Loading Bay',
    coordinates: [33.9420, -118.4090],
    trackingHistory: [
      {
        timestamp: '2024-01-15T08:45:00Z',
        location: 'LAX Terminal 1 - Check-in Area',
        coordinates: [33.9416, -118.4085],
        status: 'Checked In',
        description: 'Bag checked in at Terminal 1'
      },
      {
        timestamp: '2024-01-15T09:30:00Z',
        location: 'LAX Terminal 1 - Loading Bay',
        coordinates: [33.9420, -118.4090],
        status: 'Loaded',
        description: 'Bag loaded onto aircraft UA5678'
      }
    ]
  },
  'LHR789': {
    bagTag: 'LHR789',
    passengerName: 'Michael Brown',
    flightNumber: 'BA9012',
    airport: 'London Heathrow Airport',
    terminal: 'Terminal 3',
    gate: 'C15',
    status: 'On Belt',
    currentLocation: 'LHR Terminal 5 - Baggage Claim',
    coordinates: [51.4685, -0.4525],
    trackingHistory: [
      {
        timestamp: '2024-01-15T06:20:00Z',
        location: 'LHR Terminal 3 - Check-in Area',
        coordinates: [51.4700, -0.4543],
        status: 'Checked In',
        description: 'Bag checked in at Terminal 3'
      },
      {
        timestamp: '2024-01-15T07:10:00Z',
        location: 'LHR Terminal 3 - Loading Bay',
        coordinates: [51.4705, -0.4550],
        status: 'Loaded',
        description: 'Bag loaded onto aircraft BA9012'
      },
      {
        timestamp: '2024-01-15T12:30:00Z',
        location: 'LHR Terminal 5 - Arrival Gate',
        coordinates: [51.4690, -0.4530],
        status: 'Arrived',
        description: 'Bag arrived at destination'
      },
      {
        timestamp: '2024-01-15T13:15:00Z',
        location: 'LHR Terminal 5 - Baggage Claim',
        coordinates: [51.4685, -0.4525],
        status: 'On Belt',
        description: 'Bag ready for pickup'
      }
    ]
  }
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [bagStatus, setBagStatus] = useState(BagStatus);
  const [isTracking, setIsTracking] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bagLocation, setBagLocation] = useState(null);
  const [bagCoordinates, setBagCoordinates] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Toast management
  const addToast = (toast) => {
    const id = Date.now().toString();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Simulate backend API call
  const simulateBackendCall = async () => {
    setIsFetching(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsFetching(false);
  };

  const handleTrackBag = async () => {
    if (!inputValue.trim()) {
      addToast({
        type: 'error',
        message: 'Please enter a bag tag',
        duration: 3000
      });
      return;
    }

    setIsTracking(true);
    setIsAnimating(true);
    
    // Simulate backend call
    await simulateBackendCall();
    
    // Check if bag tag exists in mock database
    const bagData = mockBagDatabase[inputValue.toUpperCase()];
    
    if (!bagData) {
      addToast({
        type: 'error',
        message: 'Bag not found. Try JFK123, LAX456, or LHR789',
        duration: 5000
      });
      setIsTracking(false);
      setIsAnimating(false);
      return;
    }

    // Update bag status with mock data
    setBagStatus({
      checkedIn: true,
      loaded: bagData.status === 'Loaded' || bagData.status === 'Arrived' || bagData.status === 'On Belt',
      arrived: bagData.status === 'Arrived' || bagData.status === 'On Belt',
      onBelt: bagData.status === 'On Belt',
      currentStatus: bagData.status,
      statusMessage: `Bag is currently ${bagData.status.toLowerCase()}`,
      location: bagData.currentLocation,
      coordinates: bagData.coordinates,
      flightNumber: bagData.flightNumber,
      terminal: bagData.terminal,
      gate: bagData.gate
    });

    // Ensure coordinates are valid
    if (Array.isArray(bagData.coordinates) && bagData.coordinates.length === 2) {
      setBagCoordinates(bagData.coordinates);
    }
    
    setTrackingHistory(bagData.trackingHistory);

    addToast({
      type: 'success',
      message: `Found bag ${bagData.bagTag}`,
      duration: 4000
    });

      setIsTracking(false);
    setIsAnimating(false);
  };

  // Progress steps
  const steps = [
    { name: "Check-in", completed: bagStatus.checkedIn, icon: "📝" },
    { name: "Loaded", completed: bagStatus.loaded, icon: "✈️" },
    { name: "Arrived", completed: bagStatus.arrived, icon: "🏁" },
    { name: "On Belt", completed: bagStatus.onBelt, icon: "🛒" }
  ];

  return (
    <>
      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg animate-slide-in ${
              toast.type === 'success' ? 'bg-green-500 text-white' :
              toast.type === 'error' ? 'bg-red-500 text-white' :
              toast.type === 'warning' ? 'bg-yellow-500 text-white' :
              'bg-blue-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>

      {/* Background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">✈️</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">BagPilot</h1>
                  <p className="text-sm text-gray-600">Luggage Tracking</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
                <span>Help</span>
                <span>Contact</span>
                <span>About</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-600 mb-6">
              Track Your Bag
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
              Find your luggage. Track it from check-in to pickup.
            </p>
            
            {/* Input Section */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Enter Bag Tag</h2>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Demo tags:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <button
                      onClick={() => setInputValue('JFK123')}
                      className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-left hover:bg-blue-100 transition-colors"
                    >
                      <div className="font-semibold text-blue-800">JFK123</div>
                      <div className="text-xs text-blue-600">John Smith • AA1234</div>
                      <div className="text-xs text-gray-500">Checked In</div>
                    </button>
                    <button
                      onClick={() => setInputValue('LAX456')}
                      className="p-3 bg-green-50 border border-green-200 rounded-lg text-left hover:bg-green-100 transition-colors"
                    >
                      <div className="font-semibold text-green-800">LAX456</div>
                      <div className="text-xs text-green-600">Sarah Johnson • UA5678</div>
                      <div className="text-xs text-gray-500">Loaded</div>
                    </button>
                    <button
                      onClick={() => setInputValue('LHR789')}
                      className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-left hover:bg-purple-100 transition-colors"
                    >
                      <div className="font-semibold text-purple-800">LHR789</div>
                      <div className="text-xs text-purple-600">Michael Brown • BA9012</div>
                      <div className="text-xs text-gray-500">On Belt</div>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter bag tag"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 outline-none"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTrackBag()}
                    />
                  </div>
                  <button
                    onClick={handleTrackBag}
                    disabled={isTracking || isFetching}
                    className={`px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl transition-colors ${
                      isTracking || isFetching
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {isTracking || isFetching ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>{isFetching ? 'Fetching...' : 'Tracking...'}</span>
                      </div>
                    ) : (
                      'Track Bag'
                    )}
                  </button>
                </div>

                {isFetching && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-800 font-medium">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mb-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                {bagLocation ? 'Bag Location' : 'Map'}
              </h3>
              {bagLocation ? (
                <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-800 font-medium">
                      {bagStatus.location || 'Location...'}
                    </span>
                  </div>
                  {bagStatus.flightNumber && (
                    <div className="mt-2 text-sm text-gray-600">
                      Flight: {bagStatus.flightNumber} | Terminal: {bagStatus.terminal} | Gate: {bagStatus.gate}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    {bagLocation[0].toFixed(4)}, {bagLocation[1].toFixed(4)}
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600 font-medium">
                      Enter a bag tag to see location
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Default: London, UK
                  </div>
                </div>
              )}
              <MapView 
                center={bagCoordinates || bagLocation || [51.505, -0.09]} 
                markerPosition={bagCoordinates || bagLocation || [51.505, -0.09]}
                markerPopup={bagStatus.location || "Bag Location"}
                zoom={bagCoordinates ? 15 : 13}
              />
            </div>
          </div>

          {/* Progress Tracking */}
          <div className="mb-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Progress</h3>
              <div className="flex flex-col md:flex-row items-center justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center mb-6 sm:mb-8 md:mb-0">
                    {/* Step Circle */}
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl transition-colors ${
                          step.completed
                            ? "bg-green-500 border-green-500 text-white"
                            : "border-gray-300 bg-white text-gray-400"
                        }`}
                      >
                        {step.completed ? "✓" : step.icon}
                      </div>
                      {/* Progress Line */}
                {index < steps.length - 1 && (
                  <div
                          className={`hidden md:block absolute top-8 left-16 w-full h-1 transition-colors ${
                            step.completed
                              ? "bg-green-500"
                    : "bg-gray-300"
                }`}
                          style={{ width: 'calc(100vw / 4 - 4rem)' }}
                        />
                      )}
                    </div>
                    {/* Step Label */}
                    <div className="mt-4 text-center">
                      <div className="font-semibold text-gray-800">{step.name}</div>
                      <div className="text-sm text-gray-600">
                        {step.completed ? "Completed" : "Pending"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Current Status */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">✈️</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{bagStatus.currentStatus}</div>
                    <div className="text-gray-600">{bagStatus.statusMessage}</div>
                  </div>
                </div>
                {bagCoordinates && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800">
                      Coordinates: {bagCoordinates[0].toFixed(6)}, {bagCoordinates[1].toFixed(6)}
                    </div>
                  </div>
                )}
                {bagStatus.flightNumber && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-800">
                      Flight: {bagStatus.flightNumber} | Terminal: {bagStatus.terminal} | Gate: {bagStatus.gate}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking History */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                History
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {trackingHistory.length > 0 ? (
                  trackingHistory.map((entry, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-800">{entry.status}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{entry.location}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.coordinates[0].toFixed(4)}, {entry.coordinates[1].toFixed(4)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <div>No data</div>
                    <div className="text-sm">Start tracking to see history</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <button className="p-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                  Mobile Updates
                </button>
                <button className="p-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                  Email Notifications
                </button>
                <button className="p-4 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors">
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">✈️</span>
                </div>
                <span className="text-2xl font-bold">BagPilot</span>
              </div>
              <p className="text-gray-400 mb-4">Track your luggage</p>
              <div className="flex justify-center space-x-6 text-sm text-gray-400">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Contact Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}