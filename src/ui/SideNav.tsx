import { NavLink } from "react-router-dom";

function Item({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? "cw-navitem cw-navitem-active" : "cw-navitem")}
    >
      {label}
    </NavLink>
  );
}

export default function SideNav({ mode }: { mode: "portal" | "admin" }) {
  return (
    <aside className="cw-sidenav">
      {mode === "portal" ? (
        <>
          <div className="cw-navgroup">Client</div>
          <Item to="/portal/me" label="Account Status" />
          <Item to="/portal/stats" label="Usage" />
          <Item to="/portal/webhooks/endpoints" label="Webhooks" />
          <Item to="/portal/billing/balance" label="Billing" />
          <Item to="/portal/apikeys" label="API Keys" />
          <Item to="/portal/audit-logs" label="Audit Logs" />
          <Item to="/portal/onboarding" label="Onboarding" />
          <Item to="/portal/onboarding/kyb-upload" label="KYB Upload" />
        </>
      ) : (
        <>
          <div className="cw-navgroup">Admin</div>
          <Item to="/admin" label="Overview" />
          <Item to="/admin/tenants" label="Tenants" />
          <Item to="/admin/compliance/holds" label="Compliance Holds" />
          <Item to="/admin/control-plane-events" label="Control Plane Events" />
          <Item to="/admin/apikeys" label="API Keys Admin" />
          <Item to="/admin/billing/topup" label="Billing Top-up" />
          <Item to="/admin/plans" label="Plans" />
        </>
      )}
    </aside>
  );
}
