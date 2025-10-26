import { useEffect, useState } from "react";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import ProfileView from "../components/profile/ProfileView";
import useAuthStore from "../store/authStore";
import profileService from "../services/profile";
import StorageService from "../services/storage";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const updateAuthUser = useAuthStore((state) => state.updateUser);
    const userEmail = useAuthStore((state) => state.user?.email);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await profileService.getProfile();
                setProfileData(response.data);
            } catch (error) {
                console.error("프로필 정보를 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveProfile = async (updatedDataFromForm) => {
        const requestDto = {
            username: updatedDataFromForm.username,
            introduction: updatedDataFromForm.introduction,
            email: userEmail,
            interests: updatedDataFromForm.interests,
        };

        try {
            const response = await profileService.updateProfile(requestDto);
            const updatedProfileFromServer = response.data;

            if (updatedProfileFromServer.access_token && updatedProfileFromServer.refresh_token) {
                StorageService.setAccessToken(updatedProfileFromServer.access_token);
                StorageService.setRefreshToken(updatedProfileFromServer.refresh_token);
            }

            setProfileData(updatedProfileFromServer);
            updateAuthUser({
                username: updatedProfileFromServer.username,
                introduction: updatedProfileFromServer.introduction
            });

            setIsEditing(false);
            alert("프로필이 수정되었습니다.");
        } catch (err) {
            console.error("프로필 수정 실패:", err);
            alert(err.response?.data?.message || "프로필 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 font-inter">
            {isEditing ? (
                <ProfileEditForm
                    currentProfile={profileData}
                    onSave={handleSaveProfile}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <ProfileView
                    profile={profileData}
                    onEdit={handleEditClick}
                />
            )}
        </div>
    );
}