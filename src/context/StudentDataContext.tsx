;
import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudentEnroll } from "@/services/studentService";
import { useAuth } from "./AuthContext";
import type { StudentType } from "@/types/user";

type StudentDataContextType = {
    studentData?: StudentType;
    isLoading: boolean;
    isError: boolean;
    refetch: () => void;
}
const StudentDataContext = createContext<StudentDataContextType | undefined>(undefined);

type StudentDataProviderProps = {
    children: ReactNode;
};

export const StudentDataProvider = ({ children }: StudentDataProviderProps) => {
    const { user } = useAuth();
    const studentId = user?.id;

    const {
        data: studentData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["studentData", studentId],
        queryFn: () => getStudentEnroll(studentId),
        enabled: !!studentId,
    });

    return (
        <StudentDataContext.Provider
            value={{
                studentData,
                isLoading,
                isError,
                refetch
            }}>
            {children}

        </StudentDataContext.Provider>
    )
};

export const useStudentData = () => {
    const context = useContext(StudentDataContext);
    if (!context) {
        throw new Error("useStudentData must be used within a StudentDataProvider");
    }
    return context;
};