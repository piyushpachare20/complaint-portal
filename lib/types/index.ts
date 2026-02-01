// User Types
export type UserRole = 'citizen' | 'nagarasevaka';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    ward_id: number | null;
    phone_number: string | null;
    created_at: string;
    updated_at: string;
}

export interface AuthSession {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Grievance Types
export type GrievanceStatus = 'open' | 'in_progress' | 'resolved' | 'rejected';
export type GrievanceCategory =
    | 'pothole'
    | 'garbage'
    | 'water_leak'
    | 'street_light'
    | 'drainage'
    | 'other';

export interface Grievance {
    id: number;
    title: string;
    description: string;
    category: GrievanceCategory;
    status: GrievanceStatus;
    photo_url: string | null;
    latitude: number | null;
    longitude: number | null;
    ward_id: number;
    created_by: string;
    assigned_to: string | null;
    resolution_remarks: string | null;
    created_at: string;
    updated_at: string;
    resolved_at: string | null;
}

export interface Ward {
    id: number;
    name: string;
    area_name: string | null;
    description: string | null;
    created_at: string;
}

export interface StatusUpdate {
    id: number;
    grievance_id: number;
    old_status: string | null;
    new_status: string;
    updated_by: string;
    remarks: string | null;
    created_at: string;
}

// Form Types
export interface CreateGrievanceInput {
    title: string;
    description: string;
    category: GrievanceCategory;
    photo?: File;
    latitude?: number;
    longitude?: number;
}

export interface UpdateGrievanceInput {
    status: GrievanceStatus;
    resolution_remarks?: string;
}
