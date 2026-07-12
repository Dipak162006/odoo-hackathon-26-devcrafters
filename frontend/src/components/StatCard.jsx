import { TrendingUp, TrendingDown, Truck, Users, MapPin, Wrench, Fuel, DollarSign } from 'lucide-react';

const ICON_MAP = {
  vehicles: Truck,
  'active-trips': MapPin,
  drivers: Users,
  'fuel-cost': Fuel,
  maintenance: Wrench,
  revenue: DollarSign,
};

export default function StatCard({ id, label, value, trend, trendDir, period, variant }) {
  const Icon = ICON_MAP[id] || Truck;

  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-card-header">
        <div className={`stat-card-icon ${variant}`}>
          <Icon />
        </div>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-footer">
        <span className={`stat-trend ${trendDir}`}>
          {trendDir === 'up' ? <TrendingUp /> : <TrendingDown />}
          {trend}
        </span>
        <span className="text-caption">{period}</span>
      </div>
    </div>
  );
}
