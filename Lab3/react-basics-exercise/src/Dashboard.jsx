import { useState } from 'react';

// Dashboard component with tabs
function Dashboard({ todos }) {
  const [activeTab, setActiveTab] = useState('Bar');
  
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const inProgress = total - completed;
  const progressPercent = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const completedPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const maxValue = Math.max(total, 1);

  // Bar Chart Component
  const BarChart = () => {
    const completedHeight = total > 0 ? (completed / maxValue) * 100 : 0;
    const inProgressHeight = total > 0 ? (inProgress / maxValue) * 100 : 0;

    return (
      <div className="bar-chart">
        <div className="chart-bars">
          <div className="bar-container">
            <div 
              className="bar completed-bar" 
              style={{ height: `${completedHeight}%` }}
            >
              <span className="bar-value">{completed}</span>
            </div>
            <span className="bar-label">Completed</span>
          </div>
          <div className="bar-container">
            <div 
              className="bar in-progress-bar" 
              style={{ height: `${inProgressHeight}%` }}
            >
              <span className="bar-value">{inProgress}</span>
            </div>
            <span className="bar-label">In Progress</span>
          </div>
        </div>
        <div className="chart-y-axis">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue * 0.75)}</span>
          <span>{Math.floor(maxValue * 0.5)}</span>
          <span>{Math.floor(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
      </div>
    );
  };

  // Line Chart Component
  const LineChart = () => {
    const points = [
      { x: 20, y: total > 0 ? 100 - (completed / maxValue) * 80 : 100 },
      { x: 80, y: total > 0 ? 100 - (inProgress / maxValue) * 80 : 100 },
    ];

    return (
      <div className="line-chart">
        <svg viewBox="0 0 200 120" className="line-chart-svg">
          {/* Grid lines */}
          <line x1="20" y1="20" x2="20" y2="100" stroke="#ddd" strokeWidth="1" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="#ddd" strokeWidth="1" />
          
          {/* Data line */}
          <polyline
            points={`${points[0].x},${points[0].y} ${points[1].x},${points[1].y}`}
            fill="none"
            stroke="#9333ea"
            strokeWidth="3"
          />
          
          {/* Data points */}
          <circle cx={points[0].x} cy={points[0].y} r="5" fill="#e9d5ff" stroke="#9333ea" strokeWidth="2" />
          <circle cx={points[1].x} cy={points[1].y} r="5" fill="#9333ea" />
          
          {/* Labels */}
          <text x={points[0].x + 8} y="115" textAnchor="middle" fontSize="10" fill="#666">
            Completed
          </text>
          <text x={points[1].x + 8} y="115" textAnchor="middle" fontSize="10" fill="#666">
            In Progress
          </text>
          
          {/* Values */}
          <text x={points[0].x} y={points[0].y - 10} textAnchor="middle" fontSize="12" fill="#9333ea" fontWeight="bold">
            {completed}
          </text>
          <text x={points[1].x} y={points[1].y - 10} textAnchor="middle" fontSize="12" fill="#9333ea" fontWeight="bold">
            {inProgress}
          </text>
        </svg>
      </div>
    );
  };

  // Pie Chart Component
  const PieChart = () => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const completedLength = total > 0 ? (completed / total) * circumference : 0;
    const inProgressLength = total > 0 ? (inProgress / total) * circumference : 0;
    const completedOffset = circumference - completedLength;
    const inProgressOffset = circumference - inProgressLength;

    return (
      <div className="pie-chart">
        <svg viewBox="0 0 150 150" className="pie-chart-svg">
          {/* Completed slice */}
          {total > 0 && completed > 0 && (
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#e9d5ff"
              strokeWidth="20"
              strokeDasharray={`${completedLength} ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 75 75)"
            />
          )}
          
          {/* In Progress slice */}
          {total > 0 && inProgress > 0 && (
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#9333ea"
              strokeWidth="20"
              strokeDasharray={`${inProgressLength} ${circumference}`}
              strokeDashoffset={-completedLength}
              transform="rotate(-90 75 75)"
            />
          )}
          
          {/* Empty state */}
          {total === 0 && (
            <circle
              cx="75"
              cy="75"
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="20"
            />
          )}
          
          {/* Center text */}
          <text x="75" y="70" textAnchor="middle" fontSize="16" fill="#333" fontWeight="bold">
            {total}
          </text>
          <text x="75" y="90" textAnchor="middle" fontSize="12" fill="#666">
            Total
          </text>
        </svg>
        
        {/* Legend */}
        <div className="pie-legend">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#e9d5ff' }}></span>
            <span>Completed ({completedPercent}%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#9333ea' }}></span>
            <span>In Progress ({progressPercent}%)</span>
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (activeTab) {
      case 'Bar':
        return <BarChart />;
      case 'Line':
        return <LineChart />;
      case 'Pie':
        return <PieChart />;
      default:
        return <BarChart />;
    }
  };

  return (
    <div className="dashboard-card">
      <h3 className="dashboard-title">Dashboard</h3>
      
      <div className="tabs">
        <button 
          className={activeTab === 'Bar' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('Bar')}
        >
          Bar
        </button>
        <button 
          className={activeTab === 'Line' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('Line')}
        >
          Line
        </button>
        <button 
          className={activeTab === 'Pie' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('Pie')}
        >
          Pie
        </button>
      </div>

      <div className="chart-area">
        {renderChart()}
      </div>

      <div className="dashboard-stats">
        {inProgress}/{total} ({progressPercent}% in progress)
      </div>
    </div>
  );
}

export default Dashboard;

