import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminPlaceholder from "../pages/admin/AdminPlaceholder";
import Login from "../pages/Login";
import LoginCallback from "../pages/LoginCallback";
import PortalAuditLogs from "../pages/portal/PortalAuditLogs";
import PortalApiKeys from "../pages/portal/PortalApiKeys";
import PortalBillingBalance from "../pages/portal/PortalBillingBalance";
import PortalBillingLedger from "../pages/portal/PortalBillingLedger";
import PortalHome from "../pages/portal/PortalHome";
import PortalKybUpload from "../pages/portal/PortalKybUpload";
import PortalOnboarding from "../pages/portal/PortalOnboarding";
import PortalStats from "../pages/portal/PortalStats";
import PortalWebhooksDeliveries from "../pages/portal/PortalWebhooksDeliveries";
import PortalWebhooksEndpoints from "../pages/portal/PortalWebhooksEndpoints";
import { usePortalAuth } from "../lib/portalAuth";
import { getPortalMe, type PortalMeResponse } from "../lib/portalApi";
import Shell from "../ui/Shell";

function PortalGate() {
  const { tokens, authDisabled } = usePortalAuth();
  const location = useLocation();
  const [me, setMe] = useState<PortalMeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authDisabled) return;
    if (!tokens.idToken) return;
    getPortalMe(tokens.idToken)
      .then(setMe)
      .catch((err) => setError(err.message));
  }, [authDisabled, tokens.idToken]);

  if (authDisabled) {
    return <Outlet />;
  }

  if (!tokens.idToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (error) {
    return (
      <div className="cw-page">
        <div className="cw-card">
          <h1 className="cw-title">Portal access error</h1>
          <p className="cw-muted">{error}</p>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <div className="cw-page">
        <div className="cw-card">
          <p className="cw-muted">Loading portal status…</p>
        </div>
      </div>
    );
  }

  const blocked = ["BLOCKED", "SUSPENDED"].includes(me.tenant.ops_status);
  const isAccountStatus = location.pathname === "/portal" || location.pathname === "/portal/me";

  if (blocked && !isAccountStatus) {
    return <Navigate to="/portal/me" replace />;
  }

  return <Outlet />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/portal" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/login/callback" element={<LoginCallback />} />

      <Route path="/portal" element={<PortalGate />}>
        <Route element={<Shell mode="portal" />}>
          <Route index element={<PortalHome />} />
          <Route path="me" element={<PortalHome />} />
          <Route path="stats" element={<PortalStats />} />
          <Route path="billing/balance" element={<PortalBillingBalance />} />
          <Route path="billing/ledger" element={<PortalBillingLedger />} />
          <Route path="apikeys" element={<PortalApiKeys />} />
          <Route path="audit-logs" element={<PortalAuditLogs />} />
          <Route path="webhooks/endpoints" element={<PortalWebhooksEndpoints />} />
          <Route path="webhooks/deliveries" element={<PortalWebhooksDeliveries />} />
          <Route path="onboarding" element={<PortalOnboarding />} />
          <Route path="onboarding/kyb-upload" element={<PortalKybUpload />} />
          <Route path="webhooks" element={<Navigate to="webhooks/endpoints" replace />} />
        </Route>
      </Route>
      <Route path="/admin" element={<Shell mode="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="tenants" element={<AdminPlaceholder title="Tenants" />} />
        <Route path="apikeys" element={<AdminPlaceholder title="API Keys Admin" />} />
        <Route path="compliance/holds" element={<AdminPlaceholder title="Compliance Holds" />} />
        <Route path="control-plane-events" element={<AdminPlaceholder title="Control Plane Events" />} />
        <Route path="billing/topup" element={<AdminPlaceholder title="Billing Top-up" />} />
        <Route path="plans" element={<AdminPlaceholder title="Plans" />} />
      </Route>
      <Route path="*" element={<Navigate to="/portal" replace />} />
    </Routes>
  );
}
