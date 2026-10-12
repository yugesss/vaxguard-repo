import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  ChevronRight,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  Syringe,
  Thermometer,
  TrendingUp,
  User,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { assignFefoIssueOrder, formatDaysLeft, formatFefoDate, getDaysLeft } from '../lib/fefo.ts';
import { useBatches } from '../lib/api/useBatches.ts';
import vaxguardLogo from './assets/vaxguard-logo.png';

const cn = (...classes) => twMerge(clsx(classes));
const BrandMark = () => <img src={vaxguardLogo} alt="VaxGuard logo" className="brand-mark-image" />;
const inventoryDemoDate = new Date('2026-10-05T00:00:00+05:30');

const formatNumber = (value) => new Intl.NumberFormat('en-IN').format(value);

const getStatusTone = (status) => {
  if (status === 'expired' || status === 'critical') return 'critical';
  if (status === 'high' || status === 'warning') return 'warning';
  return 'success';
};

const tempData = [
  { time: '00:00', temp: 4.2 },
  { time: '02:00', temp: 4.5 },
  { time: '04:00', temp: 5.1 },
  { time: '06:00', temp: 4.8 },
  { time: '08:00', temp: 4.2 },
  { time: '10:00', temp: 3.9 },
  { time: '12:00', temp: 4.5 },
  { time: '14:00', temp: 5.4 },
  { time: '16:00', temp: 4.9 },
  { time: '18:00', temp: 4.1 },
  { time: '20:00', temp: 3.8 },
  { time: '22:00', temp: 4.2 },
];

const facilities = [
  { name: 'PHC Koramangala Unit-A', status: 'Critical', temp: '15.2°C', lastUpdate: '2 mins ago', type: 'critical' },
  { name: 'District Hospital Fridge-2', status: 'Evaluation needed', temp: '10.8°C', lastUpdate: '5 mins ago', type: 'warning' },
  { name: 'PHC Whitefield Unit', status: 'Recovered', temp: '4.2°C', lastUpdate: '12 mins ago', type: 'success' },
];

const AlertBadge = ({ tone, children }) => (
  <span className={cn('chip', tone === 'critical' ? 'chip-critical' : tone === 'warning' ? 'chip-watch' : 'chip-success')}>
    {children}
  </span>
);

const FeatureCard = ({ title, text, index }) => (
  <article className="feature-card">
    <div className="feature-icon"><span>{index + 1}</span></div>
    <h3>{title}</h3>
    <p>{text}</p>
  </article>
);

const DashboardView = () => (
  <div className="stack">
    <div className="alert-banner">
      <div className="alert-left">
        <div className="alert-icon"><AlertTriangle size={18} /></div>
        <div>
          <strong>2 need attention</strong>
          <small>1 critical, 1 warning</small>
        </div>
      </div>
      <button className="btn btn-primary small">Review queue</button>
    </div>

    <div className="metrics-grid">
      {[
        { label: 'Temperature compliance', value: '98.7%', meta: '+1.8 pts vs 7d', icon: Thermometer },
        { label: 'Active shipments', value: '12', meta: '+3 this week', icon: Package },
        { label: 'Doses monitored', value: '18,426', meta: '+4.2%', icon: Syringe },
        { label: 'Active alerts', value: '3', meta: '2 critical', icon: AlertTriangle },
      ].map(({ label, value, meta, icon }) => {
        const MetricIcon = icon;
        return (
          <div key={label} className="metric-card">
            <div className="metric-top">
              <div className="metric-icon"><MetricIcon size={18} /></div>
              <span className="metric-trend">Healthy</span>
            </div>
            <p>{label}</p>
            <h3>{value}</h3>
            <small>{meta}</small>
          </div>
        );
      })}
    </div>

    <div className="dashboard-grid">
      <div className="panel chart-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Cold-chain temperature</p>
            <h2>Chennai Central Vaccine Hub</h2>
          </div>
          <div className="panel-actions">
            <span className="chip chip-success">Within 2 to 8 C</span>
            <button className="btn btn-secondary small">View as table</button>
          </div>
        </div>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tempData}>
              <defs>
                <linearGradient id="tempFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1366D6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#1366D6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#D6E2F0" strokeDasharray="3 3" />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#4A5F7A' }} />
              <YAxis domain={[3, 7]} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#4A5F7A' }} />
              <Tooltip
                formatter={(value) => [`${value}°C`, 'Temperature']}
                contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D6E2F0', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="temp" stroke="#1366D6" fill="url(#tempFill)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="summary-line">Current 4.7°C · Min 3.9°C · Max 5.2°C · Avg 4.6°C</p>
      </div>

      <div className="panel">
        {facilities.map((facility) => (
          <div key={facility.name} className="facility-card">
            <div className="facility-main">
              <div>
                <h3>{facility.name}</h3>
                <AlertBadge tone={facility.type}>{facility.status}</AlertBadge>
              </div>
              <div className="facility-temp">
                <strong>{facility.temp}</strong>
                <small>{facility.lastUpdate}</small>
              </div>
            </div>
            <div className="facility-actions">
              <button className="btn btn-secondary small">View logs</button>
              <button className="btn btn-ghost small">Optimize</button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="dashboard-grid lower-grid">
      <div className="panel">
        <div className="panel-header compact">
          <h2>Attention required</h2>
          <button className="btn btn-secondary small">View all</button>
        </div>
        <div className="stack-list">
          {[
            { id: 'VG-0042', text: 'Shipment VG-0042 at 8.6°C for 03m 42s, limit 8.0°C', tone: 'critical' },
            { id: 'TMP117-04', text: 'TMP117-04 at 7.6°C for 08m 10s, limit 8.0°C', tone: 'warning' },
            { id: 'Pondicherry', text: 'Pondicherry Storage Unit on backup power', tone: 'warning' },
          ].map((item) => (
            <div key={item.id} className="attention-row">
              <div>
                <strong>{item.text}</strong>
                <small>Duration 03m 42s</small>
              </div>
              <div className="row-actions">
                <AlertBadge tone={item.tone}>{item.tone}</AlertBadge>
                <button className="btn btn-secondary small">Review</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header compact">
          <h2>Inventory risk</h2>
        </div>
        <div className="risk-list">
          {[
            ['Expiring within 30 days', '742 doses'],
            ['Temperature at risk', '24 batches'],
            ['Low stock', '6 SKUs'],
          ].map(([label, value]) => (
            <div key={label} className="risk-item">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MarketingPage = () => (
  <div className="marketing-shell">
    <header className="topbar">
      <div className="container nav-row">
        <div className="brand-block">
          <BrandMark />
          <span className="brand-text">VaxGuard</span>
        </div>
        <nav className="nav-links">
          <a href="#platform">Platform</a>
          <a href="#solutions">Solutions</a>
          <a href="#resources">Resources</a>
          <a href="#about">About</a>
        </nav>
        <div className="nav-actions">
          <button className="btn btn-ghost">Sign in</button>
          <button className="btn btn-primary">Request a demo</button>
        </div>
      </div>
    </header>

    <main className="container marketing-main">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Cold-chain operations, simplified</p>
          <h1>Protect every dose.</h1>
          <p className="lead">Real-time visibility for vaccine handling, storage and dispatch across every facility.</p>
          <div className="cta-row">
            <button className="btn btn-primary">Request a demo</button>
            <button className="btn btn-secondary">See the platform</button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-header">
              <span className="dot dot-blue" />
              <span className="dot dot-blue" />
              <span className="dot dot-blue" />
            </div>
            <div className="visual-body">
              <div className="dummy-chart" />
              <div className="mini-grid">
                <div className="mini-panel primary"><span>4.7°C</span><small>Chennai</small></div>
                <div className="mini-panel"><span>3 alerts</span><small>Live</small></div>
              </div>
            </div>
          </div>
          <div className="caption">Illustrative photo</div>
        </div>
      </section>

      <section id="solutions" className="section-block">
        <div className="section-head">
          <p className="eyebrow">Audience paths</p>
          <h2>Built for the day-to-day job</h2>
        </div>
        <div className="card-grid three-col">
          <article className="info-card">
            <h3>Clinic</h3>
            <p>Check fridge health, review stock and respond to temperature alerts before a session starts.</p>
          </article>
          <article className="info-card">
            <h3>District store</h3>
            <p>Keep a clear view of inventory, FEFO priorities and cold-chain readiness across facilities.</p>
          </article>
          <article className="info-card">
            <h3>Logistics</h3>
            <p>Track cargo movement, monitor logger condition and escalate delays before they affect delivery.</p>
          </article>
        </div>
      </section>

      <section id="platform" className="section-block">
        <div className="section-head">
          <p className="eyebrow">What VaxGuard monitors</p>
          <h2>Continuous oversight across the chain</h2>
        </div>
        <div className="card-grid six-col">
          {['Temperature', 'Equipment', 'Inventory', 'Shipments', 'Alerts', 'Devices'].map((item, index) => (
            <FeatureCard key={item} title={item} text="Rule-based monitoring for safe storage, dispatch and equipment readiness." index={index} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <p className="eyebrow">How it works</p>
          <h2>From sensors to action</h2>
        </div>
        <div className="steps">
          {['Sensors record', 'Gateways relay', 'Platform flags excursions', 'Teams act and document'].map((step, index) => (
            <div className="step" key={step}><span>{index + 1}</span><p>{step}</p></div>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="standards-box">[Content to be confirmed by VaxGuard team: reference standards and certifications]</div>
      </section>
    </main>

    <footer className="marketing-footer">
      <div className="container footer-grid">
        <div>
          <div className="brand-block white">
            <BrandMark />
            <span className="brand-text">VaxGuard</span>
          </div>
          <p>VaxGuard demo site. Not a medical device. Simulated data.</p>
        </div>
        <div>
          <h4>Platform</h4>
          <a href="#platform">Monitoring</a>
          <a href="#solutions">Inventory</a>
        </div>
        <div>
          <h4>Resources</h4>
          <a href="#resources">Guides</a>
          <a href="#about">About</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="#about">Mission</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </footer>
  </div>
);

const LoginPage = () => (
  <div className="login-shell">
    <div className="login-panel brand-panel">
      <div className="brand-block white margin-bottom-16">
        <BrandMark />
        <span className="brand-text">VaxGuard</span>
      </div>
      <h1>Protect every dose.</h1>
      <p>Real-time visibility for vaccine cold-chain operations.</p>
      <div className="photo-slot">Photo slot: cold-storage room</div>
    </div>

    <div className="login-panel form-panel">
      <div className="brand-block hide-mobile">
        <BrandMark />
        <span className="brand-text">VaxGuard</span>
      </div>
      <h2>Sign in</h2>
      <form className="login-form">
        <label>
          <span>Email</span>
          <input type="email" defaultValue="ops@vaxguard.demo" />
        </label>
        <label>
          <span>Password</span>
          <input type="password" defaultValue="password" />
        </label>
        <div className="form-row">
          <label className="check-row"><input type="checkbox" defaultChecked /> <span>Remember me</span></label>
          <a href="#">Forgot password</a>
        </div>
        <button type="button" className="btn btn-primary full">Sign in</button>
        <button type="button" className="btn btn-secondary full">Continue with SSO</button>
      </form>
      <div className="inline-error">Incorrect email or password. 2 attempts remaining.</div>
      <p className="demo-note">Demo environment. Any credentials work.</p>
    </div>
  </div>
);

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Live Monitoring', icon: Activity },
  { label: 'Cold-Chain', icon: Thermometer },
  { label: 'Vaccine Inventory', icon: Package },
  { label: 'Shipments', icon: ArrowUpRight },
  { label: 'Alerts', icon: AlertTriangle },
  { label: 'Devices', icon: FlaskConical },
  { label: 'Analytics', icon: TrendingUp },
  { label: 'Reports', icon: FileText },
];

const MonitoringView = () => (
  <div className="stack">
    <div className="metrics-grid">
      {[
        { label: 'Connected sites', value: '42', meta: '8 added this week', icon: Activity },
        { label: 'Temperature drift', value: '1.6°C', meta: 'Within tolerance', icon: Thermometer },
        { label: 'On-time dispatch', value: '96%', meta: '+3.1 pts', icon: ArrowUpRight },
        { label: 'Open incidents', value: '4', meta: '2 require escalation', icon: AlertTriangle },
      ].map(({ label, value, meta, icon }) => {
        const MetricIcon = icon;
        return (
          <div key={label} className="metric-card">
            <div className="metric-top">
              <div className="metric-icon"><MetricIcon size={18} /></div>
              <span className="metric-trend">Healthy</span>
            </div>
            <p>{label}</p>
            <h3>{value}</h3>
            <small>{meta}</small>
          </div>
        );
      })}
    </div>

    <div className="dashboard-grid">
      <div className="panel">
        <div className="panel-header compact">
          <h2>Live site status</h2>
          <button className="btn btn-secondary small">Refresh</button>
        </div>
        <div className="data-grid">
          {[
            { name: 'Chennai Hub', value: '4.7°C', status: 'Stable' },
            { name: 'Vellore Dispensary', value: '5.4°C', status: 'Watch' },
            { name: 'Madurai Cold Room', value: '4.1°C', status: 'Stable' },
            { name: 'Coimbatore Depot', value: '7.9°C', status: 'Alert' },
          ].map((item) => (
            <div key={item.name} className="data-card">
              <span>{item.name}</span>
              <strong>{item.value}</strong>
              <AlertBadge tone={item.status === 'Alert' ? 'critical' : item.status === 'Watch' ? 'warning' : 'success'}>{item.status}</AlertBadge>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header compact">
          <h2>Monitoring queue</h2>
        </div>
        <div className="risk-list">
          {[
            ['Transfer delay', 'TN-1021'],
            ['Power irregularity', 'PHC-07'],
            ['Logger battery', 'TMP-18'],
          ].map(([label, value]) => (
            <div key={label} className="risk-item">
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ColdChainView = () => (
  <div className="stack">
    <div className="metrics-grid">
      {[
        { label: 'Cold rooms active', value: '18', meta: '2 pending checks', icon: Thermometer },
        { label: 'Average temp', value: '4.6°C', meta: 'Target 2–8°C', icon: Activity },
        { label: 'Power resilience', value: '99.2%', meta: 'UPS stable', icon: Package },
        { label: 'Deviation events', value: '3', meta: 'Last 24h', icon: AlertTriangle },
      ].map(({ label, value, meta, icon }) => {
        const MetricIcon = icon;
        return (
          <div key={label} className="metric-card">
            <div className="metric-top">
              <div className="metric-icon"><MetricIcon size={18} /></div>
              <span className="metric-trend">Stable</span>
            </div>
            <p>{label}</p>
            <h3>{value}</h3>
            <small>{meta}</small>
          </div>
        );
      })}
    </div>

    <div className="panel">
      <div className="panel-header compact">
        <h2>Temperature zones</h2>
        <button className="btn btn-secondary small">Download log</button>
      </div>
      <div className="data-grid">
        {[
          { name: 'Freezer Room A', value: '-20°C', status: 'Stable' },
          { name: 'Vaccine Store', value: '4.7°C', status: 'Stable' },
          { name: 'Warehouse Prep', value: '6.8°C', status: 'Watch' },
          { name: 'Field Carrier 2', value: '8.6°C', status: 'Alert' },
        ].map((item) => (
          <div key={item.name} className="data-card">
            <span>{item.name}</span>
            <strong>{item.value}</strong>
            <AlertBadge tone={item.status === 'Alert' ? 'critical' : item.status === 'Watch' ? 'warning' : 'success'}>{item.status}</AlertBadge>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const InventoryView = () => {
  const { batches, units, loading, error, slotMap } = useBatches();
  const [inventoryTab, setInventoryTab] = useState(() => {
    if (typeof window === 'undefined') return 'overview';
    const tab = new URLSearchParams(window.location.search).get('tab');
    return tab === 'fefo' ? 'fefo' : tab === 'slots' ? 'slots' : 'overview';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vaccineFilter, setVaccineFilter] = useState('all');
  const [sortMode, setSortMode] = useState('expiry');
  const [selectedSlot, setSelectedSlot] = useState('A1');
  const [selectedBatch, setSelectedBatch] = useState('VG-B-2026-000417');
  const [slotViewMode, setSlotViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState(units[0]?.id || 'ILR-01');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (inventoryTab === 'overview') {
      params.delete('tab');
    } else {
      params.set('tab', inventoryTab);
    }
    const query = params.toString();
    const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
    window.history.replaceState({}, '', nextUrl);
  }, [inventoryTab]);

  const fefoRows = useMemo(() => assignFefoIssueOrder(batches, inventoryDemoDate), [batches]);

  const vaccineOptions = useMemo(() => {
    const vaccines = [...new Set(batches.map((batch) => batch.vaccineName))];
    return vaccines.sort();
  }, [batches]);

  const filteredFefoRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const nextRows = fefoRows.filter((row) => {
      const matchesSearch = !term || [row.vaccineName, row.uid, row.batchNo].some((value) => value.toLowerCase().includes(term));
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter || (statusFilter === 'expired' && row.daysLeft < 0);
      const matchesVaccine = vaccineFilter === 'all' || row.vaccineName === vaccineFilter;
      return matchesSearch && matchesStatus && matchesVaccine;
    });

    if (sortMode === 'expiry') {
      nextRows.sort((left, right) => {
        if (left.daysLeft === right.daysLeft) return left.uid.localeCompare(right.uid);
        return left.daysLeft - right.daysLeft;
      });
    }

    if (sortMode === 'name') {
      nextRows.sort((left, right) => left.vaccineName.localeCompare(right.vaccineName) || left.uid.localeCompare(right.uid));
    }

    return nextRows;
  }, [fefoRows, searchTerm, statusFilter, vaccineFilter, sortMode]);

  const pageSize = 5;
  const pageCount = Math.max(1, Math.ceil(filteredFefoRows.length / pageSize));
  const currentPageRows = filteredFefoRows.slice((page - 1) * pageSize, page * pageSize);

  const summaryCounts = useMemo(() => {
    const expiredCount = fefoRows.filter((row) => row.daysLeft < 0).length;
    const criticalCount = fefoRows.filter((row) => row.daysLeft >= 0 && row.daysLeft <= 7).length;
    const highCount = fefoRows.filter((row) => row.daysLeft > 7 && row.daysLeft <= 30).length;
    return { expiredCount, criticalCount, highCount, total: fefoRows.length };
  }, [fefoRows]);

  const months = useMemo(() => {
    const monthSet = new Set();
    batches.forEach((batch) => monthSet.add(new Date(`${batch.expiryDate}T00:00:00+05:30`).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }))); 
    return [...monthSet].slice(0, 6);
  }, [batches]);

  const selectedBatchRow = fefoRows.find((row) => row.uid === selectedBatch) || fefoRows[0];
  const selectedBatchData = selectedBatchRow ? {
    ...selectedBatchRow,
    slotId: selectedBatchRow.slotId,
    unitId: selectedBatchRow.unitId,
    code: selectedBatchRow.uid,
    lifecycle: [
      { label: 'Received', date: selectedBatchRow.manufactureDate },
      { label: 'Stored', date: selectedBatchRow.manufactureDate },
      { label: 'Due to expire', date: selectedBatchRow.expiryDate },
    ],
  } : null;

  const totalSlots = useMemo(() => (selectedUnit ? ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'] : []), [selectedUnit]);
  const visibleSlots = totalSlots.map((slotId) => {
    const batch = slotMap[selectedUnit]?.find((row) => row.slotId === slotId);
    return {
      slotId,
      batch,
      status: batch ? (batch.status === 'quarantined' ? 'quarantine' : batch.status === 'reserved' ? 'reserved' : 'ok') : 'empty',
    };
  });

  const slotSummary = useMemo(() => {
    const unitBatches = slotMap[selectedUnit] || [];
    const used = unitBatches.length;
    const empty = totalSlots.length - used;
    const action = unitBatches.filter((row) => row.status === 'quarantined' || getDaysLeft(row.expiryDate, inventoryDemoDate) <= 30).length;
    return { used, empty, action };
  }, [selectedUnit, slotMap, totalSlots]);

  const renderFefoStatus = (row) => {
    const status = !row.isValid ? 'Data issue' : row.daysLeft < 0 ? 'Expired' : row.status === 'critical' ? 'Critical' : row.status === 'high' ? 'High' : row.status === 'normal' ? 'Normal' : 'Low priority';
    const tone = !row.isValid ? 'warning' : getStatusTone(row.status);
    return (
      <span className="status-inline">
        <span className="status-dot" />
        <AlertBadge tone={tone}>{status}</AlertBadge>
      </span>
    );
  };

  const handleRetry = () => window.location.reload();

  return (
    <div className="stack">
      <div className="metrics-grid">
        {[
          { label: 'On-hand doses', value: '1.24M', meta: 'Across 42 sites', icon: Package },
          { label: 'Low stock SKU', value: '6', meta: '3 critical', icon: AlertTriangle },
          { label: 'Near expiry', value: '742', meta: '30-day window', icon: Syringe },
          { label: 'FEFO due', value: '12', meta: 'Within 7 days', icon: TrendingUp },
        ].map(({ label, value, meta, icon }) => {
          const MetricIcon = icon;
          return (
            <div key={label} className="metric-card">
              <div className="metric-top">
                <div className="metric-icon"><MetricIcon size={18} /></div>
                <span className="metric-trend">Healthy</span>
              </div>
              <p>{label}</p>
              <h3>{value}</h3>
              <small>{meta}</small>
            </div>
          );
        })}
      </div>

      <div className="inventory-tabs">
        <button type="button" className={cn('tab-btn', inventoryTab === 'overview' && 'active')} onClick={() => setInventoryTab('overview')}>Overview</button>
        <button type="button" className={cn('tab-btn', inventoryTab === 'fefo' && 'active')} onClick={() => setInventoryTab('fefo')}>FEFO</button>
        <button type="button" className={cn('tab-btn', inventoryTab === 'slots' && 'active')} onClick={() => setInventoryTab('slots')}>Storage slots</button>
      </div>

      {inventoryTab === 'overview' && (
        <div className="panel">
          <div className="panel-header compact">
            <h2>Stock readiness</h2>
            <button className="btn btn-secondary small">Review plan</button>
          </div>
          <div className="risk-list">
            {[
              ['Hexavalent vaccine', '94% available'],
              ['BOPV oral drops', '73% available'],
              ['COVID-19 booster', 'Low inventory'],
              ['MR vaccine', 'Expiring in 18 days'],
            ].map(([label, value]) => (
              <div key={label} className="risk-item">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {inventoryTab === 'fefo' && (
        <div className="stack">
          {loading && (
            <div className="panel">
              <div className="skeleton-line long" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          )}

          {!loading && error && (
            <div className="panel error-panel">
              <h3>Unable to load FEFO data</h3>
              <p>Error ID: FEFO-ERR-204</p>
              <button type="button" className="btn btn-primary small" onClick={handleRetry}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="panel">
                <div className="panel-header compact">
                  <div>
                    <p className="eyebrow">FEFO workflow</p>
                    <h2>First expiry, first out</h2>
                  </div>
                  <button type="button" className="btn btn-secondary small">Export CSV</button>
                </div>

                <div className="summary-counts">
                  {[
                    { label: 'Expired', value: summaryCounts.expiredCount },
                    { label: '0 to 7 d', value: summaryCounts.criticalCount },
                    { label: '8 to 30 d', value: summaryCounts.highCount },
                    { label: 'Total batches', value: summaryCounts.total },
                  ].map((item) => (
                    <button key={item.label} type="button" className="summary-chip" onClick={() => setStatusFilter(item.label === 'Expired' ? 'expired' : item.label === '0 to 7 d' ? 'critical' : item.label === '8 to 30 d' ? 'high' : 'all')}>
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>

                <div className="expiry-timeline" title="FEFO issues the batch with the earliest expiry date first.">
                  {months.map((monthLabel) => (
                    <div key={monthLabel} className="timeline-month">
                      <span>{monthLabel}</span>
                      <strong>{batches.filter((batch) => new Date(`${batch.expiryDate}T00:00:00+05:30`).toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) === monthLabel).length}</strong>
                    </div>
                  ))}
                </div>

                <div className="inventory-toolbar">
                  <input value={searchTerm} onChange={(event) => { setSearchTerm(event.target.value); setPage(1); }} placeholder="Search name, code or batch" />
                  <select value={vaccineFilter} onChange={(event) => { setVaccineFilter(event.target.value); setPage(1); }}>
                    <option value="all">All vaccines</option>
                    {vaccineOptions.map((vaccine) => (<option key={vaccine} value={vaccine}>{vaccine}</option>))}
                  </select>
                  <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>
                    <option value="all">All statuses</option>
                    <option value="expired">Expired</option>
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low priority</option>
                    <option value="invalid">Data issue</option>
                  </select>
                  <select value={sortMode} onChange={(event) => { setSortMode(event.target.value); setPage(1); }}>
                    <option value="expiry">Sort: expiry</option>
                    <option value="name">Sort: name</option>
                  </select>
                  <button type="button" className="btn btn-secondary small" onClick={() => { setSearchTerm(''); setStatusFilter('all'); setVaccineFilter('all'); setSortMode('expiry'); setPage(1); }}>Clear</button>
                </div>

                {filteredFefoRows.length === 0 ? (
                  <div className="empty-state">No batches match these filters. Clear filters</div>
                ) : (
                  <div className="inventory-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th title="FEFO issues the batch with the earliest expiry date first.">Issue order</th>
                          <th>Vaccine</th>
                          <th>Unique code</th>
                          <th>Batch/lot</th>
                          <th>Manufacture</th>
                          <th>Expiry</th>
                          <th>Days left</th>
                          <th>Quantity</th>
                          <th>Location</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPageRows.map((row) => (
                          <tr key={row.uid} className={selectedSlot === row.slotId ? 'selected-row' : ''} onClick={() => { setSelectedBatch(row.uid); setSelectedSlot(row.slotId); }}>
                            <td>{row.issueOrder ?? '—'}</td>
                            <td>{row.vaccineName}</td>
                            <td>
                              <span className="code-value">{row.uid}</span>
                              <button type="button" className="mini-link" onClick={(event) => { event.stopPropagation(); navigator.clipboard?.writeText(row.uid); }}>Copy</button>
                            </td>
                            <td>{row.batchNo}</td>
                            <td>{formatFefoDate(row.manufactureDate)}</td>
                            <td>{formatFefoDate(row.expiryDate)}</td>
                            <td>{!row.isValid ? '—' : formatDaysLeft(row.daysLeft)}</td>
                            <td>
                              <strong>{formatNumber(row.quantityDoses)}</strong>
                              <span className="subtext">{row.dosesPerVial}-dose</span>
                            </td>
                            <td>
                              <button type="button" className="slot-link" onClick={(event) => { event.stopPropagation(); setInventoryTab('slots'); setSelectedUnit(row.unitId); setSelectedSlot(row.slotId); }}>
                                {row.slotId}
                              </button>
                            </td>
                            <td>
                              {row.daysLeft < 0 && <span className="notice-chip">Remove from use</span>}
                              {renderFefoStatus(row)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {filteredFefoRows.length > 0 && (
                  <div className="table-footer">
                    <span>Page {page} of {pageCount}</span>
                    <div>
                      <button type="button" className="btn btn-secondary small" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Prev</button>
                      <button type="button" className="btn btn-secondary small" disabled={page >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>Next</button>
                    </div>
                  </div>
                )}
              </div>

              {selectedBatchData && (
                <div className="drawer-panel">
                  <div className="drawer-header">
                    <div>
                      <p className="eyebrow">Batch details</p>
                      <h3>{selectedBatchData.uid}</h3>
                    </div>
                    <button type="button" className="btn btn-secondary small" onClick={() => setSelectedBatch(null)}>Close</button>
                  </div>
                  <div className="drawer-grid">
                    <div><span>Vaccine</span><strong>{selectedBatchData.vaccineName}</strong></div>
                    <div><span>Batch/lot</span><strong>{selectedBatchData.batchNo}</strong></div>
                    <div><span>Manufacture</span><strong>{formatFefoDate(selectedBatchData.manufactureDate)}</strong></div>
                    <div><span>Expiry</span><strong>{formatFefoDate(selectedBatchData.expiryDate)}</strong></div>
                    <div><span>Location</span><strong>{selectedBatchData.slotId} · {selectedBatchData.unitId}</strong></div>
                    <div><span>Quantity</span><strong>{formatNumber(selectedBatchData.quantityDoses)} doses</strong></div>
                  </div>
                  <div className="timeline-list">
                    {selectedBatchData.lifecycle.map((step) => (
                      <div key={step.label} className="timeline-item">
                        <span className="timeline-dot" />
                        <div>
                          <strong>{step.label}</strong>
                          <small>{formatFefoDate(step.date)}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {inventoryTab === 'slots' && (
        <div className="stack">
          {loading && (
            <div className="panel">
              <div className="skeleton-line long" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          )}

          {!loading && error && (
            <div className="panel error-panel">
              <h3>Unable to load storage slots</h3>
              <p>Error ID: SLOT-ERR-204</p>
              <button type="button" className="btn btn-primary small" onClick={handleRetry}>Retry</button>
            </div>
          )}

          {!loading && !error && (
            <div className="panel">
              <div className="panel-header compact">
                <h2>Storage slots</h2>
                <div className="inline-actions">
                  <button type="button" className={cn('btn btn-secondary small', slotViewMode === 'grid' && 'active')} onClick={() => setSlotViewMode('grid')}>Grid view</button>
                  <button type="button" className={cn('btn btn-secondary small', slotViewMode === 'list' && 'active')} onClick={() => setSlotViewMode('list')}>List view</button>
                </div>
              </div>

              <div className="slot-layout">
                <aside className="slot-sidebar">
                  {units.map((unit) => (
                    <button key={unit.id} type="button" className={cn('unit-card', selectedUnit === unit.id && 'selected')} onClick={() => setSelectedUnit(unit.id)}>
                      <div className="unit-header">
                        <strong>{unit.name}</strong>
                        <AlertBadge tone={unit.status === 'Watch' ? 'warning' : 'success'}>{unit.status}</AlertBadge>
                      </div>
                      <span>{unit.temperature}</span>
                    </button>
                  ))}
                </aside>

                <div className="slot-section">
                  <div className="slot-summary-row">
                    {[
                      { label: 'Slots used', value: `${slotSummary.used} / ${totalSlots.length}` },
                      { label: 'Empty slots', value: `${slotSummary.empty}` },
                      { label: 'Need action', value: `${slotSummary.action}` },
                    ].map((item) => (
                      <div key={item.label} className="summary-box">
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>

                  {slotViewMode === 'grid' ? (
                    <div className="slot-grid">
                      {visibleSlots.map((slot) => {
                        const row = slot.batch;
                        const isSelected = selectedSlot === slot.slotId;
                        const expiryDays = row ? getDaysLeft(row.expiryDate, inventoryDemoDate) : null;

                        return (
                          <button
                            type="button"
                            key={slot.slotId}
                            className={cn('slot-tile', isSelected && 'selected', row && 'occupied', row && row.status === 'quarantined' && 'quarantine', row && row.status === 'reserved' && 'reserved')}
                            title={row ? `${row.vaccineName} • Manufacture ${formatFefoDate(row.manufactureDate)} • Expiry ${formatFefoDate(row.expiryDate)}` : `Empty slot ${slot.slotId}`}
                            onClick={() => {
                              setSelectedSlot(slot.slotId);
                              if (row) {
                                setSelectedBatch(row.uid);
                              }
                            }}
                          >
                            <div className="slot-head">
                              <span>{slot.slotId}</span>
                              {row ? <span className="fefo-tag">FEFO #{row.issueOrder || 1}</span> : <span className="muted">Empty</span>}
                            </div>
                            {row ? (
                              <>
                                <strong>{row.vaccineName}</strong>
                                <small>{row.uid.slice(-6)}</small>
                                <div className="slot-meta-row">
                                  <span>{formatNumber(row.quantityDoses)} doses</span>
                                  <span>{formatFefoDate(row.expiryDate)}</span>
                                </div>
                                <span className={cn('slot-chip', expiryDays < 0 && 'critical', expiryDays <= 30 && 'warning')}>{row.status === 'quarantined' ? 'Quarantined' : expiryDays < 0 ? 'Expired' : `${formatDaysLeft(expiryDays)}`}</span>
                              </>
                            ) : (
                              <div className="empty-slot-text">Empty</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="inventory-table-wrap">
                      <table className="data-table compact-table">
                        <thead>
                          <tr>
                            <th>Slot</th>
                            <th>Vaccine</th>
                            <th>Unique code</th>
                            <th>Qty</th>
                            <th>Expiry</th>
                            <th>Days left</th>
                            <th>FEFO #</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleSlots.map((slot) => {
                            const row = slot.batch;
                            return (
                              <tr key={slot.slotId} className={selectedSlot === slot.slotId ? 'selected-row' : ''} onClick={() => { setSelectedSlot(slot.slotId); if (row) setSelectedBatch(row.uid); }}>
                                <td>{slot.slotId}</td>
                                <td>{row ? row.vaccineName : 'Empty'}</td>
                                <td>{row ? row.uid.slice(-6) : '—'}</td>
                                <td>{row ? `${formatNumber(row.quantityDoses)}` : '—'}</td>
                                <td>{row ? formatFefoDate(row.expiryDate) : '—'}</td>
                                <td>{row ? formatDaysLeft(getDaysLeft(row.expiryDate, inventoryDemoDate)) : '—'}</td>
                                <td>{row ? `#${row.issueOrder || 1}` : '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ShipmentsView = () => (
  <div className="stack">
    <div className="panel">
      <div className="panel-header compact">
        <h2>Dispatch board</h2>
        <button className="btn btn-secondary small">Open route plan</button>
      </div>
      <div className="risk-list">
        {[
          { name: 'VG-0042', status: 'Delayed', progress: 72 },
          { name: 'VG-0018', status: 'In transit', progress: 54 },
          { name: 'VG-0034', status: 'On schedule', progress: 88 },
        ].map((shipment) => (
          <div key={shipment.name} className="risk-item shipment-row">
            <div>
              <strong>{shipment.name}</strong>
              <small>{shipment.status}</small>
            </div>
            <div className="progress-wrap">
              <div className="progress-bar"><span style={{ width: `${shipment.progress}%` }} /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AlertsView = () => (
  <div className="stack">
    <div className="panel">
      <div className="panel-header compact">
        <h2>Escalation queue</h2>
        <button className="btn btn-secondary small">Export</button>
      </div>
      <div className="risk-list">
        {[
          { title: 'Fridge over-temperature', tag: 'critical' },
          { title: 'Backup power check due', tag: 'warning' },
          { title: 'Cold room defrost window', tag: 'success' },
        ].map((item) => (
          <div key={item.title} className="risk-item">
            <span>{item.title}</span>
            <AlertBadge tone={item.tag}>{item.tag}</AlertBadge>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const DevicesView = () => (
  <div className="stack">
    <div className="panel">
      <div className="panel-header compact">
        <h2>Device health</h2>
        <button className="btn btn-secondary small">Check battery status</button>
      </div>
      <div className="data-grid">
        {[
          { name: 'Logger TMP-17', value: '92%', status: 'Stable' },
          { name: 'Carrier device C2', value: '81%', status: 'Watch' },
          { name: 'Gateway G-08', value: '64%', status: 'Alert' },
          { name: 'Cold room sensor S3', value: '97%', status: 'Stable' },
        ].map((item) => (
          <div key={item.name} className="data-card">
            <span>{item.name}</span>
            <strong>{item.value}</strong>
            <AlertBadge tone={item.status === 'Alert' ? 'critical' : item.status === 'Watch' ? 'warning' : 'success'}>{item.status}</AlertBadge>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnalyticsView = () => (
  <div className="stack">
    <div className="metrics-grid">
      {[
        { label: 'Forecast variance', value: '-2.4%', meta: 'Better than plan', icon: TrendingUp },
        { label: 'Compliance trend', value: '98.7%', meta: 'Last 30 days', icon: Activity },
        { label: 'Shipment risk', value: '7.1%', meta: 'Down 1.8 pts', icon: AlertTriangle },
        { label: 'Stock SLA', value: '93%', meta: 'Targets met', icon: Package },
      ].map(({ label, value, meta, icon }) => {
        const MetricIcon = icon;
        return (
          <div key={label} className="metric-card">
            <div className="metric-top">
              <div className="metric-icon"><MetricIcon size={18} /></div>
              <span className="metric-trend">Healthy</span>
            </div>
            <p>{label}</p>
            <h3>{value}</h3>
            <small>{meta}</small>
          </div>
        );
      })}
    </div>

    <div className="panel">
      <div className="panel-header compact">
        <h2>Demand projection</h2>
      </div>
      <div className="chart-box wide-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={tempData}>
            <defs>
              <linearGradient id="projectionFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#1366D6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#1366D6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#D6E2F0" strokeDasharray="3 3" />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#4A5F7A' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#4A5F7A' }} />
            <Tooltip formatter={(value) => [`${value}k`, 'Demand']} contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D6E2F0', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="temp" stroke="#1366D6" fill="url(#projectionFill)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const ReportsView = () => (
  <div className="stack">
    <div className="panel">
      <div className="panel-header compact">
        <h2>Recent reports</h2>
        <button className="btn btn-primary small">Generate new report</button>
      </div>
      <div className="risk-list">
        {[
          'Cold-chain compliance summary',
          'Shipment exception brief',
          'Inventory risk review',
          'Quarterly sterility readiness',
        ].map((report) => (
          <div key={report} className="risk-item">
            <span>{report}</span>
            <button className="btn btn-secondary small">Open</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AppPage = () => {
  const [activeNav, setActiveNav] = useState('Overview');

  const currentView = {
    Overview: <DashboardView />,
    'Live Monitoring': <MonitoringView />,
    'Cold-Chain': <ColdChainView />,
    'Vaccine Inventory': <InventoryView />,
    Shipments: <ShipmentsView />,
    Alerts: <AlertsView />,
    Devices: <DevicesView />,
    Analytics: <AnalyticsView />,
    Reports: <ReportsView />,
  }[activeNav];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand-block white sidebar-brand">
          <BrandMark />
          <span className="brand-text">VaxGuard</span>
        </div>

        <nav className="nav-stack">
          {navItems.map(({ label, icon }) => {
            const NavigationIcon = icon;
            return (
              <button key={label} className={cn('sidebar-link', activeNav === label && 'sidebar-link-active')} onClick={() => setActiveNav(label)}>
                <NavigationIcon size={18} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-section">
          <p className="sidebar-caption">Administration</p>
          {['Facilities', 'Users & Roles', 'Integrations', 'Settings'].map((item) => (
            <button key={item} className="sidebar-link">
              <Settings size={18} />
              <span>{item}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="system-row"><span className="status-dot" /> All simulated services running</div>
          <div className="user-box"><User size={16} /> Yugesh R, Administrator</div>
        </div>
      </aside>

      <main className="app-main">
        <header className="app-topbar">
          <div className="crumbs">
            <span>Facilities</span>
            <ChevronRight size={14} />
            <strong>Chennai Central Vaccine Hub (Demo)</strong>
          </div>
          <div className="top-actions">
            <button className="icon-btn"><Search size={16} /></button>
            <button className="icon-btn"><Bell size={16} /><span className="badge">3</span></button>
            <button className="profile-pill"><User size={16} /> Yugesh</button>
          </div>
        </header>

        <div className="page-header">
          <div>
            <p className="eyebrow">{activeNav}</p>
            <h1>{activeNav === 'Overview' ? 'Cold-chain operations' : activeNav}</h1>
          </div>
          <button className="btn btn-primary">Create report</button>
        </div>

        {currentView}
      </main>
    </div>
  );
};

function App() {
  const [view, setView] = useState('marketing');

  return (
    <>
      <div className="top-app-switcher">
        <button className={cn('switch-btn', view === 'marketing' && 'active')} onClick={() => setView('marketing')}>Marketing</button>
        <button className={cn('switch-btn', view === 'login' && 'active')} onClick={() => setView('login')}>Login</button>
        <button className={cn('switch-btn', view === 'app' && 'active')} onClick={() => setView('app')}>Operations</button>
      </div>
      {view === 'marketing' && <MarketingPage />}
      {view === 'login' && <LoginPage />}
      {view === 'app' && <AppPage />}
    </>
  );
}

export default App;
