import React from 'react';
import { SelectDropdown, Button } from '@idds/react';
import { Search, RotateCcw } from 'lucide-react';

const STATUS_FILTER_OPTIONS = [
    { label: 'Semua Status', value: 'ALL' },
    { label: 'Tersedia', value: 'tersedia' },
    { label: 'Digunakan', value: 'digunakan' },
    { label: 'Perbaikan', value: 'perbaikan' },
];

export default function DeviceFilters({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedStatus,
    onStatusChange,
    categories = [],
    onReset,
}) {
    const categoryFilterOptions = [
        { label: 'Semua Kategori', value: 'ALL' },
        ...categories.map(c => ({
            label: `${c.name} (${c.device_count || 0})`,
            value: String(c.id),
        })),
    ];

    const hasActiveFilter = searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL';

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* Search Bar */}
                <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Pencarian
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Cari kode aset, nama, merek, atau unit pemegang..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                </div>

                {/* Filter Kategori */}
                <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Kategori
                    </label>
                    <SelectDropdown
                        options={categoryFilterOptions}
                        selected={selectedCategory}
                        onSelect={(val) => onCategoryChange(val)}
                        placeholder="Pilih Kategori"
                        size="md"
                    />
                </div>

                {/* Filter Status */}
                <div className="md:col-span-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        Status
                    </label>
                    <SelectDropdown
                        options={STATUS_FILTER_OPTIONS}
                        selected={selectedStatus}
                        onSelect={(val) => onStatusChange(val)}
                        placeholder="Pilih Status"
                        size="md"
                    />
                </div>

                {/* Reset Filters */}
                <div className="md:col-span-1 flex justify-end">
                    {hasActiveFilter && (
                        <Button
                            hierarchy="tertiary"
                            size="md"
                            onClick={onReset}
                            title="Reset Filter"
                            className="w-full"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
