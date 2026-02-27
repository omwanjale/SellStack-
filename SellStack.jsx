// SellStack.jsx

import React from 'react';

// Import necessary components
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProductsManagement from './components/ProductsManagement';
import Analytics from './components/Analytics';
import Customers from './components/Customers';
import Payments from './components/Payments';
import Licenses from './components/Licenses';
import Marketplace from './components/Marketplace';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';

function SellStack() {
    return (
        <div className="app">
            {/* Routing can be done with react-router */}
            <LandingPage />
            <Auth />
            <Dashboard />
            <ProductsManagement />
            <Analytics />
            <Customers />
            <Payments />
            <Licenses />
            <Marketplace />
            <Settings />
            <AdminPanel />
        </div>
    );
}

export default SellStack;