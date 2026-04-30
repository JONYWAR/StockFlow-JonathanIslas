'use client';

import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Box,
    Typography,
    useTheme,
    useMediaQuery, Button,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Inventory as ProductsIcon,
    LocationOn as BranchesIcon,
    SwapHoriz as MovementsIcon,
    BarChart as ReportsIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import styled from '@emotion/styled';

const DRAWER_WIDTH = 250;

const StyledListItem = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== "active",
})<{ active: boolean }>`
    padding: 10px 16px;
    margin: 4px 8px;
    border-radius: 8px;
    color: ${({active}) => (active ? "#FFFFFF" : "#6B7280")};
    background-color: ${({active}) =>
            active ? "#5B61FF" : "transparent"};
    transition: all 0.2s ease;
`;

const SidebarHeader = styled(Box)`
    padding: 24px 16px;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 8px;
`;

const LogoText = styled(Button)`
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0;
    padding-left: 0;

    background: linear-gradient(135deg, #5b61ff 0%, #4348cc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const Subtitle = styled(Typography)`
    font-size: 0.75rem;
    color: #9ca3af;
    font-weight: 500;
`;

interface SidebarProps {
    open?: boolean;
    onClose?: () => void;
}

const navigationItems = [
    {name: 'Dashboard', path: '/dashboard', icon: DashboardIcon},
    {name: 'Products', path: '/dashboard/products', icon: ProductsIcon},
    {name: 'Branches', path: '/dashboard/branches', icon: BranchesIcon},
    {name: 'Movements', path: '/dashboard/movements', icon: MovementsIcon},
    {name: 'Reports', path: '/dashboard/reports', icon: ReportsIcon},
];

export function Sidebar({open = true, onClose}: SidebarProps) {
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const content = (
        <>
            <SidebarHeader>
                <LogoText href={'/'} variant={"text"}>StockFlow</LogoText>
                <Subtitle>Inventory Management</Subtitle>
            </SidebarHeader>

            <List sx={{px: 1}}>
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link href={item.path} key={item.path} style={{textDecoration: 'none'}}>
                            <StyledListItem 
                                active={isActive}
                                sx={{cursor: 'pointer'}}
                                onClick={() => {
                                    if (isMobile && onClose) {
                                        onClose();
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <Icon fontSize="small"/>
                                </ListItemIcon>
                                <ListItemText primary={item.name} primaryTypographyProps={{fontSize: '0.875rem'}}/>
                            </StyledListItem>
                        </Link>
                    );
                })}
            </List>
        </>
    );

    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={open}
                onClose={onClose}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        backgroundColor: '#FFFFFF',
                    },
                }}
            >
                {content}
            </Drawer>
        );
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: DRAWER_WIDTH,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: DRAWER_WIDTH,
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF',
                    borderRight: '1px solid #E5E7EB',
                },
            }}
        >
            {content}
        </Drawer>
    );
}

export {DRAWER_WIDTH};


