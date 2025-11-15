import { useState } from 'react';

const Carousel = ({images}: {images: string[]}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) return null;

    const goToPrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const goToNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full bg-neutral rounded-box p-4">
            <div className="relative overflow-hidden rounded-lg">
                <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                    {images.map((image, index) => (
                        <div key={index} className="min-w-full flex-shrink-0 flex items-center justify-center bg-gray-100">
                            <img 
                                src={image} 
                                alt={`Slide ${index + 1}`} 
                                className="max-w-full max-h-[500px] w-auto h-auto object-contain rounded-box" 
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={goToPrevious}
                    className="absolute left-5 top-1/2 -translate-y-1/2 btn btn-circle pointer-events-auto z-10 cursor-pointer"
                    aria-label="Previous slide"
                >
                    ❮
                </button>

                <button
                    onClick={goToNext}
                    className="absolute right-5 top-1/2 -translate-y-1/2 btn btn-circle pointer-events-auto z-10 cursor-pointer"
                    aria-label="Next slide"
                >
                    ❯
                </button>
                
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${
                                    index === currentIndex 
                                        ? 'bg-white' 
                                        : 'bg-white/50 hover:bg-white/75'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Carousel;