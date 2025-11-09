import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
            <p className="text-muted-foreground">
              Simplify your workflow and boost your productivity
            </p>
          </div>
          
          <LoginForm />
          
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors">
                <span className="text-sm font-bold">G</span>
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors">
                <span className="text-sm font-bold">A</span>
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors">
                <span className="text-sm font-bold">F</span>
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Need help accessing your account? Contact your administrator.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-accent/10 via-accent/5 to-background p-12">
        <div className="relative max-w-lg text-center">
          {/* Decorative circles */}
          <div className="absolute -top-8 -left-8 w-16 h-16 bg-accent/20 rounded-full"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-accent/30 rounded-full"></div>
          <div className="absolute top-1/3 -right-12 w-8 h-8 bg-accent/25 rounded-full"></div>
          
          {/* Main illustration area */}
          <div className="relative bg-white rounded-2xl p-8 shadow-lg text-center">
            <h3 className="text-xl font-semibold text-foreground">OneFlow App</h3>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <span className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full">Design</span>
              <span className="text-accent">+1k</span>
            </div>
          </div>
          
          <div className="mt-8 space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Make your work easier and organized
            </h2>
            <h3 className="text-lg font-medium text-accent">
              with OneFlow App
            </h3>
          </div>
          
          {/* Small profile circles */}
          <div className="absolute -top-4 left-1/4 w-8 h-8 bg-gray-200 rounded-full border-2 border-white shadow-md"></div>
          <div className="absolute top-8 right-1/4 w-10 h-10 bg-gray-300 rounded-full border-2 border-white shadow-md"></div>
          <div className="absolute bottom-8 left-1/3 w-6 h-6 bg-gray-400 rounded-full border-2 border-white shadow-md"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
