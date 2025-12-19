'use client';

export default function Header({ selectedDate, onDateChange, showDateFilter = false }) {
  return (
    <header className="bg-[#1A2332] px-8 py-4 flex items-center justify-end">
      <div className="flex items-center gap-4">
        {/* Date filter - commented out for now */}
        {/* {showDateFilter && (
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-4 py-2 bg-[#2A3441] border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          />
        )} */}
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
