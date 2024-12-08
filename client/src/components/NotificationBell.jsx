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
                .order('created_at', { ascending: false })
                .limit(10);

            if (error) throw error;

            setNotifications(data || []);
            setUnreadCount((data || []).filter(notif => !notif.read).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const markAsRead = async (notificationId) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('notification_id', notificationId);

            if (error) throw error;

            // Update local state
            setNotifications(prevNotifications => 
                prevNotifications.map(notif => 
                    notif.notification_id === notificationId 
                        ? { ...notif, read: true }
                        : notif
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = (now - date) / 1000; // difference in seconds

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
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
                onClick={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: '400px',
                        width: '300px',
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {notifications.length === 0 ? (
                    <MenuItem disabled>
                        <Typography>No notifications</Typography>
                    </MenuItem>
                ) : (
                    notifications.map((notification) => (
                        <MenuItem
                            key={notification.notification_id}
                            onClick={() => markAsRead(notification.notification_id)}
                            sx={{
                                backgroundColor: notification.read ? 'transparent' : 'action.hover',
                                display: 'block',
                            }}
                        >
                            <Typography variant="body1" noWrap>
                                {notification.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatTimestamp(notification.created_at)}
                            </Typography>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </div>
    );
} 