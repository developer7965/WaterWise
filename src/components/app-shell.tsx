"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ FIXED: Missing import
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Lightbulb,
  Trophy,
  TrendingUp,
  UserCircle,
  Info,
  Menu,
  LogIn,
  LogOut,
  Loader2,
  AlertTriangle,
  Sparkles,
  PanelLeft,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  isFirebaseProperlyConfigured,
  firebaseConfigValues,
} from "@/lib/firebase";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  authRequired?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, authRequired: true },
  { href: "/tips", label: "Tips", icon: Lightbulb, authRequired: true },
  { href: "/challenges", label: "Challenges", icon: Trophy, authRequired: true },
  { href: "/impact", label: "Impact", icon: TrendingUp, authRequired: true },
  { href: "/info", label: "Water Facts", icon: Info, authRequired: true },
  { href: "/profile", label: "Profile", icon: UserCircle, authRequired: true },
];

interface AppShellProps {
  children: ReactNode;
}

function GlobalLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}

function FirebaseConfigErrorDisplay() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-destructive text-destructive-foreground p-4 sm:p-8">
      <AlertTriangle className="mb-6 h-16 w-16 text-yellow-300" />
      <h1 className="mb-4 text-center text-2xl font-bold sm:text-3xl">
        Firebase Configuration Error
      </h1>
      <p className="mb-2 text-center text-base sm:text-lg">
        Critical Firebase configuration is missing or incomplete.
      </p>
      <p className="mb-6 text-center text-base sm:text-lg">
        The application cannot start correctly without valid Firebase
        credentials.
      </p>
      <div className="max-w-2xl w-full rounded-lg bg-background p-4 shadow-xl text-xs sm:text-sm">
        <p className="mb-3 text-md font-semibold sm:text-lg">Action Required:</p>
        <ol className="mb-4 list-decimal list-inside space-y-2">
          <li>
            Create a file named <code>.env.local</code> in the root directory of
            your project (next to <code>package.json</code>).
          </li>
          <li>Add your Firebase project's configuration to this file:</li>
        </ol>
        <pre className="mb-4 whitespace-pre-wrap break-all rounded-md bg-muted p-3 text-left">
{`NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyCJn4uOQZTvYuvgJY_LTLWJiEpPo97eqTI"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="test1-5263f.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="test1-5263f"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="test1-5263f.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="92468165076"
NEXT_PUBLIC_FIREBASE_APP_ID="1:92468165076:web:fbe0d7e6cd3897906abe41"`}
        </pre>
        <p className="mb-4">
          Replace <code>"YOUR_..."</code> with the actual values from your
          Firebase project settings (Project settings &gt; General &gt; Your apps
          &gt; Web app SDK configuration).
        </p>
        <p className="rounded-md bg-yellow-100 p-2 font-bold text-yellow-500 text-center">
          After creating or updating <code>.env.local</code>, you{" "}
          <strong>MUST RESTART</strong> your development server for changes to
          take effect.
        </p>
        <details className="mt-4 cursor-pointer">
          <summary className="font-semibold hover:text-foreground text-muted-foreground">
            Current values detected by the app (for debugging):
          </summary>
          <ul className="mt-1 list-disc list-inside rounded-md bg-muted/50 p-3 pl-4 text-muted-foreground">
            <li>
              <code>NEXT_PUBLIC_FIREBASE_API_KEY</code>:{" "}
              {firebaseConfigValues.apiKey || (
                <span className="font-bold text-red-400">MISSING</span>
              )}
            </li>
            <li>
              <code>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</code>:{" "}
              {firebaseConfigValues.authDomain || (
                <span className="font-bold text-red-400">MISSING</span>
              )}
            </li>
            <li>
              <code>NEXT_PUBLIC_FIREBASE_PROJECT_ID</code>:{" "}
              {firebaseConfigValues.projectId || (
                <span className="font-bold text-red-400">MISSING</span>
              )}
            </li>
            <li>
              <code>NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET</code>:{" "}
              {firebaseConfigValues.storageBucket || (
                <span className="text-yellow-400">May be needed</span>
              )}
            </li>
            <li>
              <code>NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID</code>:{" "}
              {firebaseConfigValues.messagingSenderId || (
                <span className="text-yellow-400">May be needed</span>
              )}
            </li>
            <li>
              <code>NEXT_PUBLIC_FIREBASE_APP_ID</code>:{" "}
              {firebaseConfigValues.appId || (
                <span className="text-yellow-400">May be needed</span>
              )}
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
}

export function AppShell({ children }: AppShellProps): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const { open, toggleSidebar, isMobile, setOpenMobile } = useSidebar();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    const isAuthPage = pathname === "/auth";

    if (!user && !isAuthPage) {
      router.push("/auth");
    } else if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, loading, pathname, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth");
  };

  const SidebarNavigation = () => (
    <SidebarMenu>
      {navItems
        .filter((item) => !item.authRequired || user)
        .map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{
                children: item.label,
                className: "bg-primary text-primary-foreground",
              }}
              onClick={() => isMobile && setOpenMobile(false)}
              className="font-headline"
            >
              <Link href={item.href}>
                <item.icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      {!user && (
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname === "/auth"}
            tooltip={{
              children: "Login",
              className: "bg-primary text-primary-foreground",
            }}
            onClick={() => isMobile && setOpenMobile(false)}
            className="font-headline"
          >
            <Link href="/auth">
              <LogIn className="h-5 w-5" />
              <span className="truncate">Login</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );

  if (!isFirebaseProperlyConfigured) return <FirebaseConfigErrorDisplay />;
  if (loading || (!user && pathname !== "/auth") || (user && pathname === "/auth"))
    return <GlobalLoader />;
  if (!user && pathname === "/auth") return <>{children}</>;

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
        <SidebarHeader className="flex items-center justify-between p-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="HydroTrack Logo"
              width={28}
              height={28}
              unoptimized // ✅ Optional: Needed if external image isn't optimised
            />
            <h1 className="font-headline text-xl font-bold text-primary-foreground group-data-[collapsible=icon]:hidden">
              HydroTrack
            </h1>
          </Link>
          <SidebarTrigger className="hidden md:flex" aria-label="Toggle Sidebar">
            <PanelLeft className="h-5 w-5" />
          </SidebarTrigger>
        </SidebarHeader>

        <SidebarContent className="flex-grow p-2">
          <ScrollArea className="h-full">
            <SidebarNavigation />
          </ScrollArea>
        </SidebarContent>

        {user && (
          <div className="border-t border-sidebar-border p-2 group-data-[collapsible=icon]:p-0">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                tooltip={{
                  children: "Logout",
                  className: "bg-destructive text-destructive-foreground",
                }}
                className="w-full font-headline hover:bg-destructive/20 group-data-[collapsible=icon]:justify-center"
                variant="ghost"
              >
                <LogOut className="h-5 w-5 text-destructive" />
                <span className="truncate group-data-[collapsible=icon]:hidden text-destructive">
                  Logout
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        )}
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
          <div className="md:hidden">
            <Button aria-label="Toggle Menu" onClick={toggleSidebar} size="icon" variant="ghost">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            {user && (
              <Link href="/profile" aria-label="Profile">
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} />
                  <AvatarFallback className="bg-muted">
                    {user.displayName
                      ? user.displayName.charAt(0).toUpperCase()
                      : <UserCircle className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>

        {user && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/chatbot" aria-label="AquaChat AI">
                  <Button
                    className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-accent shadow-lg hover:bg-accent/90 text-accent-foreground rainbow-glow-fab"
                    aria-label="AquaChat AI"
                  >
                    <Sparkles className="h-7 w-7" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-primary text-primary-foreground">
                <p>AquaChat AI</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </SidebarInset>
    </div>
  );
}
