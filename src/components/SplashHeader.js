import compassLogo from '../assets/compass_logo.png';

export default function SplashHeader() {
    return (
        <header className="flex items-center justify-center mb-6">
            <img src={compassLogo} alt="Compass App Logo " className="h-20 w-auto" />
        </header>
    )
}