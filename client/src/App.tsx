import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
// Route-level chunks keep the initial shell small and make each page load only
// the code it needs. The home page is still the first requested route chunk.
const Home = lazy(() => import("./pages/Home"));
const Activities = lazy(() => import("./pages/Activities"));
const Showcase = lazy(() => import("./pages/Showcase"));
const ShowcaseDetail = lazy(() => import("./pages/ShowcaseDetail"));
const YuanjiRestaurant = lazy(() => import("./pages/YuanjiRestaurant"));
const Teachers = lazy(() => import("./pages/Teachers"));
const Partner = lazy(() => import("./pages/Partner"));
const Certificate = lazy(() => import("./pages/Certificate"));

function AppRoutes() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-500"
          role="status"
          aria-live="polite"
        >
          页面加载中…
        </div>
      }
    >
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/showcase/:slug"} component={ShowcaseDetail} />
        <Route path={"/showcase"} component={Showcase} />
        <Route path={"/activities"} component={Activities} />
        <Route path={"/yuanji"} component={YuanjiRestaurant} />
        <Route path={"/teachers"} component={Teachers} />
        <Route path={"/partner"} component={Partner} />
        <Route path={"/certificate"} component={Certificate} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <WouterRouter
            base={
              import.meta.env.BASE_URL === "/"
                ? ""
                : import.meta.env.BASE_URL.replace(/\/$/, "")
            }
          >
            <AppRoutes />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
