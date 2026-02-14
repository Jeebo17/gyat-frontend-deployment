import { TileProps } from "../types/tile";
import { TbTreadmill } from "react-icons/tb";
import { MdElectricBolt, MdRowing } from "react-icons/md";
import { GiWeightLiftingUp  } from "react-icons/gi";
import { IoBarbell  } from "react-icons/io5";
import { GrYoga } from "react-icons/gr";

const treadmillEquipment = {
    name: "Treadmill",
    icon: TbTreadmill,
    description: "An indoor running platform for walking, jogging, or running. Adjustable speed and incline allow modulation of intensity, engaging cardiovascular and lower-body musculature.",
    musclesTargeted: [
        "Quadriceps (knee extension)",
        "Hamstrings (hip extension and knee flexion)",
        "Gluteus maximus (hip extension)",
        "Gastrocnemius and soleus (push-off)",
        "Core stabilisers (postural control)"
    ],
    benefits: [
        "Enhances cardiorespiratory fitness by improving VO₂ max and heart efficiency",
        "Promotes lower body muscular endurance and strength",
        "Supports weight management and caloric expenditure",
        "Reduces joint impact compared to outdoor running due to cushioned deck",
        "Allows for structured interval training and controlled gait analysis"
    ],
    videoUrl: "https://www.example.com/treadmill-demo" // optional
}



export function getInitialTiles(): TileProps[] {
    return [
        { id: 1, xCoord: 20, yCoord: 160, width: 240, height: 100, rotation: 0, colour: "red", equipment: treadmillEquipment },
        { id: 2, xCoord: 20, yCoord: 280, width: 240, height: 100, rotation: 0, colour: "red", equipment: { name: "Treadmill", icon: TbTreadmill } },
        { id: 3, xCoord: 20, yCoord: 400, width: 240, height: 100, rotation: 0, colour: "red", equipment: { name: "Treadmill", icon: TbTreadmill } },
        { id: 4, xCoord: 20, yCoord: 540, width: 240, height: 100, rotation: 0, colour: "blue", equipment: { name: "Rowing Machine", icon: MdRowing } },
        { id: 5, xCoord: 20, yCoord: 660, width: 240, height: 100, rotation: 0, colour: "blue", equipment: { name: "Rowing Machine", icon: MdRowing } },
        { id: 6, xCoord: 400, yCoord: 20, width: 240, height: 160, rotation: 0, colour: "green", equipment: { name: "Racks", icon: GiWeightLiftingUp  } },
        { id: 7, xCoord: 700, yCoord: 20, width: 240, height: 160, rotation: 0, colour: "green", equipment: { name: "Racks", icon: GiWeightLiftingUp  } },
        { id: 8, xCoord: 1000, yCoord: 20, width: 240, height: 160, rotation: 0, colour: "green", equipment: { name: "Racks", icon: GiWeightLiftingUp  } },
        { id: 9, xCoord: 1140, yCoord: 340, width: 550, height: 300, rotation: 0, colour: "purple", equipment: { name: "Free Weights", icon: IoBarbell } },
        { id: 10, xCoord: 400, yCoord: 500, width: 500, height: 280, rotation: 0, colour: "orange", equipment: { name: "Open Space", icon: GrYoga } },
        { id: 11, xCoord: 600, yCoord: 300, width: 100, height: 100, rotation: 0, colour: "yellow", equipment: { name: "Resistance Machine", icon: MdElectricBolt } },
        { id: 12, xCoord: 800, yCoord: 300, width: 100, height: 100, rotation: 0, colour: "yellow", equipment: { name: "Resistance Machine", icon: MdElectricBolt } },
        { id: 13, xCoord: 950, yCoord: 300, width: 100, height: 100, rotation: 0, colour: "yellow", equipment: { name: "Resistance Machine", icon: MdElectricBolt } },
        { id: 14, xCoord: 1000, yCoord: 760, width: 160, height: 40, rotation: 0, colour: "gray", equipment: { name: "Entrance", icon: undefined }, canHover: false },
    ];
}