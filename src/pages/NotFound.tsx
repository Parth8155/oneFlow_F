import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-accent/10 rounded-full flex items-center justify-center">
            <Search className="h-12 w-12 text-accent" />
          </div>
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/dashboard">
            <Button className="w-full bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl transition-all">
              <Home className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex justify-center gap-2 mt-6">
            <div className="w-2 h-2 bg-accent/30 rounded-full" />
            <div className="w-2 h-2 bg-accent/60 rounded-full" />
            <div className="w-2 h-2 bg-accent rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
