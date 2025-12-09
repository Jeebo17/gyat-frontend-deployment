import { RxCross2 } from "react-icons/rx";
import { TileProps } from "../types/tile";

function MachineModal({ tile, onClose }: { tile: TileProps, onClose: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-40 cursor-pointer" onClick={onClose}>
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm select-none"></div>

            <div
                className="relative z-50 backdrop-blur-2xl border-2 border-white/30 p-4 md:p-6 rounded-2xl shadow-lg w-11/12 sm:w-4/5 h-4/5 cursor-auto overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <button className="absolute top-4 right-4 text-white hover:text-red-500 transition-all duration-200" onClick={onClose}>
                    <RxCross2 className="w-12 h-12"/>
                </button>

                <h1 className="text-3xl select-none text-white">{tile.equipment.title}</h1>

                {/* grid */}

                <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2">
                    <div className="flex flex-col row-span-2 items-center justify-center bg-black/20 rounded-lg p-4">

                        <div className="bg-black/20 rounded-lg flex flex-col items-center justify-center w-full aspect-square">
                            {tile.equipment.icon && <tile.equipment.icon className="w-20 h-20 mb-4 text-white" />}                            
                        </div>

                        <div className="w-full mt-4 p-2 text-white">
                            <h3 className="text-xl mb-2 select-none font-semibold">Why to use it?</h3>
                            <p className="select-none">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum vulputate turpis, at lacinia ipsum pulvinar at. Sed ultricies bibendum vulputate. Ut vel dapibus orci. Nam non elementum leo.</p>   
                        </div>
                    </div>
                    <div className="rounded-lg p-4 overflow-y-auto row-span-2 text-white bg-black/20">
                        <h3 className="text-xl mb-2 select-none font-semibold">Description</h3>
                        <p className="select-none">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam elementum vulputate turpis, at lacinia ipsum pulvinar at. Sed ultricies bibendum vulputate. Ut vel dapibus orci. Nam non elementum leo. Vestibulum bibendum magna at tellus tristique, eget congue tellus varius. Morbi finibus, quam at posuere ultricies, magna ipsum cursus massa, sed porta dui tortor sit amet tortor. Vestibulum diam nisi, efficitur aliquam est nec, condimentum sollicitudin dui.</p>
                    </div>
                    <div className="rounded-lg p-4 overflow-y-auto text-white bg-black/20">
                        <h3 className="text-xl mb-2 select-none font-semibold">Muscles trained</h3>
                        <ul className="list-disc list-inside select-none">
                            <li>Bum</li>
                            <li>Toes</li>
                            <li>Forehead</li>
                        </ul>
                    </div>
                    
                    <div className="rounded-lg p-4 overflow-y-auto text-white bg-black/20">
                        <h3 className="text-xl mb-2 select-none font-semibold">Video</h3>
                        <div className="w-full bg-gray-100 rounded-sm text-black aspect-video text-center justify-center flex items-center">
                            <iframe
                                width="100%"
                                height="100%"
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?list=RDdQw4w9WgXcQ&start_radio=1&autoplay=1"
                                title=""
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="rounded-sm"
                            ></iframe>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default MachineModal;