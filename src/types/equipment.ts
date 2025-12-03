export interface EquipmentProps {
    title: string;
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
    videoUrl?: string;
    musclesTargeted?: string[];
    benefits?: string[];
}