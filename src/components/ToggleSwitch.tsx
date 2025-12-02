import { useState } from 'react'

interface ToggleSwitchProps {
    onClick?: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ onClick = () => {} }) => {
    const [isChecked, setIsChecked] = useState(false)

    const handleCheckboxChange = () => {
        const newChecked = !isChecked;
        setIsChecked(newChecked);
        onClick(newChecked);
    }

    return (
        <>
        <label className='flex cursor-pointer select-none items-center'>
            <div className='relative'>
            <input
                type='checkbox'
                checked={isChecked}
                onChange={handleCheckboxChange}
                className='sr-only'
            />
            <div
                className={`box block h-8 w-14 rounded-full ${
                isChecked ? 'bg-accent-primary' : 'bg-bg-tertiary'
                }`}
            ></div>
            <div
                className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-text-primary transition ${
                isChecked ? 'translate-x-full' : ''
                }`}
            ></div>
            </div>
        </label>
        </>
    )
}

export default ToggleSwitch
