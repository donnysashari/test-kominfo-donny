import React from 'react';
import { Modal, Button, Badge } from '@idds/react';
import StatusBadge from './StatusBadge';
import { Save } from 'lucide-react';

function formatRupiah(amount) {
    if (amount === null || amount === undefined || amount === '') return '-';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export default function UpdateConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    originalDevice,
    updatedData,
    categories = [],
    loading = false,
}) {
    if (!originalDevice || !updatedData) return null;

    const oldCategory = categories.find(c => c.id === originalDevice.category_id)?.name || originalDevice.category_name || '-';
    const newCategory = categories.find(c => c.id === updatedData.category_id)?.name || '-';

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Konfirmasi Perubahan Data"
            size="md"
        >
            <div className="space-y-4 pt-1">
                {/* IDDS Official Hero Illustration */}
                <div className="bg-gradient-to-b from-blue-50/70 to-indigo-50/30 rounded-xl p-4 flex flex-col items-center text-center border border-blue-100/60">
                    <img
                        src="/images/idds/idds_confirmed.png"
                        alt="Konfirmasi Perubahan Data"
                        className="w-28 h-auto object-contain mb-2 drop-shadow-xs"
                    />
                    <h3 className="font-semibold text-gray-900 text-sm">
                        Simpan Perubahan Inventaris?
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mt-0.5">
                        Mohon periksa ringkasan perubahan di bawah ini sebelum data diperbarui di database.
                    </p>
                </div>

                {/* Perbandingan Data Sebelum vs Sesudah */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                    <div className="p-3 bg-gray-50 font-semibold text-gray-700 flex items-center justify-between">
                        <span>Perangkat: <span className="font-mono text-blue-600">{originalDevice.asset_code}</span></span>
                        <Badge text="Pembaruan" variant="info" type="soft" />
                    </div>

                    {/* Nama Perangkat */}
                    <div className="p-3 grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-gray-400 block mb-0.5">Nama Semula</span>
                            <span className="font-medium text-gray-700">{originalDevice.name}</span>
                        </div>
                        <div className="border-l border-gray-100 pl-2">
                            <span className="text-blue-600 block mb-0.5">Nama Baru</span>
                            <span className="font-semibold text-gray-900">{updatedData.name}</span>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="p-3 grid grid-cols-2 gap-2 items-center">
                        <div>
                            <span className="text-gray-400 block mb-1">Status Semula</span>
                            <StatusBadge status={originalDevice.status} label={originalDevice.status_label} />
                        </div>
                        <div className="border-l border-gray-100 pl-2">
                            <span className="text-blue-600 block mb-1">Status Baru</span>
                            <StatusBadge status={updatedData.status} />
                        </div>
                    </div>

                    {/* Kategori */}
                    <div className="p-3 grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-gray-400 block mb-0.5">Kategori Semula</span>
                            <span className="text-gray-700">{oldCategory}</span>
                        </div>
                        <div className="border-l border-gray-100 pl-2">
                            <span className="text-blue-600 block mb-0.5">Kategori Baru</span>
                            <span className="font-semibold text-gray-900">{newCategory}</span>
                        </div>
                    </div>

                    {/* Penanggung Jawab */}
                    <div className="p-3 grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-gray-400 block mb-0.5">Pemegang Semula</span>
                            <span className="text-gray-700">{originalDevice.assigned_to || '-'}</span>
                        </div>
                        <div className="border-l border-gray-100 pl-2">
                            <span className="text-blue-600 block mb-0.5">Pemegang Baru</span>
                            <span className="font-semibold text-gray-900">{updatedData.assigned_to || '-'}</span>
                        </div>
                    </div>

                    {/* Harga Pengadaan */}
                    <div className="p-3 grid grid-cols-2 gap-2">
                        <div>
                            <span className="text-gray-400 block mb-0.5">Harga Semula</span>
                            <span className="text-gray-700">{formatRupiah(originalDevice.purchase_price)}</span>
                        </div>
                        <div className="border-l border-gray-100 pl-2">
                            <span className="text-blue-600 block mb-0.5">Harga Baru</span>
                            <span className="font-semibold text-emerald-700">{formatRupiah(updatedData.purchase_price)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                    <Button
                        hierarchy="secondary"
                        size="md"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Kembali ke Form
                    </Button>
                    <Button
                        hierarchy="primary"
                        size="md"
                        onClick={onConfirm}
                        disabled={loading}
                        prefixIcon={<Save className="w-4 h-4" />}
                    >
                        {loading ? 'Menyimpan...' : 'Ya, Simpan Perubahan'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
