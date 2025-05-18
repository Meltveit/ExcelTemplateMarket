import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";

import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import TemplatesPage from "@/pages/TemplatesPage";
import TemplateDetailPage from "@/pages/TemplateDetailPage";
import CheckoutPage from "@/pages/CheckoutPage";
import DownloadPage from "@/pages/DownloadPage";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminTemplates from "@/pages/AdminTemplates";
import AdminSales from "@/pages/AdminSales";
import AdminLogin from "@/pages/AdminLogin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/templates/:id" component={TemplateDetailPage} />
      <Route path="/checkout/:id" component={CheckoutPage} />
      <Route path="/download/:paymentId" component={DownloadPage} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/templates" component={AdminTemplates} />
      <Route path="/admin/sales" component={AdminSales} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
