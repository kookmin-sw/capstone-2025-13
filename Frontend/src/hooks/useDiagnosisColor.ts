// hooks/useIconColor.ts
import { useCallback } from "react";

export function useDiagnosisColor() {
    // id에 따라 색상 반환
    const getIconColor = useCallback((id: number) => {
        switch (id) {
            case 1:
                return "#50B2DC";
            case 2:
                return "#F3C550";
            case 3:
                return "#CC84FA";
            // 필요시 id 추가
            default:
                return "#E1E1E1";
        }
    }, []);

    return getIconColor;
}
