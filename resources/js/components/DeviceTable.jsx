import React from 'react';
import { Button, Skeleton } from '@idds/react';
import StatusBadge from './StatusBadge';
import {
    Eye,
    Pencil,
    Trash2,
    Plus,
    RotateCcw,
} from 'lucide-react';

function formatRupiah(amount) {
    if (amount === null || amount === undefined || amount === '') return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function DeviceTable({
    devices = [],
    loading = false,
    onViewDetail,
    onEdit,
    onDelete,
    onAddDevice,
    onResetFilters,
    hasFilter = false,
}) {
    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <Skeleton variant="rounded" height={24} width={180} />
                    <Skeleton variant="rounded" height={24} width={80} />
                </div>
                <div className="p-4 space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                            <Skeleton variant="rounded" height={20} width={90} />
                            <Skeleton variant="rounded" height={20} width={220} />
                            <Skeleton variant="rounded" height={20} width={130} />
                            <Skeleton variant="rounded" height={20} width={110} />
                            <Skeleton variant="rounded" height={20} width={90} />
                            <div className="ml-auto flex gap-2">
                                <Skeleton variant="rounded" height={28} width={28} />
                                <Skeleton variant="rounded" height={28} width={28} />
                                <Skeleton variant="rounded" height={28} width={28} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (devices.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center shadow-xs">
                <div className="flex justify-center mb-4">
                    <img
                        src={hasFilter ? '/images/idds/idds_noresultsfound.png' : '/images/idds/idds_nodata.png'}
                        alt={hasFilter ? 'Data tidak ditemukan' : 'Belum ada data'}
                        className="w-36 h-auto object-contain drop-shadow-xs"
                    />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {hasFilter ? 'Tidak Ada Perangkat yang Cocok' : 'Belum Ada Data Perangkat'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    {hasFilter
                        ? 'Coba sesuaikan kata kunci pencarian atau bersihkan filter kategori/status.'
                        : 'Mulai dengan menambahkan perangkat TI baru ke dalam database inventaris.'}
                </p>
                <div className="flex justify-center gap-2">
                    {hasFilter ? (
                        <Button
                            hierarchy="secondary"
                            size="md"
                            onClick={onResetFilters}
                            prefixIcon={<RotateCcw className="w-4 h-4" />}
                        >
                            Reset Filter
                        </Button>
                    ) : (
                        <Button
                            hierarchy="primary"
                            size="md"
                            onClick={onAddDevice}
                            prefixIcon={<Plus className="w-4 h-4" />}
                        >
                            Tambah Perangkat Pertama
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
            {/* Header info */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h2 className="text-sm font-semibold text-gray-900">
                    Daftar Perangkat TI
                </h2>
                <span className="text-xs text-gray-500">
                    Menampilkan <span className="font-semibold text-gray-800">{devices.length}</span> perangkat
                </span>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-600 uppercase tracking-wider border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-3.5 font-semibold">
                                Kode Aset
                            </th>
                            <th scope="col" className="px-6 py-3.5 font-semibold">
                                Perangkat & Merek
                            </th>
                            <th scope="col" className="px-6 py-3.5 font-semibold">
                                Kategori
                            </th>
                            <th scope="col" className="px-6 py-3.5 font-semibold">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3.5 font-semibold">
                                Unit / Pemegang
                            </th>
                            <th scope="col" className="px-6 py-3.5 font-semibold">
                                Nilai Perolehan
                            </th>
                            <th scope="col" className="px-6 py-3.5 font-semibold text-right">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {devices.map((device) => (
                            <tr
                                key={device.id}
                                className="hover:bg-blue-50/40 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="font-mono text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-800 rounded border border-gray-200">
                                        {device.asset_code}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                        {device.name}
                                    </div>
                                    {device.brand && (
                                        <div className="text-xs text-gray-500">
                                            {device.brand} {device.serial_number ? `• SN: ${device.serial_number}` : ''}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                    {device.category_name || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={device.status} label={device.status_label} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                    {device.assigned_to || (
                                        <span className="text-xs text-gray-400 italic">Belum ada</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800 text-xs">
                                    {formatRupiah(device.purchase_price)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            onClick={() => onViewDetail(device)}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            title="Lihat Detail"
                                            aria-label={`Lihat detail ${device.name}`}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onEdit(device)}
                                            className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                            title="Ubah Data"
                                            aria-label={`Ubah data ${device.name}`}
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(device)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                            title="Hapus Data"
                                            aria-label={`Hapus data ${device.name}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
