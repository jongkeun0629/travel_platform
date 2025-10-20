import React, { useState } from "react";

export default function TravelPlanForm({ onAddPlan }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newPlan = { id: Date.now(), title };
    onAddPlan(newPlan);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="새 여행 계획을 입력하세요"
        className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-500 transition-colors"
      >
        추가
      </button>
    </form>
  );
}
