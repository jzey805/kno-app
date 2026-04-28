export const supabase: any = {
    from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: async () => ({ error: null }) })
    }),
    channel: () => ({
        on: () => ({ subscribe: () => {} }),
        unsubscribe: () => {}
    }),
    removeChannel: () => {},
    auth: {
        signUp: async () => ({ error: null }),
        signInWithPassword: async () => ({ error: null }),
        signInWithOAuth: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => {}
    }
};
