import React from 'react';
import { createRoot } from 'react-dom/client';
import '@idds/react/index.css';
import InventoryApp from './InventoryApp';

const rootElement = document.getElementById('root');
if (rootElement) {
    createRoot(rootElement).render(<InventoryApp />);
}
