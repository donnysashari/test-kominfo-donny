import React from 'react';
import { Badge } from '@idds/react';
import { CheckCircle2, Wrench, HardDrive, Laptop } from 'lucide-react';

export default function StatsCards({ devices = [] }) {
    const total = devices.length;
    const available = devices.filter(d => {
        const s = String(d.status || '').toLowerCase();
        return s === 'tersedia' || s === 'aktif';
    }).length;
    const inUse = devices.filter(d => {
        const s = String(d.status || '').toLowerCase();
        return s === 'digunakan';
    }).length;
    const inRepair = devices.filter(d => {
        const s = String(d.status || '').toLowerCase();
        return s === 'perbaikan';
    }).length;

    const stats = [
        {
            title: 'Total Perangkat',
            count: total,
            icon: <HardDrive className="w-5 h-5 text-blue-600" />,
            badge: <Badge text="Semua" variant="info" type="soft" />,
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Perangkat Tersedia',
            count: available,
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
            badge: <Badge text="Siap Pakai" variant="success" type="soft" />,
            bgColor: 'bg-emerald-50',
        },
        {
            title: 'Sedang Digunakan',
            count: inUse,
            icon: <Laptop className="w-5 h-5 text-indigo-600" />,
            badge: <Badge text="Operasional" variant="info" type="soft" />,
            bgColor: 'bg-indigo-50',
        },
        {
            title: 'Dalam Perbaikan',
            count: inRepair,
            icon: <Wrench className="w-5 h-5 text-amber-600" />,
            badge: <Badge text="Maintenance" variant="warning" type="soft" />,
            bgColor: 'bg-amber-50',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((item, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs transition hover:shadow-sm"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className={`p-2.5 rounded-lg ${item.bgColor}`}>
                            {item.icon}
                        </div>
                        {item.badge}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 tracking-tight">
                        {item.count}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                        {item.title}
                    </p>
                </div>
            ))}
        </div>
    );
}
