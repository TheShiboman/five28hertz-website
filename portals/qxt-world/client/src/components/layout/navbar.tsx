import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Monitor,
  ShoppingBag,
  LogOut,
  User,
  Home,
  Award,
  Users,
  GraduationCap,
  BarChart,
  Dumbbell
} from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b border-[#c4a45b] bg-[#062128] shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-24 items-center">
          {/* QXT World Round Logo */}
          <Link href="/">
            <img 
              src="/qxt-logo.png" 
              alt="QXT World Round Logo" 
              className="w-16 h-16 cursor-pointer hover:opacity-90 transition-opacity rounded-full"
            />
          </Link>

          <NavigationMenu>
            <NavigationMenuList className="flex gap-4">
              <NavigationMenuItem>
                <Link href="/dashboard">
                  <NavigationMenuLink className="flex items-center gap-2 text-white hover:text-[#e6c680] transition-colors">
                    <Home className="h-4 w-4 text-[#c4a45b]" />
                    Dashboard
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/tournaments">
                  <NavigationMenuLink className="flex items-center gap-2 text-white hover:text-[#e6c680] transition-colors">
                    <Trophy className="h-4 w-4 text-[#c4a45b]" />
                    Tournaments
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/training">
                  <NavigationMenuLink className="flex items-center gap-2 text-white hover:text-[#e6c680] transition-colors">
                    <Dumbbell className="h-4 w-4 text-[#c4a45b]" />
                    Training
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/leaderboards">
                  <NavigationMenuLink className="flex items-center gap-2 text-white hover:text-[#e6c680] transition-colors">
                    <BarChart className="h-4 w-4 text-[#c4a45b]" />
                    Leaderboards
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/community">
                  <NavigationMenuLink className="flex items-center gap-2 text-white hover:text-[#e6c680] transition-colors">
                    <Users className="h-4 w-4 text-[#c4a45b]" />
                    Community
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/academy">
                  <NavigationMenuLink className="flex items-center gap-2 text-white hover:text-[#e6c680] transition-colors">
                    <GraduationCap className="h-4 w-4 text-[#c4a45b]" />
                    Academy
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/store">
                  <NavigationMenuLink className="flex items-center gap-2 text-white hover:text-[#e6c680] transition-colors">
                    <ShoppingBag className="h-4 w-4 text-[#c4a45b]" />
                    Store
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/live-streaming">
                  <NavigationMenuLink className="flex items-center gap-2 text-white hover:text-[#e6c680] transition-colors">
                    <Monitor className="h-4 w-4 text-[#c4a45b]" />
                    Live
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-white hover:text-[#e6c680] hover:bg-[#041c20] transition-colors"
              >
                <User className="h-4 w-4 text-[#c4a45b]" />
                {user.fullName}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              className="flex items-center gap-2 border-[#c4a45b] text-white hover:border-[#e6c680] hover:text-[#e6c680] hover:bg-[#041c20] transition-colors"
            >
              <LogOut className="h-4 w-4 text-[#c4a45b]" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}