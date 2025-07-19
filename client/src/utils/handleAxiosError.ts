import { AxiosError } from "axios"

export const handleAxiosError = (error: unknown, label = "API Error") => {
    const err = error as AxiosError<any>;
    const message = err?.response?.data?.message || err?.message || "Something went wrong";
    console.log(`${label}`, err?.message);
    return message;
};