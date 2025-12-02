import FuzzyText from '../components/FuzzyText';

function NotFoundPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-primary text-text-primary transition-colors duration-300 select-none">
            <FuzzyText 
                baseIntensity={0.2} 
                hoverIntensity={0.5} 
                enableHover={true}
            >
                404
            </FuzzyText>
            <p className="text-2xl m-8 select-none font-light">oops page not found</p>
            <a href="/" className="px-4 py-2 bg-bg-secondary text-text-primary rounded hover:bg-bg-tertiary transition-colors duration-300">
                Go to Home
            </a>
        </div>
    );
}

export default NotFoundPage;