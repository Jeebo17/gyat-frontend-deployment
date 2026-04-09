import { FC, useRef, useCallback, useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import InteractiveMap from './InteractiveMap';
import type { TileData } from '../types/tile';
import { FaPlus, FaMinus, FaArrowRotateLeft } from 'react-icons/fa6';
import { useTheme } from '../context/ThemeContext';

interface EnhancedInteractiveMapProps {
    editMode?: boolean;
    snapToGrid?: boolean;
    floorId?: number;
    floorTiles?: TileData[];
    floorLoading?: boolean;
    floorLoadError?: string | null;
    onTilesChange?: (tiles: TileData[]) => void;
    highlightedTileId?: number | null;
    previewMode?: boolean;
    layoutId?: number;
    desktopMinWidth?: number;
    enableZoom?: boolean;
    initialScale?: number;
    minScale?: number;
    maxScale?: number;
    wheelStep?: number;
    pinchStep?: number;
}

const EnhancedInteractiveMap: FC<EnhancedInteractiveMapProps> = ({
    editMode = false,
    snapToGrid = true,
    floorId,
    floorTiles = [],
    floorLoading = false,
    floorLoadError = null,
    onTilesChange,
    highlightedTileId = null,
    previewMode = false,
    layoutId = undefined,
    desktopMinWidth = 640,
    enableZoom = true,
    initialScale = 1,
    minScale = 0.6,
    maxScale = 2.2,
    wheelStep = 0.04,
    pinchStep = 4,
}) => {
    const { theme } = useTheme();
    const transformRef = useRef<any>(null);
    const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
        typeof window === 'undefined' ? true : window.innerWidth >= desktopMinWidth
    );

    useEffect(() => {
        const handleViewportChange = () => {
            setIsDesktopViewport(window.innerWidth >= desktopMinWidth);
        };

        handleViewportChange();
        window.addEventListener('resize', handleViewportChange);
        return () => window.removeEventListener('resize', handleViewportChange);
    }, [desktopMinWidth]);

    const handleZoomIn = useCallback(() => {
        if (transformRef.current) {
            transformRef.current.zoomIn();
        }
    }, []);

    const handleZoomOut = useCallback(() => {
        if (transformRef.current) {
            transformRef.current.zoomOut();
        }
    }, []);

    const handleResetZoom = useCallback(() => {
        if (transformRef.current) {
            transformRef.current.resetTransform();
        }
    }, []);

    const buttonClasses = `p-2 rounded-lg shadow hover:bg-text-secondary transition duration-500 bg-text-primary ${
        theme === 'dark' ? 'text-black' : 'text-white'
    }`;

    return (
        <div className="relative overflow-visible w-full h-full justify-center items-center flex pt-1 sm:pt-2">
            <TransformWrapper
                ref={transformRef}
                initialScale={initialScale}
                initialPositionX={0}
                initialPositionY={0}
                minScale={minScale}
                maxScale={maxScale}
                disabled={!enableZoom}
                smooth={true}
                wheel={{
                    step: wheelStep,
                    disabled: !enableZoom,
                }}
                pinch={{
                    step: pinchStep,
                    disabled: !enableZoom,
                }}
                panning={{
                    disabled: !enableZoom,
                }}
                velocityAnimation={{
                    disabled: !enableZoom,
                    animationTime: 400,
                    animationType: 'easeOut',
                }}
                doubleClick={{
                    step: 1,
                    animationTime: 200,
                    animationType: 'easeOut',
                    disabled: !enableZoom,
                }}
            >
                <TransformComponent
                    wrapperClass="w-full h-full"
                    contentClass="w-full h-full flex justify-center items-center"
                >
                    <div className="relative w-full h-full">
                        <InteractiveMap
                            editMode={editMode}
                            snapToGrid={snapToGrid}
                            floorId={floorId}
                            floorTiles={floorTiles}
                            floorLoading={floorLoading}
                            floorLoadError={floorLoadError}
                            onTilesChange={onTilesChange}
                            highlightedTileId={highlightedTileId}
                            previewMode={previewMode}
                            layoutId={layoutId}
                            desktopMinWidth={desktopMinWidth}
                        />
                    </div>
                </TransformComponent>
            </TransformWrapper>

            {/* Zoom Controls - Only show on desktop or non-preview mode */}
            {!previewMode && isDesktopViewport && enableZoom && (
                <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5 sm:gap-2 pointer-events-auto">
                    <button
                        onClick={handleZoomIn}
                        className={buttonClasses}
                        aria-label="Zoom in"
                        type="button"
                    >
                        <FaPlus size={25} />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className={buttonClasses}
                        aria-label="Zoom out"
                        type="button"
                    >
                        <FaMinus size={25} />
                    </button>
                    <button
                        onClick={handleResetZoom}
                        className={buttonClasses}
                        aria-label="Reset zoom"
                        type="button"
                    >
                        <FaArrowRotateLeft size={25} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default EnhancedInteractiveMap;
