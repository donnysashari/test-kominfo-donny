import React from 'react';
import { Modal, Button } from '@idds/react';
import StatusBadge from './StatusBadge';
import {
    Calendar,
    Tag,
    User,
    DollarSign,
    FileText,
    Hash,
    Layers,
    Clock,
    Pencil,
    Trash2,
} from 'lucide-react';

function formatRupiah(amount) {
    if (amount === null || amount === undefined || amount === '') return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    try {
        const d = new Date(dateStr);
        return new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'long',
        }).format(d);
    } catch {
        return dateStr;
    }
}

export default function DeviceDetailModal({
    isOpen,
    onClose,
    device,
    onEdit,
    onDelete,
}) {
    if (!device) return null;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Rincian Detail Perangkat"
            size="md"
        >
            <div className="space-y-4 pt-2">
                {/* Header Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded font-semibold">
                                {device.asset_code}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs font-medium text-gray-600">
                                {device.category_name || '-'}
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mt-1">
                            {device.name}
                        </h2>
                    </div>
                    <StatusBadge status={device.status} label={device.status_label} />
                </div>

                {/* Detail Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-white border border-gray-100 rounded-lg">
                        <span className="text-xs text-gray-400 block mb-0.5">Merek / Brand</span>
                        <span className="font-medium text-gray-800">{device.brand || '-'}</span>
                    </div>

                    <div className="p-3 bg-white border border-gray-100 rounded-lg">
                        <span className="text-xs text-gray-400 block mb-0.5">Nomor Seri</span>
                        <span className="font-mono text-xs text-gray-800">{device.serial_number || '-'}</span>
                    </div>

                    <div className="p-3 bg-white border border-gray-100 rounded-lg">
                        <span className="text-xs text-gray-400 block mb-0.5">Penanggung Jawab</span>
                        <span className="font-medium text-gray-800">{device.assigned_to || 'Belum Ditugaskan'}</span>
                    </div>

                    <div className="p-3 bg-white border border-gray-100 rounded-lg">
                        <span className="text-xs text-gray-400 block mb-0.5">Harga Pengadaan</span>
                        <span className="font-semibold text-emerald-700">
                            {formatRupiah(device.purchase_price)}
                        </span>
                    </div>

                    <div className="p-3 bg-white border border-gray-100 rounded-lg">
                        <span className="text-xs text-gray-400 block mb-0.5">Tanggal Pengadaan</span>
                        <span className="text-gray-800">{formatDate(device.purchase_date)}</span>
                    </div>

                    <div className="p-3 bg-white border border-gray-100 rounded-lg">
                        <span className="text-xs text-gray-400 block mb-0.5">Terakhir Diperbarui</span>
                        <span className="text-xs text-gray-600">{formatDate(device.updated_at)}</span>
                    </div>
                </div>

                {/* Catatan */}
                <div className="p-3 bg-white border border-gray-100 rounded-lg">
                    <span className="text-xs text-gray-400 block mb-1">Catatan Tambahan</span>
                    <p className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {device.notes || 'Tidak ada catatan khusus untuk perangkat ini.'}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <Button
                        hierarchy="tertiary"
                        size="md"
                        onClick={() => {
                            onClose();
                            onDelete(device);
                        }}
                        prefixIcon={<Trash2 className="w-4 h-4 text-red-600" />}
                    >
                        <span className="text-red-600">Hapus</span>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button
                            hierarchy="secondary"
                            size="md"
                            onClick={onClose}
                        >
                            Tutup
                        </Button>
                        <Button
                            hierarchy="primary"
                            size="md"
                            onClick={() => {
                                onClose();
                                onEdit(device);
                            }}
                            prefixIcon={<Pencil className="w-4 h-4" />}
                        >
                            Ubah Data
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
