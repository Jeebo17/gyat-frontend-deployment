export interface EquipmentProps {
    // Name of the equipment.
    title: string;
    // Optional icon component for the equipment.
    icon?: React.ComponentType<{ className?: string }>;

    // Detailed description of the equipment. 
    description?: string;

    // URL to a video demonstrating the equipment.
    videoUrl?: string;

    // List of targeted muscles.
    musclesTargeted?: string[];

    // List of benefits of using the equipment.
    benefits?: string[];
}