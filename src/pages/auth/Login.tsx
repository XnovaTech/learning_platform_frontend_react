import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import welcome from '../../../public/lottie/Welcome.json';
import Lottie from 'lottie-react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login(email, password);
      toast.success('Logged in successfully');
      if ((res as any)?.roles?.[0] === 'teacher') {
        navigate('/teacher/dashboard');
        return;
      }

      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen   flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl">
        <div className="md:w-1/2 bg-primary/60 p-8 flex flex-col justify-center items-center text-white space-y-4">
          <div className="relative z-10 text-center space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wide drop-shadow-2xl">
              THE CRYSTAL <br /> LEARNING HUB
            </h1>
            <Lottie animationData={welcome} loop={true} className=" w-8/12 mx-auto" />
            <p className="text-lg font-light ">Sign in to continue your learning journey.</p>
          </div>
        </div>

        {/*  Login Form  */}
        <div className=" md:w-1/2 bg-white p-10 items-center justify-center flex">
          <form onSubmit={handleSubmit} className="space-y-6 w-full ">
            <h2 className="text-3xl font-bold text-center text-primary">Sign In</h2>

            {/* Error Message */}
            {/* {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm text-center">{error}</p>} */}

            {/* Input Fields */}
            <Input placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required type="email" />

            <div className="relative w-full">
              <Input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pr-12" />

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

            {/* Submit Button */}
            <Button className="w-full h-10 text-lg " type="submit" disabled={isLoading}>
              {isLoading ? <Spinner /> : 'Login'}
            </Button>

            <p className="text-center text-sm text-gray-500 border-t">
              Don&apos;t have an account?
              <Button type="button" variant="link" size="sm" className="ml-1 p-0" onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
