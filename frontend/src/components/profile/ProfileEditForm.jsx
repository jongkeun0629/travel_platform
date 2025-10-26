import { useState } from "react";
import { FaUser } from "react-icons/fa";
import FormInput from "./FormInput";
import CheckBoxGroup from "./CheckBoxGroup";

export default function ProfileEditForm({ currentProfile, onSave, onCancel }) {
    const [profile, setProfile] = useState({
        username: currentProfile.username || '',
        introduction: currentProfile.introduction || '',
        birthdate: currentProfile.birthdate || '',
    });
    const [selectedInterests, setSelectedInterests] = useState(currentProfile.interests || []);
    const [imagePreview, setImagePreview] = useState(currentProfile.profileImageUrl);
    const [imageFile, setImageFile] = useState(null);

    const allInterests = ['휴양', '관광', '모험', '문화', '음식', '쇼핑', '자연'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleInterestChange = (interest) => {
        setSelectedInterests((prevInterests) =>
            prevInterests.includes(interest)
                ? prevInterests.filter((i) => i !== interest)
                : [...prevInterests, interest]
        );
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedData = {
            ...currentProfile,
            ...profile,
            interests: selectedInterests,
            profileImageUrl: imagePreview,
        };
        onSave(updatedData);
    };

    return (
        <div className="w-full max-w-3xl p-6 mx-auto bg-gray-200 rounded-2xl shadow-xl sm:p-8">
            <h1 className="mb-6 text-3xl font-bold text-center text-gray-900">
                프로필 편집
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex-shrink-0 w-32 h-32 rounded-full shadow-md flex items-center justify-center bg-gray-100 overflow-hidden">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Profile"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <FaUser className="w-20 h-20 text-gray-400" />
                        )}
                    </div>
                    <input
                        type="file"
                        id="profileImageInput"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="profileImageInput"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                    >
                        새 이미지 업로드
                    </label>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <FormInput
                        label="이메일"
                        id="email"
                        type="email"
                        value={currentProfile.email}
                        disabled={true}
                        tooltip="이메일은 변경할 수 없습니다."
                    />
                    <FormInput
                        label="닉네임 (아이디)"
                        id="username"
                        name="username"
                        type="text"
                        value={profile.username}
                        onChange={handleInputChange}
                        maxLength={20}
                        placeholder="사용할 닉네임을 입력하세요"
                    />
                </div>

                <div className="space-y-8">
                    <FormInput
                        label="생년월일"
                        id="birthdate"
                        name="birthdate"
                        type="date"
                        value={profile.birthdate}
                        onChange={handleInputChange}
                        disabled={!!currentProfile.birthdate && currentProfile.birthdate.length > 0}
                        tooltip={currentProfile.birthdate && currentProfile.birthdate.length > 0 ? "생년월일은 변경할 수 없습니다." : ""}
                    />
                    <div>
                        <label htmlFor="introduction" className="block mb-2 text-sm font-medium text-gray-700">
                            자기소개
                        </label>
                        <textarea
                            id="introduction"
                            name="introduction"
                            rows="4"
                            value={profile.introduction}
                            onChange={handleInputChange}
                            placeholder="자기소개 문구를 입력하세요"
                            className="w-full px-4 py-3 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                        />
                    </div>
                </div>
                <CheckBoxGroup
                    title="선호 여행 스타일"
                    options={allInterests}
                    selectedOptions={selectedInterests}
                    onChange={handleInterestChange}
                />
                <div className="flex justify-end pt-4 space-x-4 border-t border-gray-300">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 font-medium text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    >
                        취소
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
}