import React, { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Show({ user, flash }) {
    // Show flash messages as toasts
    useEffect(() => {
        if (flash?.success) {
            window.showSuccess(flash.success);
        }
        if (flash?.error) {
            window.showError(flash.error);
        }
        if (flash?.warning) {
            window.showWarning(flash.warning);
        }
        if (flash?.info) {
            window.showInfo(flash.info);
        }
    }, [flash]);

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this admin user?')) {
            router.delete(route('admin-users.destroy', user.id), {
                onSuccess: () => {
                    window.showSuccess('Admin user deleted successfully!');
                },
                onError: () => {
                    window.showError('Failed to delete admin user.');
                }
            });
        }
    };

    return (
        <SidebarLayout>
            <Head title={`Admin User: ${user.name}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin User Details</h1>
                        <p className="text-gray-600">View admin user information and permissions</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link
                            href={route('admin-users.edit', user.id)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                            <TrashIcon className="w-4 h-4 mr-2" />
                            Delete
                        </button>
                        <Link
                            href={route('admin-users.index')}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowLeftIcon className="w-4 h-4 mr-2" />
                            Back to List
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">User Information</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{user.name}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Role</dt>
                                        <dd className="mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.role?.name === 'super_admin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.role?.display_name || 'No Role'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                                        <dd className="mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.is_super_admin 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {user.is_super_admin ? 'Super Admin' : 'Regular Admin'}
                                            </span>
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Created</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {new Date(user.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Permissions</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {user.is_super_admin 
                                        ? 'Super Admin has access to all features' 
                                        : `This user has ${user.permissions?.length || 0} permission(s) assigned`
                                    }
                                </p>
                            </div>
                            <div className="p-6">
                                {user.is_super_admin ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">Super Admin Access</h3>
                                        <p className="mt-2 text-sm text-gray-500">
                                            This user has full access to all features and modules in the system.
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        {user.permissions && user.permissions.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {user.permissions.map((permission) => (
                                                    <div key={permission.id} className="flex items-center space-x-3 p-3 border rounded-lg bg-gray-50">
                                                        {permission.icon && (
                                                            <div className="w-5 h-5 text-gray-600" dangerouslySetInnerHTML={{ __html: permission.icon }} />
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {permission.display_name}
                                                            </div>
                                                            {permission.description && (
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    {permission.description}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                                <h3 className="mt-4 text-lg font-medium text-gray-900">No Permissions Assigned</h3>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    This user doesn't have any permissions assigned yet.
                                                </p>
                                                <div className="mt-6">
                                                    <Link
                                                        href={route('admin-users.edit', user.id)}
                                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                                    >
                                                        <PencilIcon className="w-4 h-4 mr-2" />
                                                        Assign Permissions
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
