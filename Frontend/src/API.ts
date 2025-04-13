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

export const signUp = async (email: string, password: string, nickname: string, birthDate:string, isMale: boolean) => {
    try {
        const response = await fetch("https://wuung.mori.space/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "accept": "application/json",
            },
            body: JSON.stringify({ email, password, nickname, birthDate, isMale }),
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