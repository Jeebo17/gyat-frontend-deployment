import useSound from 'use-sound';
import popSound from '../assets/sounds/pop.mp3';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    highlight?: boolean;
}

const ToggleSwitch = ({ checked, onChange, highlight = true }: ToggleSwitchProps) => {
    const [play] = useSound(popSound, { volume: 0.2 });

    return (
        <label className='flex cursor-pointer select-none items-center'>
            <div className='relative'>
                <input
                    type='checkbox'
                    checked={checked}
                    onChange={() => {
                        play();
                        onChange(!checked);
                    }}
                    className='sr-only'
                    aria-label="Toggle switch"
                />
                <div
                    className={`box block h-8 w-14 rounded-full ${
                        highlight && checked
                            ? 'bg-accent-primary'
                            : 'bg-bg-tertiary'
                    }`}
                ></div>
                <div
                    className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-text-primary transition duration-500 ${
                        checked ? 'translate-x-full' : ''
                    }`}
                ></div>
            </div>
        </label>
    )
}

export default ToggleSwitch
