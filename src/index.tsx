import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExposeProvider } from './ExposeContext';
import { ExposeWrapper } from './components/ExposeWrapper';
import { ExposeTrigger } from './components/ExposeTrigger';

// Import global styles
import './styles/exposeProvider.css';
import './styles/exposeWrapper.css';
import './styles/backdrop.css';
import './demo.css';

const App = () => {
  return (
    <ExposeProvider 
      shortcut="ArrowUp"
      blurAmount={15}
      onActivate={() => console.log('Expose activated: ' + new Date().toISOString())}
      onDeactivate={() => console.log('Expose deactivated: ' + new Date().toISOString())}
    >
      <ExposeTrigger />
      <div className="app">
        <header className="header">
          <h1>Expose Demo</h1>
          <div className="instructions">
            Double-tap <kbd>↑</kbd> key quickly to activate Exposé view.<br />
            Press <kbd>Esc</kbd> to return windows to their original positions.
          </div>
        </header>
        
        <div className="window-grid">
          <ExposeWrapper label="Analytics Dashboard" className="dashboard-window">
            <div className="window-content analytics">
              <div className="chart-container">
                <div className="chart">
                  <div className="bar" style={{ height: '70%' }}></div>
                  <div className="bar" style={{ height: '40%' }}></div>
                  <div className="bar" style={{ height: '90%' }}></div>
                  <div className="bar" style={{ height: '60%' }}></div>
                  <div className="bar" style={{ height: '80%' }}></div>
                </div>
                <div className="chart-label">Weekly Trend</div>
              </div>
              <div className="stats-grid">
                <div className="stat">
                  <div className="stat-value">78%</div>
                  <div className="stat-label">Engagement</div>
                </div>
                <div className="stat">
                  <div className="stat-value">5.2%</div>
                  <div className="stat-label">Conversion</div>
                </div>
                <div className="stat">
                  <div className="stat-value">12:42</div>
                  <div className="stat-label">Avg. Time</div>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          {/* All other ExposeWrapper components remain the same */}
          <ExposeWrapper label="User Management" className="users-window">
            <div className="window-content users">
              {/* Content */}
            </div>
          </ExposeWrapper>
          
          {/* And so on with the rest of the components */}
        </div>
      </div>
    </ExposeProvider>
  );
};

// Mount the app to the DOM
const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Export components for library use
export { ExposeProvider } from './ExposeContext';
export { ExposeWrapper } from './components/ExposeWrapper';
export { ExposeTrigger } from './components/ExposeTrigger';
export { useExpose } from './ExposeContext';