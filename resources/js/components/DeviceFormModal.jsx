import React, { useState, useEffect } from 'react';
import {
    Modal,
    Button,
    TextField,
    TextArea,
    SelectDropdown,
    Alert,
} from '@idds/react';
import { Save } from 'lucide-react';

const STATUS_OPTIONS = [
    { label: 'Tersedia', value: 'tersedia' },
    { label: 'Digunakan', value: 'digunakan' },
    { label: 'Perbaikan', value: 'perbaikan' },
];

export default function DeviceFormModal({
    isOpen,
    onClose,
    onSubmit,
    onRequestUpdateConfirm,
    device = null,
    categories = [],
    loading = false,
}) {
    const isEdit = Boolean(device);

    const [formData, setFormData] = useState({
        asset_code: '',
        name: '',
        brand: '',
        serial_number: '',
        category_id: '',
        status: 'tersedia',
        assigned_to: '',
        purchase_date: '',
        purchase_price: '',
        notes: '',
    });

    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');

    useEffect(() => {
        if (device) {
            setFormData({
                asset_code: device.asset_code || '',
                name: device.name || '',
                brand: device.brand || '',
                serial_number: device.serial_number || '',
                category_id: device.category_id || '',
                status: device.status || 'tersedia',
                assigned_to: device.assigned_to || '',
                purchase_date: device.purchase_date || '',
                purchase_price: device.purchase_price !== null && device.purchase_price !== undefined ? String(device.purchase_price) : '',
                notes: device.notes || '',
            });
        } else {
            setFormData({
                asset_code: '',
                name: '',
                brand: '',
                serial_number: '',
                category_id: categories.length > 0 ? categories[0].id : '',
                status: 'tersedia',
                assigned_to: '',
                purchase_date: '',
                purchase_price: '',
                notes: '',
            });
        }
        setErrors({});
        setGeneralError('');
    }, [device, isOpen, categories]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setGeneralError('');
        setErrors({});

        // Client-side quick validation
        const localErrors = {};
        if (!formData.asset_code.trim()) {
            localErrors.asset_code = ['Kode aset wajib diisi.'];
        }
        if (!formData.name.trim()) {
            localErrors.name = ['Nama perangkat wajib diisi.'];
        }
        if (!formData.category_id) {
            localErrors.category_id = ['Kategori wajib dipilih.'];
        }
        if (!formData.status) {
            localErrors.status = ['Status wajib dipilih.'];
        }

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            return;
        }

        const payload = {
            asset_code: formData.asset_code.trim(),
            name: formData.name.trim(),
            brand: formData.brand.trim() || null,
            serial_number: formData.serial_number.trim() || null,
            category_id: Number(formData.category_id),
            status: formData.status,
            assigned_to: formData.assigned_to.trim() || null,
            purchase_date: formData.purchase_date || null,
            purchase_price: formData.purchase_price !== '' ? Number(formData.purchase_price) : null,
            notes: formData.notes.trim() || null,
        };

        if (isEdit && onRequestUpdateConfirm) {
            // Buka modal konfirmasi ubah data sebelum dikirim ke backend
            onRequestUpdateConfirm(payload, device);
            return;
        }

        try {
            await onSubmit(payload, device?.id);
            onClose();
        } catch (err) {
            if (err.errors) {
                setErrors(err.errors);
            }
            setGeneralError(err.message || 'Gagal menyimpan data.');
        }
    };

    const categoryOptions = categories.map(c => ({
        label: c.name,
        value: c.id,
    }));

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            title={isEdit ? 'Ubah Data Perangkat TI' : 'Tambah Perangkat TI Baru'}
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {generalError && (
                    <Alert
                        state="destructive"
                        title="Terjadi Kesalahan"
                        description={generalError}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Kode Aset */}
                    <div>
                        <TextField
                            label="Kode Aset *"
                            placeholder="Contoh: KT-001, LT-002"
                            value={formData.asset_code}
                            onChange={(val) => handleChange('asset_code', val)}
                            status={errors.asset_code ? 'error' : 'neutral'}
                            statusMessage={errors.asset_code ? errors.asset_code[0] : undefined}
                            disabled={loading}
                            showClearButton
                        />
                        <p className="text-xs text-gray-400 mt-1">Harus unik dan tidak boleh sama.</p>
                    </div>

                    {/* Nama Perangkat */}
                    <div>
                        <TextField
                            label="Nama Perangkat *"
                            placeholder="Contoh: Komputer Sekretariat"
                            value={formData.name}
                            onChange={(val) => handleChange('name', val)}
                            status={errors.name ? 'error' : 'neutral'}
                            statusMessage={errors.name ? errors.name[0] : undefined}
                            disabled={loading}
                            showClearButton
                        />
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Kategori *
                        </label>
                        <SelectDropdown
                            options={categoryOptions}
                            selected={formData.category_id}
                            onSelect={(val) => handleChange('category_id', val)}
                            placeholder="Pilih Kategori"
                            size="md"
                        />
                        {errors.category_id && (
                            <p className="text-xs text-red-600 mt-1">{errors.category_id[0]}</p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status Perangkat *
                        </label>
                        <SelectDropdown
                            options={STATUS_OPTIONS}
                            selected={formData.status}
                            onSelect={(val) => handleChange('status', val)}
                            placeholder="Pilih Status"
                            size="md"
                        />
                        {errors.status && (
                            <p className="text-xs text-red-600 mt-1">{errors.status[0]}</p>
                        )}
                    </div>

                    {/* Brand / Merek */}
                    <div>
                        <TextField
                            label="Merek / Brand"
                            placeholder="Contoh: Dell, Lenovo, Epson"
                            value={formData.brand}
                            onChange={(val) => handleChange('brand', val)}
                            status={errors.brand ? 'error' : 'neutral'}
                            statusMessage={errors.brand ? errors.brand[0] : undefined}
                            disabled={loading}
                            showClearButton
                        />
                    </div>

                    {/* Serial Number */}
                    <div>
                        <TextField
                            label="Nomor Seri / Serial Number"
                            placeholder="Contoh: SN-8923482"
                            value={formData.serial_number}
                            onChange={(val) => handleChange('serial_number', val)}
                            status={errors.serial_number ? 'error' : 'neutral'}
                            statusMessage={errors.serial_number ? errors.serial_number[0] : undefined}
                            disabled={loading}
                            showClearButton
                        />
                    </div>

                    {/* Unit / Penanggung Jawab */}
                    <div>
                        <TextField
                            label="Unit / Penanggung Jawab"
                            placeholder="Contoh: Sekretariat, Dinas A, Unit Teknis"
                            value={formData.assigned_to}
                            onChange={(val) => handleChange('assigned_to', val)}
                            status={errors.assigned_to ? 'error' : 'neutral'}
                            statusMessage={errors.assigned_to ? errors.assigned_to[0] : undefined}
                            disabled={loading}
                            showClearButton
                        />
                    </div>

                    {/* Tanggal Perolehan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tanggal Perolehan
                        </label>
                        <input
                            type="date"
                            value={formData.purchase_date}
                            onChange={(e) => handleChange('purchase_date', e.target.value)}
                            disabled={loading}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        {errors.purchase_date && (
                            <p className="text-xs text-red-600 mt-1">{errors.purchase_date[0]}</p>
                        )}
                    </div>

                    {/* Nilai Perolehan */}
                    <div className="md:col-span-2">
                        <TextField
                            label="Nilai Perolehan (Rupiah)"
                            placeholder="Contoh: 750000"
                            value={formData.purchase_price}
                            onChange={(val) => handleChange('purchase_price', val.replace(/\D/g, ''))}
                            status={errors.purchase_price ? 'error' : 'neutral'}
                            statusMessage={errors.purchase_price ? errors.purchase_price[0] : undefined}
                            disabled={loading}
                            showClearButton
                        />
                        <p className="text-xs text-gray-400 mt-1">Harus angka positif (&ge; 0).</p>
                    </div>

                    {/* Catatan Tambahan */}
                    <div className="md:col-span-2">
                        <TextArea
                            label="Catatan Tambahan"
                            placeholder="Keterangan spesifikasi, kondisi terkini, atau lokasi..."
                            value={formData.notes}
                            onChange={(val) => handleChange('notes', val)}
                            status={errors.notes ? 'error' : 'neutral'}
                            errorMessage={errors.notes ? errors.notes[0] : undefined}
                            rows={3}
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                    <Button
                        hierarchy="secondary"
                        size="md"
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Batal
                    </Button>
                    <Button
                        hierarchy="primary"
                        size="md"
                        type="submit"
                        disabled={loading}
                        prefixIcon={<Save className="w-4 h-4" />}
                    >
                        {loading ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Perangkat')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
