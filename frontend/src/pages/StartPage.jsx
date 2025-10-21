import React from "react";
import { Link } from "react-router-dom";

export default function Start() {
  return (
    <div>
      <div className="min-h-screen flex justify-center items-center">
        <Link
          to="/createplan"
          className="text-blue-400 hover:underline text-3xl"
        >
          어디로 떠나시나요?
        </Link>
      </div>
    </div>
  );
}
