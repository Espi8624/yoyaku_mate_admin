import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider, Box } from '@mui/material';
import { COLORS } from '../styles/colors';

// Icons
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorIcon from '@mui/icons-material/Error';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PeopleIcon from '@mui/icons-material/People';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import WarningIcon from '@mui/icons-material/Warning';

const drawerWidth = 260;

const menuItems = [
  { text: 'License Approval', icon: <VerifiedIcon />, path: '/store-approval' },
  { text: 'Error Dashboard', icon: <ErrorIcon />, path: '/error-count' },
  { text: 'Request Count', icon: <CompareArrowsIcon />, path: '/request-count' },
  { text: 'Active User', icon: <PeopleIcon />, path: '/active-user' },
  { text: 'SSE Status', icon: <SettingsInputAntennaIcon />, path: '/sse-status' },
  { text: 'Response Time', icon: <AccessTimeIcon />, path: '/response-time' },
  { text: 'Audit Log', icon: <ListAltIcon />, path: '/audit-log' },
  { text: 'System Metrics', icon: <MemoryIcon />, path: '/system-metrics' },
  { text: 'DB Metrics', icon: <StorageIcon />, path: '/db-metrics' },
  { text: 'Alert', icon: <WarningIcon />, path: '/alert' },
];

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: COLORS.surface,
          color: COLORS.textPrimary,
          borderRight: `1px solid ${COLORS.border}`,
        },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', letterSpacing: '1px', color: COLORS.textPrimary, mb: 0.5 }}>
          Rusui
        </Typography>
        <Typography variant="caption" sx={{ color: COLORS.primary, fontWeight: 'bold' }}>
          ADMIN METRICS CONSOLE
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: COLORS.border }} />
      <List sx={{ px: 1, py: 1.5 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 1.5,
                  py: 1,
                  px: 2,
                  '&.Mui-selected': {
                    bgcolor: COLORS.border,
                    color: COLORS.primary,
                    '& .MuiListItemIcon-root': {
                      color: COLORS.primary,
                    },
                    '&:hover': {
                      bgcolor: COLORS.borderLight,
                    },
                  },
                  '&:hover': {
                    bgcolor: COLORS.primaryLight,
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 'bold' : '500',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}

export default Sidebar;
export { drawerWidth };
