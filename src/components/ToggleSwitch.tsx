interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    highlight?: boolean;
}

const ToggleSwitch = ({ checked, onChange, highlight = true }: ToggleSwitchProps) => {
    return (
        <label className='flex cursor-pointer select-none items-center'>
            <div className='relative'>
                <input
                    type='checkbox'
                    checked={checked}
                    onChange={() => onChange(!checked)}
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
                    className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-text-primary transition ${
                        checked ? 'translate-x-full' : ''
                    }`}
                ></div>
            </div>
        </label>
    )
}

export default ToggleSwitch
