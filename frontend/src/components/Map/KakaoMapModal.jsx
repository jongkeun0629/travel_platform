import React, { useState, useEffect } from "react";

export default function KakaoMapModal({ fieldName, onSelect, onClose }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();
    if (keyword.trim() === "") {
      setResults([]);
      return;
    }

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
      } else {
        setResults([]);
      }
    });
  }, [keyword]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-4 rounded-lg w-11/12 max-w-xl">
        <h3 className="text-lg font-semibold mb-2 text-gray-100">
          {fieldName} 검색
        </h3>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="장소를 입력하세요"
          className="w-full p-2 mb-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-100"
        />
        <div className="max-h-64 overflow-y-auto">
          {results.map((place) => (
            <div
              key={place.id}
              className="p-2 mb-1 rounded hover:bg-gray-700 cursor-pointer text-gray-100"
              onClick={() =>
                onSelect({
                  address: place.address_name || place.road_address_name,
                  phone: place.phone || "",
                })
              }
            >
              <p className="font-semibold">{place.place_name}</p>
              <p className="text-sm">{place.address_name}</p>
              {place.phone && <p className="text-sm">{place.phone}</p>}
            </div>
          ))}
          {results.length === 0 && keyword && (
            <p className="text-gray-400 text-sm text-center mt-2">
              검색 결과가 없습니다.
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-3 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
