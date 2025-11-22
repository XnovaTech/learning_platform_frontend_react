import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import welcome from '../../../public/lottie/Welcome.json';
import Lottie from 'lottie-react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', password: '', confirm_password: '', address: '', role: 'student' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');


    const passwordsMatch = form.password === form.confirm_password;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!passwordsMatch) {
            toast.error('Passwords do not match!');
            return;
        }

        setIsLoading(true);
        try {
            await register(form);
            toast.success('Registration successful');
            navigate('/enroll');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Registeration failed, Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="flex flex-col md:flex-row max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl">
                <div className="md:w-1/2 bg-ocean/60 p-8 flex flex-col justify-center items-center text-white space-y-4">
                    <div className=" relative z-10 text-center space-y-4 md:space-y-6">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-wide drop-shadow-2xl">
                            THE CRYSTAL <br /> LEARNING HUB
                        </h1>
                        <Lottie animationData={welcome} loop={true} className="w-9/12 mx-auto" />
                        <p className="text-lg font-light ">Let start your learning journey.</p>
                    </div>
                </div>
                <div className="md:w-1/2 bg-white p-10 items-center justify-center flex">
                    <form onSubmit={handleSubmit} className=" space-y-4">
                        <h2 className="text-2xl font-semibold text-primary text-center mb-4">Sign Up</h2>
                        {error && <p className="text-red-500 font-semibold text-center mb-4">{error}</p>}
                        <div className="flex justify-between gap-2">
                            <Input placeholder="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
                            <Input placeholder="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
                        </div>

                        <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                        <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                        <div className="relative w-full">
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                className="w-full pr-12"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute hover:bg-transparent right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>

                        <div className="relative w-full">
                            <Input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                value={form.confirm_password}
                                onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                                required
                                className="w-full pr-12"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="absolute hover:bg-transparent right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>

                        <Button className="w-full" type="submit" disabled={!passwordsMatch || isLoading}>
                            {isLoading ? <Spinner /> : 'Register'}
                        </Button>

                        <p className="text-center text-sm text-gray-500 border-t">
                            Already have an account?
                            <Button type="button" variant="link" size="sm" className="ml-1 p-0" onClick={() => navigate('/login')}>
                                Sign In
                            </Button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
