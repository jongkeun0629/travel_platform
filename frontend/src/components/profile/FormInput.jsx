export default function FormInput({ label, id, disabled = false, tooltip, ...props }) {
    return (
        <div className="relative">
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                id={id}
                {...props}
                disabled={disabled}
                className={`w-full px-4 py-3 text-gray-800 rounded-lg focus:outline-none ${disabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    }`}
            />
            {disabled && tooltip && (
                <span className="absolute text-xs text-gray-500 -bottom-5 left-1">
                    {tooltip}
                </span>
            )}
        </div>
    );
}