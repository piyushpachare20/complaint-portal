// Utility function for merging class names
export function cn(...inputs: (string | undefined | null | false)[]) {
    return inputs.filter(Boolean).join(' ');
}

export const CATEGORIES = [
    { value: 'pothole', label: 'Pothole', label_mr: 'खड्डा' },
    { value: 'garbage', label: 'Garbage', label_mr: 'कचरा' },
    { value: 'water_leak', label: 'Water Leak', label_mr: 'पाणी गळती' },
    { value: 'street_light', label: 'Street Light', label_mr: 'रस्त्याचा दिवा' },
    { value: 'drainage', label: 'Drainage', label_mr: 'गटार' },
    { value: 'other', label: 'Other', label_mr: 'इतर' },
] as const;

export const STATUSES = [
    { value: 'open', label: 'Open', label_mr: 'उघडे', color: 'amber' },
    { value: 'in_progress', label: 'In Progress', label_mr: 'प्रगतीपथावर', color: 'blue' },
    { value: 'resolved', label: 'Resolved', label_mr: 'निराकरण झाले', color: 'green' },
    { value: 'rejected', label: 'Rejected', label_mr: 'नाकारले', color: 'red' },
] as const;
