import api from "./api";

const profileService = {
    async getProfile() {
        return await api.get("/api/user/profile");
    },

    async updateProfile(profileData) {
        return await api.put("/api/user/profile", profileData);
    },
};

export default profileService;