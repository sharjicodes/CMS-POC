
import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const isValid = await login(password);

        if (isValid) {
            const cookieStore = await cookies();
            cookieStore.set("cms_auth", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
            });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
