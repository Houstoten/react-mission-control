import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExposeProvider, ExposeWrapper, ExposeTrigger } from 'react-expose';
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
          
          <ExposeWrapper label="User Management" className="users-window">
            <div className="window-content users">
              <div className="user-list">
                <div className="user">
                  <div className="user-avatar"></div>
                  <div className="user-info">
                    <div className="user-name">John Smith</div>
                    <div className="user-email">john@example.com</div>
                  </div>
                </div>
                <div className="user">
                  <div className="user-avatar"></div>
                  <div className="user-info">
                    <div className="user-name">Sarah Johnson</div>
                    <div className="user-email">sarah@example.com</div>
                  </div>
                </div>
                <div className="user">
                  <div className="user-avatar"></div>
                  <div className="user-info">
                    <div className="user-name">Michael Brown</div>
                    <div className="user-email">michael@example.com</div>
                  </div>
                </div>
              </div>
              <div className="user-stats">
                <div>Active users: 5,238</div>
                <div>New today: 148</div>
              </div>
            </div>
          </ExposeWrapper>
          
          <ExposeWrapper label="Content Editor" className="editor-window">
            <div className="window-content editor">
              <div className="toolbar">
                <button className="tool-button">B</button>
                <button className="tool-button">I</button>
                <button className="tool-button">/</button>
                <button className="tool-button">🔗</button>
                <button className="tool-button">📷</button>
              </div>
              <textarea 
                className="editor-textarea"
                defaultValue="# Welcome to the editor

This is a **markdown** editor with support for:
- Lists
- *Italic text*
- **Bold text**
- And more...

> You can even use blockquotes!
"
              ></textarea>
            </div>
          </ExposeWrapper>
          
          <ExposeWrapper label="Calendar" className="calendar-window">
            <div className="window-content calendar">
              <div className="calendar-header">
                <div className="month">May 2025</div>
                <div className="calendar-nav">
                  <button className="nav-button">◀</button>
                  <button className="nav-button">Today</button>
                  <button className="nav-button">▶</button>
                </div>
              </div>
              <div className="calendar-grid">
                <div className="calendar-day header">Mon</div>
                <div className="calendar-day header">Tue</div>
                <div className="calendar-day header">Wed</div>
                <div className="calendar-day header">Thu</div>
                <div className="calendar-day header">Fri</div>
                <div className="calendar-day header">Sat</div>
                <div className="calendar-day header">Sun</div>
                
                {[...Array(31)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`calendar-day ${i === 5 ? 'today' : ''} ${[10, 15, 22].includes(i) ? 'has-event' : ''}`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </ExposeWrapper>
          
          <ExposeWrapper label="Settings" className="settings-window">
            <div className="window-content settings">
              <div className="settings-group">
                <div className="setting">
                  <label className="setting-label">Dark Mode</label>
                  <div className="toggle active"></div>
                </div>
                <div className="setting">
                  <label className="setting-label">Notifications</label>
                  <div className="toggle active"></div>
                </div>
                <div className="setting">
                  <label className="setting-label">Auto-save</label>
                  <select className="setting-select">
                    <option>Off</option>
                    <option>1 minute</option>
                    <option selected>5 minutes</option>
                    <option>15 minutes</option>
                  </select>
                </div>
              </div>
              <div className="settings-group">
                <div className="setting">
                  <label className="setting-label">Language</label>
                  <select className="setting-select">
                    <option selected>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
              </div>
            </div>
          </ExposeWrapper>
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

export default App;