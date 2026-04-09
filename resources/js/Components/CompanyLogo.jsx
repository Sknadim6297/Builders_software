import { usePage } from '@inertiajs/react';

export default function CompanyLogo({ className = '', alt = 'Company Logo' }) {
    const companyLogo = usePage().props.companySettings?.company_logo || '/images/sayan-sita-logo.png';

    return (
        <img
            src={companyLogo}
            alt={alt}
            className={className}
        />
    );
}