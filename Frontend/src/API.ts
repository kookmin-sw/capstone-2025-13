import AsyncStorage from "@react-native-async-storage/async-storage";

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



export const userInfoUpdate = async (password: string | null, nickname: string | null, birthDate: string | null, gender: string | null) => {
    console.log("userInfoUpdate called with:", { password, nickname, birthDate, gender });
    try {
    const response = await fetch("https://wuung.mori.space/auth/update", {
      method: "POST",
      headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
      },
            body: JSON.stringify({  
                password,
                gender: gender?.toUpperCase() || null, 
                user_name: nickname,
                birth_date: birthDate, }),
    });
  
    if (!response.ok) {
            throw new Error("Network response was not ok");
    }
  
    const data = await response.json();
    return data;
    } catch (error) {
        console.error("Error during user info update:", error);
        throw error;
    }

}
  

export const getUserInfo = async () => {
    try {
        const response = await fetch("https://wuung.mori.space/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
                "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error during user info update:", error);
        throw error;
    }

}


import axios from 'axios';

export const getCenters = async (page = 1, rows = 100) => {
    const SERVICE_KEY = "W6m5fMssN9qsVxsxz3JD%2BmpakcCWijQ8VJUyqDEIP4MaRQyWvzl4%2FgUdTl4MhZItcRMT9PadTG1JWcuUhAbOTg%3D%3D"; // 인코딩된 키
    const url = `http://api.data.go.kr/openapi/tn_pubr_public_hp_cnter_api?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=100&type=json`;

    try {
        const response = await axios.get(url, {
            params: {
                serviceKey: SERVICE_KEY,
                pageNo: page,
                numOfRows: rows,
                type: 'json'
            }
        });
        return response.data.response?.body?.items || [];
    } catch (error) {
        if (error instanceof Error) {
            console.error('API 호출 오류:', error.message);
        } else {
            console.error('API 호출 오류:', error);
        }
        throw error;
    }
};
