import { RxCross2 } from "react-icons/rx";
import { TileProps } from "../types/tile";

function MachineModal({ tile, onClose }: { tile: TileProps, onClose: () => void }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-40 cursor-pointer" onClick={onClose}>
            <div className="bg-bg-secondary p-6 rounded-lg shadow-lg w-4/5 h-4/5 relative cursor-auto" onClick={e => e.stopPropagation()}>
                <button className="absolute top-4 right-4 text-text-primary hover:text-red-500 transition-all duration-200" onClick={onClose}>
                    <RxCross2 className="w-12 h-12"/>
                </button>

                <h1 className="text-3xl select-none">{tile.equipment.title}</h1>

                {/* grid */}

                <div className="grid grid-cols-3 grid-rows-2 gap-6 mt-6">
                    <div className="flex flex-col row-span-2 items-center justify-center bg-bg-tertiary rounded-lg p-4">

                        <div className="bg-bg-secondary rounded-md flex flex-col items-center justify-center w-full aspect-square">
                            {tile.equipment.icon && <tile.equipment.icon className="w-20 h-20 mb-4 text-text-primary" />}                            
                        </div>

                        <div className="bg-bg-secondary rounded-md w-full mt-4 p-2">
                            <h3 className="text-xl mb-2 select-none font-semibold">Why to use it?</h3>
                            <p className="text-text-primary select-none">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum vulputate turpis, at lacinia ipsum pulvinar at. Sed ultricies bibendum vulputate. Ut vel dapibus orci. Nam non elementum leo.</p>   
                        </div>
                    </div>
                    <div className="bg-bg-tertiary rounded-lg p-4 overflow-y-auto row-span-2">
                        <h3 className="text-xl mb-2 select-none font-semibold">Description</h3>
                        <p className="text-text-primary select-none">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum vulputate turpis, at lacinia ipsum pulvinar at. Sed ultricies bibendum vulputate. Ut vel dapibus orci. Nam non elementum leo. Vestibulum bibendum magna at tellus tristique, eget congue tellus varius. Morbi finibus, quam at posuere ultricies, magna ipsum cursus massa, sed porta dui tortor sit amet tortor. Vestibulum diam nisi, efficitur aliquam est nec, condimentum sollicitudin dui.</p>
                    </div>
                    <div className="bg-bg-tertiary rounded-lg p-4 overflow-y-auto">
                        <h3 className="text-xl mb-2 select-none font-semibold">Muscles trained</h3>
                        <ul className="list-disc list-inside text-text-primary select-none">
                            <li>Bum</li>
                            <li>Toes</li>
                            <li>Forehead</li>
                        </ul>
                    </div>
                    
                    <div className="bg-bg-tertiary rounded-lg p-4 overflow-y-auto">
                        <h3 className="text-xl mb-2 select-none font-semibold">Video</h3>
                        <div className="w-full bg-gray-100 rounded-sm text-black aspect-video text-center justify-center flex items-center">Video</div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default MachineModal;