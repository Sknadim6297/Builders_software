import SidebarLayout from '@/Layouts/SidebarLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <SidebarLayout>
            <Head title="Admin Profile" />

            <div className="p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-200">Admin Profile</h1>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Manage your account settings and preferences.</p>
                </div>

                <div className="max-w-4xl space-y-6">
                    {/* Profile Information Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg mr-4">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Profile Information</h2>
                                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Update your account's profile information and email address.</p>
                            </div>
                        </div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className=""
                        />
                    </div>

                    {/* Update Password Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-200">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg mr-4">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Update Password</h2>
                                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Ensure your account is using a long, random password to stay secure.</p>
                            </div>
                        </div>
                        <UpdatePasswordForm className="" />
                    </div>

                    {/* Delete Account Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-200 dark:border-red-800 p-6 transition-colors duration-200">
                        <div className="flex items-center mb-6">
                            <div className="h-12 w-12 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg mr-4">
                                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white transition-colors duration-200">Delete Account</h2>
                                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">Permanently delete your account and all associated data.</p>
                            </div>
                        </div>
                        <DeleteUserForm className="" />
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
