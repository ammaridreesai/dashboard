'use client';

import { useState } from 'react';

export default function Header() {
  const [selectedDate, setSelectedDate] = useState('2025-11-10');

  return (
    <header className="bg-[#1A2332] px-8 py-4 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 bg-[#2A3441] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
