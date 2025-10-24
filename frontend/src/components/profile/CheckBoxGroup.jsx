import { FaCheck } from "react-icons/fa";

export default function CheckBoxGroup({ title, options, selectedOptions, onChange }) {
    return (
        <div className="p-4 border border-gray-300 rounded-lg">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">{title}</h3>
            <div className="flex flex-wrap gap-3">
                {options.map((option) => (
                    <label
                        key={option}
                        className={`flex items-center px-4 py-2 rounded-full cursor-pointer transition-all duration-200 ${selectedOptions.includes(option)
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={selectedOptions.includes(option)}
                            onChange={() => onChange(option)}
                            className="hidden"
                        />
                        {selectedOptions.includes(option) && (
                            <FaCheck className="w-4 h-4 mr-1.5"/>
                        )}
                        <span className="text-sm font-medium">{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}