export type Database = {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    display_name: string;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    display_name: string;
                    created_at?: string;
                };
                Update: {
                    display_name?: string;
                };
                Relationships: [];
            };
            comments: {
                Row: {
                    id: string;
                    post_slug: string;
                    user_id: string;
                    parent_id: string | null;
                    body: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    post_slug: string;
                    user_id: string;
                    parent_id?: string | null;
                    body: string;
                    created_at?: string;
                };
                Update: {
                    body?: string;
                };
                Relationships: [];
            };
            confessions: {
                Row: {
                    id: string;
                    body: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    body: string;
                    created_at?: string;
                };
                Update: {
                    body?: string;
                };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
};

export type Comment = Database["public"]["Tables"]["comments"]["Row"] & {
    profiles: { display_name: string } | null;
};

export type Confession = Database["public"]["Tables"]["confessions"]["Row"];
