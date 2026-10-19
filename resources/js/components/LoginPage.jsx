import React, { useState } from 'react';
import {
    TextField,
    PasswordInput,
    Button,
    Badge,
    Alert,
    Checkbox,
} from '@idds/react';
import {
    Laptop,
    LogIn,
    ShieldCheck,
    KeyRound,
    Sparkles,
    CheckCircle2,
    Info,
} from 'lucide-react';
import { login } from '../services/api';

export default function LoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const handleAutoFillDemo = () => {
        setEmail('admin@probolinggokota.go.id');
        setPassword('password123');
        setError('');
        setFieldErrors({});
    };

    const handleSubmit = async (e) => {
        e?.preventDefault();
        setError('');
        setFieldErrors({});

        // Client-side quick check
        const newFieldErrors = {};
        if (!email.trim()) {
            newFieldErrors.email = 'Alamat email wajib diisi.';
        }
        if (!password) {
            newFieldErrors.password = 'Kata sandi wajib diisi.';
        }
        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            return;
        }

        setLoading(true);
        try {
            const res = await login({
                email: email.trim(),
                password,
                remember,
            });
            if (res.user) {
                onLoginSuccess(res.user);
            }
        } catch (err) {
            if (err.errors) {
                setFieldErrors({
                    email: err.errors.email ? err.errors.email[0] : undefined,
                    password: err.errors.password ? err.errors.password[0] : undefined,
                });
            }
            setError(err.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50 flex flex-col justify-between">
            {/* Top Bar Branding */}
            <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200/80 px-6 py-3.5 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold shadow-xs">
                            <Laptop className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 text-sm tracking-tight">
                                    Inventaris Perangkat TI
                                </span>
                                <Badge text="IDDS v1.0.0" variant="info" type="soft" />
                            </div>
                            <span className="text-xs text-gray-500 block leading-none mt-0.5">
                                Diskominfo Pemerintah Kota Probolinggo
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="hidden sm:inline">Autentikasi Kedinasan Aman</span>
                    </div>
                </div>
            </header>

            {/* Center Content */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left Column: Hero & IDDS Illustration */}
                    <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Portal Pengelolaan Aset & Perangkat TIK</span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                                Sistem Informasi <br className="hidden sm:inline" />
                                <span className="text-blue-700">Inventaris Perangkat TI</span>
                            </h2>
                            <p className="text-sm text-gray-600 max-w-lg leading-relaxed">
                                Pengelolaan terpadu aset hardware, komputer kerja, laptop dinas, printer, dan infrastruktur jaringan Diskominfo Kota Probolinggo berbasis standar INA Digital Design System.
                            </p>
                        </div>

                        {/* IDDS Official Illustration */}
                        <div className="w-full max-w-md bg-white/60 p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center">
                            <img
                                src="/images/idds/idds_login_pengadaan.png"
                                alt="Ilustrasi Petugas Inventaris Perangkat TI"
                                className="w-full h-auto max-h-56 object-contain drop-shadow-xs"
                            />
                            <div className="mt-3 w-full grid grid-cols-2 gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-2xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>20 Aset Terdata</span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-gray-100 shadow-2xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>5 Kategori Perangkat</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Login Card & Evaluator Demo Box */}
                    <div className="lg:col-span-6 w-full max-w-md mx-auto space-y-4">
                        {/* Login Card */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 sm:p-8 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Masuk ke Akun Anda
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    Gunakan email kedinasan untuk mengakses data inventaris
                                </p>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <Alert
                                    state="destructive"
                                    title="Gagal Masuk"
                                    description={error}
                                />
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <TextField
                                        label="Alamat Email Kedinasan *"
                                        placeholder="nama@probolinggokota.go.id"
                                        value={email}
                                        onChange={setEmail}
                                        status={fieldErrors.email ? 'error' : 'neutral'}
                                        statusMessage={fieldErrors.email}
                                        disabled={loading}
                                        showClearButton
                                    />
                                </div>

                                <div>
                                    <PasswordInput
                                        label="Kata Sandi *"
                                        placeholder="Masukkan kata sandi"
                                        value={password}
                                        onChange={setPassword}
                                        status={fieldErrors.password ? 'error' : 'neutral'}
                                        statusMessage={fieldErrors.password}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs pt-1">
                                    <Checkbox
                                        id="remember-me-checkbox"
                                        label="Ingat saya di perangkat ini"
                                        checked={remember}
                                        onChange={(val) => setRemember(val)}
                                        disabled={loading}
                                    />
                                    <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
                                        Lupa sandi?
                                    </span>
                                </div>

                                <div className="pt-2">
                                    <Button
                                        hierarchy="primary"
                                        size="lg"
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex justify-center items-center gap-2"
                                        prefixIcon={<LogIn className="w-4 h-4" />}
                                    >
                                        {loading ? 'Memverifikasi...' : 'Masuk ke Sistem'}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Evaluator Demo Credentials Card */}
                        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-900 font-semibold text-xs">
                                    <KeyRound className="w-4 h-4 text-amber-700" />
                                    <span>Akses Akun Demo Penguji / Evaluator</span>
                                </div>
                                <Badge text="Demo Aktif" variant="warning" type="soft" />
                            </div>

                            <p className="text-xs text-amber-800 leading-relaxed">
                                Gunakan kredensial administrator berikut untuk pengujian dan evaluasi teknis aplikasi:
                            </p>

                            <div className="bg-white/90 border border-amber-200 rounded-lg p-2.5 text-xs space-y-1 font-mono text-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-sans">Email:</span>
                                    <span className="font-semibold text-gray-900 select-all">admin@probolinggokota.go.id</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-sans">Password:</span>
                                    <span className="font-semibold text-gray-900 select-all">password123</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500 font-sans">Role:</span>
                                    <span className="text-amber-800 font-sans font-medium">Administrator Diskominfo</span>
                                </div>
                            </div>

                            <Button
                                hierarchy="secondary"
                                size="sm"
                                type="button"
                                onClick={handleAutoFillDemo}
                                className="w-full border-amber-300 text-amber-900 hover:bg-amber-100"
                                prefixIcon={<Sparkles className="w-3.5 h-3.5 text-amber-700" />}
                            >
                                Gunakan Akun Demo (Isi Otomatis)
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-white border-t border-gray-200 py-4 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
                    <p>
                        © 2026 Pemerintah Kota Probolinggo — Dinas Komunikasi dan Informatika
                    </p>
                    <p className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-gray-400" />
                        <span>Sistem Uji Kompetensi Berbasis INA Digital Design System</span>
                    </p>
                </div>
            </footer>
        </div>
    );
}
