/**
 * API Service for Device and Category management
 */

const API_BASE = '/api';

async function handleResponse(response) {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
        const error = new Error(data?.message || 'Terjadi kesalahan pada sistem.');
        error.status = response.status;
        error.errors = data?.errors || {};
        throw error;
    }
    return data;
}

export async function getDevices() {
    const res = await fetch(`${API_BASE}/devices`, {
        headers: {
            'Accept': 'application/json',
        },
    });
    return handleResponse(res);
}

export async function getCategories() {
    const res = await fetch(`${API_BASE}/categories`, {
        headers: {
            'Accept': 'application/json',
        },
    });
    return handleResponse(res);
}

export async function getDevice(id) {
    const res = await fetch(`${API_BASE}/devices/${id}`, {
        headers: {
            'Accept': 'application/json',
        },
    });
    return handleResponse(res);
}

export async function createDevice(payload) {
    const res = await fetch(`${API_BASE}/devices`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function updateDevice(id, payload) {
    const res = await fetch(`${API_BASE}/devices/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    return handleResponse(res);
}

export async function deleteDevice(id) {
    const res = await fetch(`${API_BASE}/devices/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
        },
    });
    return handleResponse(res);
}

export async function login(credentials) {
    const res = await fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    return handleResponse(res);
}

export async function logout() {
    const res = await fetch('/auth/logout', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
        },
    });
    return handleResponse(res);
}

export async function getMe() {
    const res = await fetch('/auth/me', {
        headers: {
            'Accept': 'application/json',
        },
    });
    return handleResponse(res);
}

