import { supabase } from '../config/supabase';

export const checkAuth = async () => {
    try {
        // 1. Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("1. CheckAuth - Session:", session?.user?.id); // Log just the ID for clarity
        
        if (sessionError) {
            console.error("Session Error:", sessionError);
            return false;
        }
        
        if (!session?.user?.id) {
            console.log("No valid session user ID");
            return false;
        }

        // 2. Direct database query with explicit column selection
        const { data: dbUser, error: dbError } = await supabase
            .from('users')
            .select(`
                user_id,
                first_name,
                last_name,
                username,
                email,
                verification
            `)
            .eq('user_id', session.user.id)
            .single();

        console.log("2. Database Query Result:", {
            hasData: !!dbUser,
            error: dbError?.message,
            userId: dbUser?.user_id
        });

        if (dbError) {
            console.error("Database Error:", dbError);
            return false;
        }

        if (!dbUser) {
            console.log("No matching user found in database");
            return false;
        }

        // 3. Verify essential fields exist
        if (!dbUser.username || !dbUser.first_name || !dbUser.last_name) {
            console.error("Missing required user data fields");
            return false;
        }

        // 4. Set localStorage with verified data
        try {
            localStorage.setItem('user_id', session.user.id);
            localStorage.setItem('username', dbUser.username);
            localStorage.setItem('user_name', `${dbUser.first_name} ${dbUser.last_name}`);
            localStorage.setItem('session', JSON.stringify(session));
            console.log("3. LocalStorage set successfully");
        } catch (storageError) {
            console.error("LocalStorage Error:", storageError);
            return false;
        }

        console.log("4. Authentication successful");
        return true;

    } catch (error) {
        console.error('CheckAuth - Unexpected error:', error);
        localStorage.clear();
        return false;
    }
}; 