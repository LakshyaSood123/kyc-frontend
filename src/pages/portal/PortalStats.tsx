import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Widget from "../../ui/Widget";
import { usePortalAuth } from "../../lib/portalAuth";
import { getPortalStats, type PortalStatsResponse } from "../../lib/portalApi";
import { loadConfig } from "../../lib/config";

export default function PortalStats() {
  const { tokens, authDisabled } = usePortalAuth();
  const useMocks = Boolean(loadConfig().useMocks);
  const [data, setData] = useState<PortalStatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authDisabled && !useMocks) return;
    if (!tokens.idToken && !useMocks) return;
    getPortalStats(tokens.idToken ?? "mock-token")
      .then(setData)
      .catch((err) => setError(err.message));
  }, [authDisabled, tokens.idToken, useMocks]);

  if (authDisabled && !tokens.idToken && !useMocks) {
    return (
      <div className="cw-page">
        <div className="cw-card cw-card-tone-neutral">
          <h1 className="cw-title">Usage</h1>
          <p className="cw-muted">Auth bypass enabled; API calls are skipped.</p>
        </div>
      </div>
    );
  }

  const history = useMemo(() => {
    if (!data?.stats.history) return [];
    return Object.entries(data.stats.history).map(([date, value]) => ({
      date,
      value,
    }));
  }, [data]);

  return (
    <div className="cw-page">
      <div className="cw-grid">
        <div className="cw-col-4">
          <Widget title="Jobs Today" tone="success">
            <div className="cw-kpi">{data?.stats.jobs_today ?? "-"}</div>
          </Widget>
        </div>
        <div className="cw-col-4">
          <Widget title="Jobs (30d)" tone="warning">
            <div className="cw-kpi">{data?.stats.jobs_total_30d ?? "-"}</div>
          </Widget>
        </div>
        <div className="cw-col-4">
          <Widget title="Environment" tone="violet">
            <div className="cw-kpi">{data?.stats.environment ?? "-"}</div>
          </Widget>
        </div>

        <div className="cw-col-8">
          <Widget title="Usage (30d)" tone="info">
            {error && <div className="cw-alert">{error}</div>}
            {!error && history.length === 0 && <p className="cw-muted">No history available.</p>}
            {history.length > 0 && (
              <div className="cw-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={history}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Widget>
        </div>

        <div className="cw-col-4">
          <Widget title="Status" tone="neutral">
            {!data && !error && <p className="cw-muted">Loading stats…</p>}
            {data && (
              <div className="cw-muted">
                Stats cover the last 30 days. API: <code>/portal/stats</code>
              </div>
            )}
          </Widget>
        </div>
      </div>
    </div>
  );
}
