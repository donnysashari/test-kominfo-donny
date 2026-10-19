import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ToastProvider, useToast, Alert, Button, Spinner } from '@idds/react';
import { RefreshCw } from 'lucide-react';

import Navbar from './components/Navbar';
import StatsCards from './components/StatsCards';
import DeviceFilters from './components/DeviceFilters';
import DeviceTable from './components/DeviceTable';
import DeviceFormModal from './components/DeviceFormModal';
import DeviceDetailModal from './components/DeviceDetailModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import UpdateConfirmModal from './components/UpdateConfirmModal';
import LoginPage from './components/LoginPage';

import {
    getDevices,
    getCategories,
    createDevice,
    updateDevice,
    deleteDevice,
    getMe,
    logout,
} from './services/api';

function InventoryContent() {
    const { toast } = useToast();

    // Auth states
    const [user, setUser] = useState(null);
    const [authChecking, setAuthChecking] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);

    // Data states
    const [devices, setDevices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [selectedStatus, setSelectedStatus] = useState('ALL');

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);

    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailDevice, setDetailDevice] = useState(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingDevice, setDeletingDevice] = useState(null);

    // Update confirmation states
    const [isUpdateConfirmOpen, setIsUpdateConfirmOpen] = useState(false);
    const [pendingUpdateData, setPendingUpdateData] = useState(null);

    // Check auth on mount
    useEffect(() => {
        let isMounted = true;
        async function verifySession() {
            try {
                const res = await getMe();
                if (isMounted) {
                    setUser(res?.user || null);
                }
            } catch {
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setAuthChecking(false);
                }
            }
        }
        verifySession();
        return () => {
            isMounted = false;
        };
    }, []);

    // Load initial inventory data when user is authenticated
    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [devicesRes, categoriesRes] = await Promise.all([
                getDevices(),
                getCategories(),
            ]);
            setDevices(devicesRes.data || []);
            setCategories(categoriesRes.data || []);
        } catch (err) {
            setError(err.message || 'Gagal memuat data dari server backend.');
            toast?.({
                state: 'negative',
                title: 'Koneksi Gagal',
                description: 'Tidak dapat menghubungkan ke API backend Laravel.',
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, loadData]);

    const handleLoginSuccess = (authenticatedUser) => {
        setUser(authenticatedUser);
        toast?.({
            state: 'positive',
            title: 'Login Berhasil',
            description: `Selamat datang, ${authenticatedUser.name}!`,
        });
    };

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await logout();
            setUser(null);
            setDevices([]);
            toast?.({
                state: 'positive',
                title: 'Logout Berhasil',
                description: 'Anda telah keluar dari sesi kedinasan.',
            });
        } catch (err) {
            toast?.({
                state: 'negative',
                title: 'Logout Gagal',
                description: err.message || 'Terjadi kesalahan saat keluar sistem.',
            });
        } finally {
            setLogoutLoading(false);
        }
    };

    // Filtered devices calculation
    const filteredDevices = useMemo(() => {
        return devices.filter((device) => {
            // Category filter
            if (selectedCategory !== 'ALL' && String(device.category_id) !== String(selectedCategory)) {
                return false;
            }

            // Status filter
            if (selectedStatus !== 'ALL' && String(device.status || '').toLowerCase() !== String(selectedStatus).toLowerCase()) {
                return false;
            }

            // Search query filter
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const code = (device.asset_code || '').toLowerCase();
                const name = (device.name || '').toLowerCase();
                const brand = (device.brand || '').toLowerCase();
                const serial = (device.serial_number || '').toLowerCase();
                const assigned = (device.assigned_to || '').toLowerCase();
                const cat = (device.category_name || '').toLowerCase();

                if (!code.includes(q) && !name.includes(q) && !brand.includes(q) && !serial.includes(q) && !assigned.includes(q) && !cat.includes(q)) {
                    return false;
                }
            }

            return true;
        });
    }, [devices, searchQuery, selectedCategory, selectedStatus]);

    // Handlers
    const handleAddClick = () => {
        setEditingDevice(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (device) => {
        setEditingDevice(device);
        setIsFormOpen(true);
    };

    const handleViewDetailClick = (device) => {
        setDetailDevice(device);
        setIsDetailOpen(true);
    };

    const handleDeleteClick = (device) => {
        setDeletingDevice(device);
        setIsDeleteOpen(true);
    };

    const handleResetFilters = () => {
        setSearchQuery('');
        setSelectedCategory('ALL');
        setSelectedStatus('ALL');
    };

    // Triggered by DeviceFormModal when editing
    const handleRequestUpdateConfirm = (payload, device) => {
        setPendingUpdateData(payload);
        setIsUpdateConfirmOpen(true);
    };

    // User confirmed update in UpdateConfirmModal
    const handleConfirmUpdateSubmit = async () => {
        if (!editingDevice || !pendingUpdateData) return;
        setActionLoading(true);
        try {
            const res = await updateDevice(editingDevice.id, pendingUpdateData);
            const updated = res.data;
            setDevices(prev => prev.map(d => (d.id === editingDevice.id ? updated : d)));
            setIsUpdateConfirmOpen(false);
            setIsFormOpen(false);
            setEditingDevice(null);
            setPendingUpdateData(null);
            // Refresh category counts
            getCategories().then(cRes => setCategories(cRes.data || []));
            toast?.({
                state: 'positive',
                title: 'Data Berhasil Diperbarui',
                description: `Perubahan pada perangkat ${updated.name} telah disimpan.`,
            });
        } catch (err) {
            toast?.({
                state: 'negative',
                title: 'Gagal Memperbarui',
                description: err.message || 'Terjadi kesalahan saat menyimpan perubahan.',
            });
        } finally {
            setActionLoading(false);
        }
    };

    // Direct submit for creation
    const handleCreateSubmit = async (payload) => {
        setActionLoading(true);
        try {
            const res = await createDevice(payload);
            const created = res.data;
            setDevices(prev => [created, ...prev]);
            getCategories().then(cRes => setCategories(cRes.data || []));
            toast?.({
                state: 'positive',
                title: 'Perangkat Ditambahkan',
                description: `Perangkat ${created.name} (${created.asset_code}) berhasil didaftarkan.`,
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteConfirm = async (id) => {
        setActionLoading(true);
        try {
            await deleteDevice(id);
            setDevices(prev => prev.filter(d => d.id !== id));
            setIsDeleteOpen(false);
            setDeletingDevice(null);
            getCategories().then(cRes => setCategories(cRes.data || []));
            toast?.({
                state: 'positive',
                title: 'Data Dihapus',
                description: 'Perangkat berhasil dihapus dari inventaris.',
            });
        } catch (err) {
            toast?.({
                state: 'negative',
                title: 'Gagal Menghapus',
                description: err.message || 'Terjadi kesalahan saat menghapus data.',
            });
        } finally {
            setActionLoading(false);
        }
    };

    // 1. Initial Auth Loading Screen
    if (authChecking) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <Spinner
                    size={48}
                    title="Menyiapkan Sistem"
                    subtitle="Memeriksa sesi otentikasi Diskominfo..."
                />
            </div>
        );
    }

    // 2. Unauthenticated: Show Login Page
    if (!user) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    // 3. Authenticated: Show Full Dashboard
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Navbar */}
            <Navbar
                user={user}
                onLogout={handleLogout}
                logoutLoading={logoutLoading}
                onAddDevice={handleAddClick}
                onRefresh={loadData}
                loading={loading}
            />

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Stats Overview */}
                <StatsCards devices={devices} />

                {/* Error Banner */}
                {error && (
                    <div className="space-y-3">
                        <Alert
                            state="destructive"
                            title="Gagal Memuat Data"
                            description={error}
                        />
                        <Button
                            hierarchy="secondary"
                            size="md"
                            onClick={loadData}
                            prefixIcon={<RefreshCw className="w-4 h-4" />}
                        >
                            Coba Lagi
                        </Button>
                    </div>
                )}

                {/* Filter and Search Bar */}
                <DeviceFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    categories={categories}
                    onReset={handleResetFilters}
                />

                {/* Device Table */}
                <DeviceTable
                    devices={filteredDevices}
                    loading={loading}
                    onViewDetail={handleViewDetailClick}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                    onAddDevice={handleAddClick}
                    onResetFilters={handleResetFilters}
                    hasFilter={Boolean(searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL')}
                />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
                    <p>
                        © 2026 Pemerintah Kota Probolinggo — Dinas Komunikasi dan Informatika
                    </p>
                    <p>
                        Dibangun dengan Laravel 13, React, Tailwind CSS, & IDDS (INA Digital Design System)
                    </p>
                </div>
            </footer>

            {/* Modal Form Tambah / Ubah */}
            <DeviceFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreateSubmit}
                onRequestUpdateConfirm={handleRequestUpdateConfirm}
                device={editingDevice}
                categories={categories}
                loading={actionLoading}
            />

            {/* Modal Konfirmasi Ubah Data (Edit Confirmation) */}
            <UpdateConfirmModal
                isOpen={isUpdateConfirmOpen}
                onClose={() => setIsUpdateConfirmOpen(false)}
                onConfirm={handleConfirmUpdateSubmit}
                originalDevice={editingDevice}
                updatedData={pendingUpdateData}
                categories={categories}
                loading={actionLoading}
            />

            {/* Modal Detail Perangkat */}
            <DeviceDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                device={detailDevice}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
            />

            {/* Modal Konfirmasi Hapus Data (Delete Confirmation) */}
            <DeleteConfirmModal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteConfirm}
                device={deletingDevice}
                loading={actionLoading}
            />
        </div>
    );
}

export default function InventoryApp() {
    return (
        <ToastProvider>
            <InventoryContent />
        </ToastProvider>
    );
}
