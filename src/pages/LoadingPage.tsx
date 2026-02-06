import ShinyText from '../components/effects/ShinyText';

function LoadingPage() {
    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
            <ShinyText 
                text="Loading..." 
                disabled={false} 
                speed={2}
                className='custom-class text-4xl font-light select-none' 
            />
        </div>
    );
}

export default LoadingPage;