import { Navigate, Route, Routes } from "react-router-dom";
import Shell from "../ui/Shell";
import PortalDashboard from "../pages/portal/PortalDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import Placeholder from "../pages/portal/Placeholder";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/portal/dashboard" replace />} />

      <Route path="/portal" element={<Shell mode="portal" />}>
        <Route path="dashboard" element={<PortalDashboard />} />
        <Route path="apikeys" element={<Placeholder title="API Keys (Portal)" />} />
        <Route path="billing" element={<Placeholder title="Billing (Portal)" />} />
        <Route path="audit-logs" element={<Placeholder title="Audit Logs (Portal)" />} />
        <Route path="webhooks" element={<Placeholder title="Webhooks (Portal)" />} />
      </Route>

      <Route path="/admin" element={<Shell mode="admin" />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="tenants" element={<Placeholder title="Tenants (Admin)" />} />
        <Route path="kyb" element={<Placeholder title="KYB Review (Admin)" />} />
        <Route path="risk" element={<Placeholder title="Risk (Admin)" />} />
        <Route path="compliance-holds" element={<Placeholder title="Compliance Holds (Admin)" />} />
        <Route path="control-plane-events" element={<Placeholder title="Control Plane Events (Admin)" />} />
        <Route path="apikeys" element={<Placeholder title="API Keys (Admin)" />} />
        <Route path="billing" element={<Placeholder title="Billing (Admin)" />} />
        <Route path="plans" element={<Placeholder title="Plans (Admin)" />} />
      </Route>

      <Route path="*" element={<Navigate to="/portal/dashboard" replace />} />
    </Routes>
  );
}
