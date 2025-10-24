import { FaArrowLeft, FaEdit, FaUser } from "react-icons/fa";
import TagList from "./TagList";
import { Link } from "react-router-dom";

export default function ProfileView({ profile, onEdit }) {
    if (!profile) {
        return null;
    }

    const stats = profile.stats || {};

    return (
        <div className="w-full max-w-3xl p-6 mx-auto bg-gray-200 rounded-2xl shadow-xl sm:p-8">
            <div className="mb-3">
                <Link
                    to="/"
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                    <FaArrowLeft className="w-4 h-4 mr-1" />
                    홈으로
                </Link>
            </div>

            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    마이페이지
                </h1>
                <button
                    onClick={onEdit}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                    <FaEdit size={16} className="w-4 h-4 mr-1" />
                    프로필 편집
                </button>
            </div>

            <div className="flex flex-col items-center p-6 border-b border-gray-300 md:flex-row md:items-start md:space-x-8">
                <div className="flex-shrink-0 w-32 h-32 rounded-full shadow-md flex items-center justify-center bg-gray-100 overflow-hidden">
                    {profile.profileImageUrl ? (
                        <img
                            src={profile.profileImageUrl}
                            alt="Profile"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <FaUser className="w-20 h-20 text-gray-400" />
                    )}
                </div>

                <div className="flex flex-col items-center mt-4 md:items-start md:mt-0">
                    <h2 className="text-3xl font-semibold text-gray-900">{profile.userId}</h2>
                    <p className="mt-1 text-sm text-gray-700">{profile.email}</p>
                    <p className="mt-1 text-sm text-gray-700">생년월일: {profile.birthdate || '미설정'}</p>
                    <p className="mt-3 text-center text-gray-800 md:text-left">
                        {profile.introduction || '자기소개가 아직 없습니다.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 text-center border-b border-gray-300">
                <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.plans || 0}</p>
                    <p className="text-sm font-medium text-gray-500">여행 계획</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.reviews || 0}</p>
                    <p className="text-sm font-medium text-gray-500">여행 후기</p>
                </div>
            </div>
            <div className="space-y-6 pt-6">
                <TagList title="선호 여행 타입" tags={profile.interests} />
            </div>
        </div>
    );
}