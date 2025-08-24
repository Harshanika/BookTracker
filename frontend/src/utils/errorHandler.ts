// frontend/src/utils/errorHandler.ts
export function extractErrorMessage(error: any): string {
    if (
        error.response &&
        error.response.data &&
        error.response.data.message
    ) {
        const msg = error.response.data.message;
        if (typeof msg === "object" && msg.message) {
            return msg.message;
        }
        if (typeof msg === "string") {
            return msg;
        }
    }
    if (error.message) {
        return error.message;
    }
    return "An unexpected error occurred";
}