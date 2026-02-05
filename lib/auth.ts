
import { cookies } from "next/headers";

export async function isAuthenticated() {
    const cookieStore = await cookies();
    return cookieStore.get("cms_auth")?.value === "authenticated";
}

export async function login(password: string) {
    // Mock password check
    return password === "admin123";
}
