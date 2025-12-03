import { TileProps } from "../types/tile";
import { TbTreadmill } from "react-icons/tb";
import { MdElectricBolt, MdRowing } from "react-icons/md";
import { GiWeightLiftingUp  } from "react-icons/gi";
import { IoBarbell  } from "react-icons/io5";
import { GrYoga } from "react-icons/gr";

export function getInitialTiles(): TileProps[] {
    return [
        { id: 1, x: 20, y: 160, width: 240, height: 100, rotation: 0, colour: "red", equipment: { title: "Treadmill", icon: TbTreadmill } },
        { id: 2, x: 20, y: 280, width: 240, height: 100, rotation: 0, colour: "red", equipment: { title: "Treadmill", icon: TbTreadmill } },
        { id: 3, x: 20, y: 400, width: 240, height: 100, rotation: 0, colour: "red", equipment: { title: "Treadmill", icon: TbTreadmill } },
        { id: 4, x: 20, y: 540, width: 240, height: 100, rotation: 0, colour: "blue", equipment: { title: "Rowing Machine", icon: MdRowing } },
        { id: 5, x: 20, y: 660, width: 240, height: 100, rotation: 0, colour: "blue", equipment: { title: "Rowing Machine", icon: MdRowing } },
        { id: 6, x: 400, y: 20, width: 240, height: 160, rotation: 0, colour: "green", equipment: { title: "Racks", icon: GiWeightLiftingUp  } },
        { id: 7, x: 700, y: 20, width: 240, height: 160, rotation: 0, colour: "green", equipment: { title: "Racks", icon: GiWeightLiftingUp  } },
        { id: 8, x: 1000, y: 20, width: 240, height: 160, rotation: 0, colour: "green", equipment: { title: "Racks", icon: GiWeightLiftingUp  } },
        { id: 9, x: 1140, y: 340, width: 550, height: 300, rotation: 90, colour: "purple", equipment: { title: "Free Weights", icon: IoBarbell } },
        { id: 10, x: 400, y: 500, width: 500, height: 280, rotation: 0, colour: "orange", equipment: { title: "Open Space", icon: GrYoga } },
        { id: 11, x: 600, y: 300, width: 200, height: 100, rotation: 0, colour: "yellow", equipment: { title: "Resistance Machine", icon: MdElectricBolt } },
        { id: 12, x: 800, y: 300, width: 200, height: 100, rotation: 90, colour: "yellow", equipment: { title: "Resistance Machine", icon: MdElectricBolt } },
        { id: 13, x: 950, y: 300, width: 200, height: 100, rotation: 90, colour: "yellow", equipment: { title: "Resistance Machine", icon: MdElectricBolt } },
        { id: 14, x: 1000, y: 760, width: 160, height: 40, rotation: 0, colour: "gray", equipment: { title: "Entrance", icon: undefined }, canHover: false },
    ];
}