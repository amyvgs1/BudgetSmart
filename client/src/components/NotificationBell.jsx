import { useState, useEffect } from 'react';
import { IconButton, Badge, Menu, MenuItem, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { supabase } from "../config/supabase";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchNotifications();
        // Set up real-time subscription
        const subscription = supabase
            .channel('notifications')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'notifications' },
                (payload) => {
                    if (payload.new?.user_id === sessionStorage.getItem('user_id')) {
                        fetchNotifications();
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const userId = sessionStorage.getItem('user_id');
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .eq('read', false)
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;

            setNotifications(data || []);
            setUnreadCount((data || []).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            console.log('Attempting to update notification:', notificationId);
            
            // Update the notification in Supabase
            const { error } = await supabase
                .from('notifications')
                .update({
                    read: true
                })
                .match({ notification_id: notificationId });

            if (error) {
                console.error('Error updating notification:', error);
                throw error;
            }

            // Refresh notifications after update
            fetchNotifications();
            
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                onClick={handleClick}
                size="large"
                aria-controls={open ? 'notifications-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                id="notifications-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'notifications-button',
                }}
            >
                {notifications.length === 0 ? (
                    <MenuItem disabled>No new notifications</MenuItem>
                ) : (
                    notifications.map((notification) => (
                        <MenuItem 
                            key={notification.notification_id}
                            onClick={() => {
                                markAsRead(notification.notification_id);
                                handleClose();
                            }}
                        >
                            <div className="flex flex-col w-full">
                                <Typography variant="body1">{notification.message}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {new Date(notification.created_at).toLocaleString()}
                                </Typography>
                            </div>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </div>
    );
} 