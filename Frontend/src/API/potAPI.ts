import customAxios from "./axios";

interface PotStatus {
    level: number;
    exp: number;
    need: number;
    coupon: number;
}

export const getPotStatus = async (): Promise<PotStatus> => {
    try {
        console.log("🪴 [DEBUG] getPotStatus 호출 시작");
        const res = await customAxios.get("/pot/status");
        return res.data.data;
    } catch (error) {
        console.error("❌ [DEBUG] getPotStatus 실패:", error);
        throw error;
    }
};

export const useCoupon = async (count: number): Promise<PotStatus> => {
    try {
        console.log("💧 [DEBUG] useCoupon 호출 시작, count:", count);
        const res = await customAxios.post("/pot/usecoupon", { count });
        return res.data.data;
    } catch (error) {
        console.error("❌ [DEBUG] useCoupon 실패:", error);
        throw error;
    }
};

export const getCoupon = async (): Promise<PotStatus> => {
    try {
        console.log("🎁 [DEBUG] getCoupon 호출 시작");
        const res = await customAxios.post("/pot/getcoupon");
        console.log("✅ [DEBUG] getCoupon 성공:", res.data.data);
        return res.data.data;
    } catch (error) {
        console.error("❌ [DEBUG] getCoupon 실패:", error);
        throw error;
    }
};
