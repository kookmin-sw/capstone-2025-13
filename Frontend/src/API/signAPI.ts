import AsyncStorage from "@react-native-async-storage/async-storage";

export const refreshAccessToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        const response = await fetch("https://wuung.mori.space/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            throw new Error("Failed to refresh tokens");
        }

        const data = await response.json();

        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);

        return data;
    } catch (error) {
        console.error("Error refreshing tokens:", error);
        throw error;
    }
};

export const signIn = async (email: string, password: string) => {
    try {
        const response = await fetch("https://wuung.mori.space/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during sign-in:", error);
        throw error;
    }
}

export const signOut = async (accessToken: string, refreshToken: string) => {
    try {
        const response = await fetch("https://wuung.mori.space/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken, refreshToken }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during sign-out:", error);
        throw error;
    }
}

export const signUp = async (email: string, password: string, nickname: string, birthDate:string, gender: string) => {
    try {
        const response = await fetch("https://wuung.mori.space/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({  
                email,
                password,
                gender: gender.toUpperCase(), 
                user_name: nickname,
                birth_date: birthDate, }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during sign-up:", error);
        throw error;
    }
}   