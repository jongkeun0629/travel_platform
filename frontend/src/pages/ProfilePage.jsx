import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import ProfileEditForm from "../components/profile/ProfileEditForm";
import ProfileView from "../components/profile/ProfileView";

const PROFILES_KEY = "travel_profiles";

const getProfileData = (user) => {
    if (!user) return null;

    const defaultProfile = {
        userId: user.userId,
        email: user.email,
        introduction: "",
        profileImageUrl: null,
        interests: [],
        birthdate: '',
        stats: {
            plans: 0,
            reviews: 0,
        }
    };

    const allProfiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");
    const userProfile = allProfiles[user.userId];

    if (userProfile) {
        return {
            ...defaultProfile,
            ...userProfile
        };
    }

    return defaultProfile;
};

export default function ProfilePage() {
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = userService.getCurrentUser();
        if (!currentUser) {
            setIsLoading(false);
            navigate("/login", { replace: true });
        } else {
            setUser(currentUser);
            const data = getProfileData(currentUser);
            setProfileData(data);
            setIsLoading(false);
        }
    }, [navigate]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveProfile = (updatedData) => {
        if (!user) return;

        try {
            const authUpdate = {
                userId: updatedData.userId,
                email: updatedData.email
            };

            userService.updateUser(user.userId, authUpdate);

            const allProfiles = JSON.parse(localStorage.getItem(PROFILES_KEY) || "{}");

            if (user.userId !== updatedData.userId) {
                delete allProfiles[user.userId];
            }

            allProfiles[updatedData.userId] = updatedData;
            localStorage.setItem(PROFILES_KEY, JSON.stringify(allProfiles));

            setProfileData(updatedData);
            setUser(authUpdate);
            setIsEditing(false);
        } catch (err) {
            alert(err.message);
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