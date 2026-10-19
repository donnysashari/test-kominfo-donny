import React from 'react';
import { Badge } from '@idds/react';

export default function StatusBadge({ status, label }) {
    let variant = 'neutral';
    let text = label || status;
    const s = String(status || '').toLowerCase();

    switch (s) {
        case 'tersedia':
        case 'aktif':
            variant = 'success';
            text = text || 'Tersedia';
            break;
        case 'digunakan':
            variant = 'info';
            text = text || 'Digunakan';
            break;
        case 'perbaikan':
            variant = 'warning';
            text = text || 'Perbaikan';
            break;
        case 'rusak':
            variant = 'danger';
            text = text || 'Rusak';
            break;
        case 'tidak_dipakai':
            variant = 'neutral';
            text = text || 'Tidak Dipakai';
            break;
        default:
            variant = 'info';
            break;
    }

    return <Badge text={text} variant={variant} type="soft" />;
}
