import { Outlet } from "react-router-dom";
import { usePortalAuth } from "../lib/portalAuth";
import TopBar from "./TopBar";
import SideNav from "./SideNav";

export default function Shell({ mode }: { mode: "portal" | "admin" }) {
  const { logout } = usePortalAuth();

  return (
    <div className="cw-shell">
      <TopBar mode={mode} onLogout={mode === "portal" ? logout : undefined} />
      <div className="cw-body">
        <SideNav mode={mode} />
        <main className="cw-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
