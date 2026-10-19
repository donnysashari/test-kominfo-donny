import React from 'react';
import { Button, Badge } from '@idds/react';
import { Plus, Laptop, RefreshCw, LogOut } from 'lucide-react';

export default function Navbar({
    user,
    onLogout,
    onAddDevice,
    onRefresh,
    loading = false,
    logoutLoading = false,
}) {
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand / Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold shadow-sm">
                            <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-semibold text-gray-900 text-base leading-tight">
                                    Inventaris Perangkat TI
                                </h1>
                                <Badge text="IDDS" variant="info" type="soft" />
                            </div>
                            <p className="text-xs text-gray-500">
                                Diskominfo Kota Probolinggo
                            </p>
                        </div>
                    </div>

                    {/* Actions & User Auth */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Button
                            hierarchy="secondary"
                            size="md"
                            onClick={onRefresh}
                            disabled={loading}
                            prefixIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                        >
                            <span className="hidden sm:inline">Segarkan</span>
                        </Button>
                        <Button
                            hierarchy="primary"
                            size="md"
                            onClick={onAddDevice}
                            prefixIcon={<Plus className="w-4 h-4" />}
                        >
                            <span className="hidden sm:inline">Tambah Perangkat</span>
                        </Button>

                        {/* User Profile & Logout Button */}
                        {user && (
                            <div className="flex items-center pl-2 sm:pl-3 border-l border-gray-200 gap-2">
                                <div className="hidden lg:flex flex-col text-right">
                                    <span className="text-xs font-semibold text-gray-800 leading-none">
                                        {user.name}
                                    </span>
                                    <span className="text-[11px] text-gray-500 leading-none mt-1">
                                        {user.email}
                                    </span>
                                </div>
                                <Button
                                    hierarchy="secondary"
                                    size="md"
                                    onClick={onLogout}
                                    disabled={logoutLoading}
                                    className="text-red-700 hover:text-red-800 hover:bg-red-50 border-gray-300"
                                    prefixIcon={<LogOut className="w-4 h-4 text-red-600" />}
                                    title="Keluar dari sistem"
                                >
                                    <span className="hidden sm:inline">Keluar</span>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
