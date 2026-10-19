import React from 'react';
import { Modal, Button } from '@idds/react';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    device = null,
    loading = false,
}) {
    if (!device) return null;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title="Konfirmasi Hapus Data"
            size="sm"
        >
            <div className="space-y-4 pt-1">
                {/* IDDS Official Danger Illustration */}
                <div className="bg-gradient-to-b from-rose-50/80 to-red-50/40 rounded-xl p-4 flex flex-col items-center text-center border border-red-100">
                    <img
                        src="/images/idds/idds_appology.png"
                        alt="Konfirmasi Hapus Data"
                        className="w-28 h-auto object-contain mb-2 drop-shadow-xs"
                    />
                    <h3 className="font-semibold text-gray-900 text-sm">
                        Hapus Perangkat dari Sistem?
                    </h3>
                    <p className="text-xs text-gray-500 max-w-xs mt-0.5">
                        Tindakan ini permanen. Seluruh riwayat perangkat ini akan dihapus dari basis data inventaris.
                    </p>
                </div>

                {/* Target Device Info Card */}
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-1">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Kode Aset:</span>
                        <span className="font-mono font-semibold text-gray-900">{device.asset_code}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Nama Perangkat:</span>
                        <span className="font-medium text-gray-900">{device.name}</span>
                    </div>
                    {device.assigned_to && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Pemegang:</span>
                            <span className="text-gray-700">{device.assigned_to}</span>
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center gap-2 pt-2 border-t border-gray-100">
                    <Button
                        hierarchy="secondary"
                        size="md"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        hierarchy="primary"
                        size="md"
                        onClick={() => onConfirm(device.id)}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white"
                        prefixIcon={<Trash2 className="w-4 h-4" />}
                    >
                        {loading ? 'Menghapus...' : 'Ya, Hapus Data'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
