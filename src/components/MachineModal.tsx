import { RxCross2 } from "react-icons/rx";
import { TileProps } from "../types/tile";

function MachineModal({ tile, onClose }: { tile: TileProps, onClose: () => void }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-40 cursor-pointer select-none" onClick={onClose}>
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm select-none"></div>

            <div
                className="relative z-50 backdrop-blur-2xl border-2 border-white/30 p-4 md:p-6 rounded-2xl shadow-lg w-11/12 sm:w-4/5 h-4/5 cursor-auto overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <button className="absolute top-4 right-4 text-white hover:text-red-500 transition-all duration-200 z-10" onClick={onClose}>
                    <RxCross2 className="w-12 h-12"/>
                </button>

                <h1 className="text-3xl select-none text-white flex-shrink-0">{tile.equipment.name}</h1>

                <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 xl:grid-cols-3 xl:grid-rows-2 flex-1 min-h-0">
                    <div className="flex flex-col row-span-2 items-center justify-center bg-black/20 rounded-lg p-4 min-h-0">
                        {/* Equipment image */}
                        <div className="bg-black/20 rounded-lg flex flex-col items-center justify-center w-full aspect-square flex-shrink-0">
                            {tile.equipment.icon && <tile.equipment.icon className="w-20 h-20 mb-4 text-white" />}                            
                        </div>
                        {/* Equipment description */}
                        <div className="w-full mt-4 p-2 text-white overflow-y-auto flex-1 min-h-0">
                            <h3 className="text-xl mb-2 select-none font-semibold">Description</h3>
                            <p className="select-none">{tile.equipment.description}</p>   
                        </div>
                    </div>

                    <div className="rounded-lg p-4 row-span-2 text-white bg-black/20 flex flex-col min-h-0">
                        {/* Benefits */}
                        <h3 className="text-xl mb-2 select-none font-semibold flex-shrink-0">List of exercises:</h3>
                        <div className="overflow-y-auto flex-1 min-h-0 scrollbar-thumb-only">
                            <ul className="list-disc list-outside pl-5 space-y-2">
                                {tile.equipment.benefits?.map((benefit: string, idx: number) => (
                                    <li key={idx}>{benefit}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="rounded-lg p-4 overflow-y-auto text-white bg-black/20 min-h-0">
                        {/* Muscles trained */}
                        <h3 className="text-xl mb-2 select-none font-semibold">Muscles trained</h3>
                        <ul className="list-disc list-outside pl-5 space-y-2">
                            {tile.equipment.musclesTargeted?.map((muscle: string, idx: number) => (
                                <li key={idx}>{muscle}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <div className="rounded-lg p-4 overflow-y-auto text-white bg-black/20 min-h-0">
                        <h3 className="text-xl mb-2 select-none font-semibold">Video</h3>
                        <div className="w-full bg-gray-100 rounded-sm text-black aspect-video text-center justify-center flex items-center">
                            <iframe
                                width="100%"
                                height="100%"
                                src={tile.equipment.videoUrl}
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