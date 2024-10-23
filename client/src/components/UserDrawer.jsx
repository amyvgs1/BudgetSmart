import { useState } from 'react';
import Calculator from './calculator';
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Box, List } from '@mui/material';

export default function UserDrawer() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    // create objects that contain name and destination
    const drawerContent = [
        {name: "Dashboard", url: "/dashboard"},
        { name: "Profile/Settings", url: "/profile" },
        { name: "Articles", url: "/articles" },
        { name: "Add Friends", url: "/addfriends" },
        { name: "My Budgets", url: "/mybudgets" },
        { name: "Leaderboard", url: "/leader" }
    ]

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const drawerBehavior = (url) => {
        navigate(url);
        toggleDrawer();
    }


    return (
        <div className='h-full'>
            <IconButton onClick={toggleDrawer}>
                <MenuIcon />
            </IconButton>
            <Drawer anchor="left" open={open} onClose={toggleDrawer}>
                <Box sx={{ width: 250 }} role="presentation">
                    <List sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {drawerContent.map((element) => {
                            return (
                                <li>
                                    <div className='flex items-center text-2xl font-Outfit justify-center h-20 border-b border-t hover:bg-orange-300 hover:text-white p-10' onClick={() => drawerBehavior(element.url)}>
                                        <h2>{element.name}</h2>
                                    </div>
                                </li>
                            );
                        })}

                        <button className='mt-10 bg-orange-500 hover:bg-orange-300 w-60 h-10 rounded-lg font-Outfit text-2xl font-semibold text-white'>
                            Create Budget
                        </button>

                    </List>
                </Box>
            </Drawer>
        </div>
    );
}