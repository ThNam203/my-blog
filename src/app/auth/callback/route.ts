import { oauthCallbackGET } from "@/lib/supabase/oauth-callback";

export async function GET(request: Request) {
    return oauthCallbackGET(request);
}
