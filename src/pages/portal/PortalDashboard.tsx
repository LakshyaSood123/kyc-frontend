import Widget from "../../ui/Widget";
import LineChartWidget from "../../ui/charts/LineChartWidget";
import BarChartWidget from "../../ui/charts/BarChartWidget";
import PieChartWidget from "../../ui/charts/PieChartWidget";
import StackedAreaWidget from "../../ui/charts/StackedAreaWidget";

import AlarmStatusWidget from "../../ui/widgets/AlarmStatusWidget";
import ContributorInsightsWidget from "../../ui/widgets/ContributorInsightsWidget";
import AlarmAnomalyWidget from "../../ui/widgets/AlarmAnomalyWidget";
import LogsWidget from "../../ui/widgets/LogsWidget";
import TextWidget from "../../ui/widgets/TextWidget";
import NumberWidgetRow from "../../ui/widgets/NumberWidgetRow";

function makeSeries() {
  const times = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
  return times.map((t, i) => ({
    t,
    cwu: 0.4 + (i % 3) * 0.05,
    storekeeper: 0.45 + ((i + 1) % 3) * 0.04,
    sys: 0.35 + ((i + 2) % 3) * 0.03,
  }));
}

function makeAnomaly() {
  const times = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
  return times.map((t, i) => ({
    t,
    cpu: 0.42 + (i === 6 ? 0.08 : (i % 2) * 0.02),
    expected: 0.43 + (i % 2) * 0.01,
  }));
}

export default function PortalDashboard() {
  const lineData = makeSeries();
  const areaData = makeSeries();
  const anomaly = makeAnomaly();

  const barData = [
    { name: "A", a: 0.64, b: 0.0, c: 0.0 },
    { name: "B", a: 0.0, b: 0.64, c: 0.0 },
    { name: "C", a: 0.0, b: 0.0, c: 0.08 },
  ];

  const pieData = [
    { name: "CwuSampleapp-env", value: 40 },
    { name: "Scorekeeper-env", value: 35 },
    { name: "Systems Manager Test", value: 25 },
  ];

  return (
    <div className="cw-page">
      <div className="cw-grid">
        <div className="cw-col-4">
          <Widget title="Line chart">
            <LineChartWidget data={lineData} />
          </Widget>
        </div>

        <div className="cw-col-4">
          <Widget title="Bar chart">
            <BarChartWidget data={barData} />
          </Widget>
        </div>

        <div className="cw-col-4">
          <Widget title="Pie chart">
            <PieChartWidget data={pieData} />
          </Widget>
        </div>

        <div className="cw-col-4">
          <Widget title="Alarm Status">
            <AlarmStatusWidget />
          </Widget>
        </div>

        <div className="cw-col-4">
          <Widget title="Contributor Insights">
            <ContributorInsightsWidget />
          </Widget>
        </div>

        <div className="cw-col-4">
          <Widget title="Alarm + Anomaly Detection" right={<span className="cw-pill">×</span>}>
            <AlarmAnomalyWidget data={anomaly} />
          </Widget>
        </div>

        <div className="cw-col-4">
          <Widget title="Stacked area chart">
            <StackedAreaWidget data={areaData} />
          </Widget>
        </div>

        <div className="cw-col-8">
          <Widget title="Log Widget">
            <LogsWidget />
          </Widget>
        </div>

        <div className="cw-col-4">
          <Widget title="Text widget">
            <TextWidget />
          </Widget>
        </div>

        <div className="cw-col-8">
          <Widget title="Number widgets">
            <NumberWidgetRow />
          </Widget>
        </div>
      </div>
    </div>
  );
}
