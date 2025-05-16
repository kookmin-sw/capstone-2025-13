import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
} from "react";

interface LoadingContextType {
    isLoading: boolean;
    showLoading: () => void;
    hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const showLoading = useCallback(() => {
        console.log("🔄 showLoading called");
        setIsLoading(true);
    }, []);
    const hideLoading = useCallback(() => {
        console.log("✅ hideLoading called");
        setIsLoading(false);
    }, []);

    return (
        <LoadingContext.Provider
            value={{ isLoading, showLoading, hideLoading }}
        >
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error(
            "useLoading은 반드시 LoadingProvider 내부에서 사용해야 합니다."
        );
    }
    return context;
};
