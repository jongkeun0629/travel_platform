import React from "react";

export default function TravelPlanList({ plans, onDelete }) {
  return (
    <div>
      {plans.length > 0 ? (
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="flex justify-between items-center bg-gray-700 p-5 rounded-lg shadow-md hover:bg-gray-600 transition-colors"
            >
              <span className="text-lg text-white">{plan.title}</span>
              <button
                onClick={() => onDelete(plan.id)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-6 text-gray-400 text-center text-lg">
          아직 등록된 여행 계획이 없습니다.
        </p>
      )}
    </div>
  );
}
