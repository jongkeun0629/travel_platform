export default function ProfileView({ profile, onEdit }) {
    return (
        <div className="w-full max-w-3xl p-6 mx-auto bg-gray-300 rounded-2xl shadow-xl sm:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    마이페이지
                </h1>
                <button
                    onClick={onEdit}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >

                </button>
            </div>
        </div>
    );
}