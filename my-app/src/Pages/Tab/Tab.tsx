import React, { useState, type SyntheticEvent, useContext } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { ThemeContext } from '../../Context/ThemeContext';

import { useNavigate, useLocation } from 'react-router-dom';

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  
  const getTabValue = () => {
    if (location.pathname === '/dashboard') {
      return 0;
    } else if (location.pathname.startsWith('/posts')) {
      return 1;
    } else if (location.pathname.startsWith('/users')) {
      return 2;
    } else if (location.pathname.startsWith('/todos')) {
      return 3;
    } else {
      return 0;
    }
  };

  const [value, setValue] = useState(getTabValue());


  React.useEffect(() => {
    setValue(getTabValue());
  }, [location.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    
    switch (newValue) {
      case 0:
        navigate('/dashboard');
        break;
      case 1:
        navigate('/posts');
        break;
      case 2:
        navigate('/users');
        break;
      case 3:
        navigate('/todos');
        break;
    }
  };

  const handleTabClick = (tabValue: number) => {
    if (value === tabValue) {
      switch (tabValue) {
        case 0:
          navigate('/dashboard');
          break;
        case 1:
          navigate('/posts');
          break;
        case 2:
          navigate('/users');
          break;
        case 3:
          navigate('/todos');
          break;
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor:theme ==='light' ? 'primary.light':'primary.dark' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Tabs value={value} 
          onChange={handleChange} 
          textColor={theme === 'light' ? 'primary' : 'secondary'}
          centered
          sx={{ flexGrow: 1 }}
          >
            <Tab label="Dashboard" {...a11yProps(0)} onClick={() => handleTabClick(0)} />
            <Tab label="Posts" {...a11yProps(1)} onClick={() => handleTabClick(1)} />
            <Tab label="Users" {...a11yProps(2)} onClick={() => handleTabClick(2)} />
            <Tab label="Todo" {...a11yProps(3)} onClick={() => handleTabClick(3)} />
          </Tabs>
          <Button variant='outlined' onClick={toggleTheme}>{theme==='light' ? 'light':'dark'}</Button>
        </Box>
      </Box>
    </Box>
  );
}

