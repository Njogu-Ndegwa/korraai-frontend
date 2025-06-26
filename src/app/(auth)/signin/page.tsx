'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Add custom animations
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (!document.querySelector('#login-animations')) {
        const style = document.createElement('style');
        style.id = 'login-animations';
        style.textContent = `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          
          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out;
          }
          
          .animate-slideInRight {
            animation: slideInRight 0.6s ease-out;
          }
          
          .animate-pulse-gentle {
            animation: pulse 2s infinite;
          }
          
          .shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('https://korraai.bitwavetechnologies.com/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token in localStorage
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          
          // Also store refresh token if provided
          if (data.refresh_token) {
            localStorage.setItem('refresh_token', data.refresh_token);
          }
          
          setSuccess('Login successful! Redirecting...');
          
          // Redirect after a short delay to show success message
          setTimeout(() => {
            router.push('/conversations'); // or wherever you want to redirect
          }, 1500);
        } else {
          setError('Invalid response from server');
        }
      } else {
        // Handle specific error messages
        if (data.detail) {
          setError(data.detail);
        } else if (data.email) {
          setError('Please enter a valid email address');
        } else if (data.password) {
          setError('Please check your password');
        } else {
          setError('Invalid email or password');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e:any) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const isFormValid = formData.email && formData.password && !loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fadeInUp">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/25 animate-pulse-gentle">
              <Sparkles className="text-white" size={28} />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome to 
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Korra AI</span>
            </h1>
            
            <p className="text-slate-600">
              Sign in to your Smart CRM account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 animate-slideInRight">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-700 animate-slideInRight">
              <CheckCircle size={20} className="flex-shrink-0" />
              <span className="text-sm font-medium">{success}</span>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="admin@sitc.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`
                w-full py-4 rounded-xl font-semibold text-white transition-all duration-200
                ${isFormValid
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5'
                  : 'bg-slate-300 cursor-not-allowed'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <button className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                Contact your administrator
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Powered by Korra AI Smart CRM Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;