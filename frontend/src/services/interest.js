import api from "./api"; 

const interestService = {
    async getUserInterests() {
        try {
            const response = await api.get("/api/users/interests");
            console.log("finaltest");
            console.log(response, response.data);
            return response.data;
            
        } catch (error) {
            console.error("Failed to fetch user interests:", error);
            throw error;
        }
    },

    
    async updateUserInterests(requestDto) {
        const response = await api.post("/api/users/interests", requestDto);
        return response.data;
    },
};

export default interestService;