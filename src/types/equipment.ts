export interface EquipmentProps {
    // Name of the equipment
    name: string;
    // Optional icon component for the equipment (frontend-only, not from API).
    icon?: React.ComponentType<{ className?: string }>;

    // Detailed description of the equipment. 
    description?: string;

    // URL to an image of the equipment.
    imageUrl?: string;

    // List of targeted muscles.
    musclesTargeted?: string[];

    // List of benefits of using the equipment.
    benefits?: string[];

    // Brand
    brand?: string;

    safetyInfo?: string
}