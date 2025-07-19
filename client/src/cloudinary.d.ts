// src/global.d.ts or src/cloudinary.d.ts

export { };

declare global {
    interface Window {
        cloudinary: {
            createUploadWidget: (
                options: object,
                callback: (error: any, result: any) => void
            ) => {
                open: () => void;
            };
        };
    }
}
