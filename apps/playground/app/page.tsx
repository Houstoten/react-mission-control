"use client";

import { ExposeProvider, ExposeTrigger, ExposeWrapper } from "react-expose";

export default function Home() {
  return (
    <ExposeProvider shortcut="Control+ArrowUp" blurAmount={10}>
      <ExposeTrigger />
      <div className="app">
        <header className="app-header">
          <h1>React Exposé Demo</h1>
          <p>Press Ctrl+↑ or hold ↑ for 1 second to activate Exposé view</p>
        </header>

        <div className="demo-grid">
          <ExposeWrapper label="Dashboard" className="demo-card">
            <div className="card-content dashboard">
              <h2>📊 Dashboard</h2>
              <div className="stats">
                <div className="stat">
                  <span className="stat-value">2,543</span>
                  <span className="stat-label">Active Users</span>
                </div>
                <div className="stat">
                  <span className="stat-value">$12,426</span>
                  <span className="stat-label">Revenue</span>
                </div>
                <div className="stat">
                  <span className="stat-value">89%</span>
                  <span className="stat-label">Satisfaction</span>
                </div>
              </div>
            </div>
          </ExposeWrapper>

          <ExposeWrapper label="Analytics" className="demo-card">
            <div className="card-content analytics">
              <h2>📈 Analytics</h2>
              <div className="chart-placeholder">
                <div className="chart-bar" style={{ height: "60%" }}></div>
                <div className="chart-bar" style={{ height: "80%" }}></div>
                <div className="chart-bar" style={{ height: "45%" }}></div>
                <div className="chart-bar" style={{ height: "90%" }}></div>
                <div className="chart-bar" style={{ height: "70%" }}></div>
              </div>
            </div>
          </ExposeWrapper>

          <ExposeWrapper label="Messages" className="demo-card">
            <div className="card-content messages">
              <h2>💬 Messages</h2>
              <div className="message-list">
                <div className="message">
                  <span className="message-author">Alice</span>
                  <span className="message-text">Hey, how's the project going?</span>
                </div>
                <div className="message">
                  <span className="message-author">Bob</span>
                  <span className="message-text">Meeting at 3pm today</span>
                </div>
                <div className="message">
                  <span className="message-author">Charlie</span>
                  <span className="message-text">Great work on the presentation!</span>
                </div>
              </div>
            </div>
          </ExposeWrapper>

          <ExposeWrapper label="Settings" className="demo-card">
            <div className="card-content settings">
              <h2>⚙️ Settings</h2>
              <div className="settings-list">
                <div className="setting-item">
                  <span>Dark Mode</span>
                  <input type="checkbox" />
                </div>
                <div className="setting-item">
                  <span>Notifications</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="setting-item">
                  <span>Auto-save</span>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </div>
          </ExposeWrapper>

          <ExposeWrapper label="Calendar" className="demo-card">
            <div className="card-content calendar">
              <h2>📅 Calendar</h2>
              <div className="calendar-grid">
                {[...Array(7)].map((_, i) => (
                  <div key={`day-${i + 1}`} className="calendar-day">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </ExposeWrapper>

          <ExposeWrapper label="Tasks" className="demo-card">
            <div className="card-content tasks">
              <h2>✅ Tasks</h2>
              <div className="task-list">
                <div className="task-item">
                  <input type="checkbox" />
                  <span>Complete documentation</span>
                </div>
                <div className="task-item">
                  <input type="checkbox" />
                  <span>Review pull requests</span>
                </div>
                <div className="task-item">
                  <input type="checkbox" defaultChecked />
                  <span>Update dependencies</span>
                </div>
              </div>
            </div>
          </ExposeWrapper>
        </div>
      </div>
    </ExposeProvider>
  );
}
