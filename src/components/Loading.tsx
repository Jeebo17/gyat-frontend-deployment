import ShinyText from './ShinyText';

function Loading() {
    return (
        <div className="">
            <ShinyText 
                text="Loading..." 
                disabled={false} 
                speed={2}
                className='custom-class text-4xl font-light select-none' 
            />
        </div>
    );
}

export default Loading;