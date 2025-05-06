import AsyncStorage from "@react-native-async-storage/async-storage";

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