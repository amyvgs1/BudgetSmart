import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

export default function VerifyEmail() {
    const [verificationStatus, setVerificationStatus] = useState('pending');
    const navigate = useNavigate();

    useEffect(() => {
        // Check initial verification status
        const checkVerification = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email_confirmed_at) {
                setVerificationStatus('verified');
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        };

        checkVerification();

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event); // Debug log
            
            if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
                // Double check if email is confirmed
                const { data: { user } } = await supabase.auth.getUser();
                console.log('User status:', user); // Debug log
                
                if (user?.email_confirmed_at) {
                    console.log('Email confirmed, redirecting...'); // Debug log
                    setVerificationStatus('verified');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                }
            }
        });

        // Poll for verification status every 5 seconds
        const pollInterval = setInterval(async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email_confirmed_at) {
                setVerificationStatus('verified');
                clearInterval(pollInterval);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            }
        }, 5000);

        // Cleanup
        return () => {
            if (authListener && authListener.subscription) {
                authListener.subscription.unsubscribe();
            }
            clearInterval(pollInterval);
        };
    }, [navigate]);

    return (
        <div className="flex items-center justify-center w-full h-screen bg-gradient-to-r from-blue-800 to-blue-500">
            <div className="w-96 bg-white justify-center text-center rounded-md shadow-lg p-8">
                <h1 className="font-Outfit text-2xl font-semibold mb-4">
                    {verificationStatus === 'pending' ? 'Verify Your Email' : 'Email Verified!'}
                </h1>
                
                {verificationStatus === 'pending' ? (
                    <div>
                        <p className="mb-4">Please check your email to verify your account.</p>
                        <p className="text-sm text-gray-600">
                            Once verified, you'll be automatically redirected to the login page.
                        </p>
                        <p className="text-sm text-gray-500 mt-4">
                            If you've already verified your email, please wait a moment...
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="text-green-600 mb-4">Your email has been verified successfully!</p>
                        <p className="text-sm text-gray-600">
                            Redirecting to login page in a few seconds...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 