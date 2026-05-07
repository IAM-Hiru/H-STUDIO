import { createClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("--> HIT POST /api/chat/message");
  try {
    const body = await req.json();
    console.log("Body:", body);
    const { chatId, role, content } = body;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log("Unauthorized user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Inserting message for user:", user.id);
    const { error } = await supabase
      .from("messages")
      .insert({ chat_id: chatId, role, content });

    if (error) {
      console.log("Supabase insert error:", error);
      throw error;
    }

    console.log("Message inserted successfully");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Message Save Error Caught:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
