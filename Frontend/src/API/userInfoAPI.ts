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

export const putProfileImg = async (profileImage: { uri: string; name: string; type: string }) => {
    console.log("putProfileImg called with:", profileImage);
    const formData = new FormData();
    formData.append("multipartFile", {
        uri: profileImage.uri,
        name: profileImage.name,
        type: profileImage.type,
      } as any);
  
    try {
      const response = await fetch("https://wuung.mori.space/auth/profile", {
        method: "PUT",
        headers: {
          "accept": "application/json",
          "Authorization": `Bearer ${await AsyncStorage.getItem("accessToken")}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during profile image update:", error);
      throw error;
    }
  };
  