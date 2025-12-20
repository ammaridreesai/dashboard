"use client";

import { useEffect, useState } from 'react';

export default function Header() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Format current date as "Day, Month DD, YYYY"
    const formatDate = () => {
      const date = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    setCurrentDate(formatDate());
  }, []);

  return (
    <header className="bg-[#1A2332] px-8 py-4 flex items-center justify-end">
      <div className="flex items-center gap-4">
        {/* Current Date Display - Read Only */}
        <div className="px-4 py-2 bg-[#2A3441] border border-gray-600 rounded-lg text-white text-sm">
          {currentDate || 'Loading...'}
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src="/assets/avatar.svg"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
