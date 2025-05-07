import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExposeProvider } from './ExposeContext';
import { ExposeWrapper } from './components/ExposeWrapper';
import { ExposeTrigger } from './components/ExposeTrigger';
import './components/Expose.css';
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
          
          <ExposeWrapper label="Media Library" className="media-window">
            <div className="window-content media">
              <div className="media-toolbar">
                <button className="media-button">Upload</button>
                <button className="media-button">Create Album</button>
                <div className="media-search">
                  <input type="text" placeholder="Search media..." />
                </div>
              </div>
              <div className="media-grid">
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i} 
                    className="media-item"
                    style={{ 
                      backgroundColor: `hsl(${i * 30}, 70%, 80%)`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </ExposeWrapper>
          
          <ExposeWrapper label="Chat Support" className="chat-window">
            <div className="window-content chat">
              <div className="chat-messages">
                <div className="message support">
                  <div className="message-avatar"></div>
                  <div className="message-bubble">Hello! How can I help you today?</div>
                </div>
                <div className="message user">
                  <div className="message-bubble">I'm having trouble with my account settings.</div>
                </div>
                <div className="message support">
                  <div className="message-avatar"></div>
                  <div className="message-bubble">I'd be happy to help with that. Could you tell me what specific issue you're experiencing?</div>
                </div>
              </div>
              <div className="chat-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
              </div>
            </div>
          </ExposeWrapper>
          
          <ExposeWrapper label="Project Timeline" className="timeline-window">
            <div className="window-content timeline">
              <div className="timeline-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '65%' }}></div>
                </div>
                <div className="progress-label">65% Complete</div>
              </div>
              <div className="timeline-events">
                <div className="event completed">
                  <div className="event-marker"></div>
                  <div className="event-details">
                    <div className="event-title">Planning Phase</div>
                    <div className="event-date">April 15, 2025</div>
                  </div>
                </div>
                <div className="event completed">
                  <div className="event-marker"></div>
                  <div className="event-details">
                    <div className="event-title">Design Phase</div>
                    <div className="event-date">April 28, 2025</div>
                  </div>
                </div>
                <div className="event current">
                  <div className="event-marker"></div>
                  <div className="event-details">
                    <div className="event-title">Development Phase</div>
                    <div className="event-date">May 10, 2025</div>
                  </div>
                </div>
                <div className="event">
                  <div className="event-marker"></div>
                  <div className="event-details">
                    <div className="event-title">Testing Phase</div>
                    <div className="event-date">May 25, 2025</div>
                  </div>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          <ExposeWrapper label="Weather Dashboard" className="weather-window">
            <div className="window-content weather">
              <div className="current-weather">
                <div className="weather-location">San Francisco, CA</div>
                <div className="weather-main">
                  <div className="weather-icon">☀️</div>
                  <div className="weather-temp">72°F</div>
                </div>
                <div className="weather-desc">Sunny</div>
                <div className="weather-details">
                  <div className="detail">
                    <span className="detail-label">Humidity:</span> 65%
                  </div>
                  <div className="detail">
                    <span className="detail-label">Wind:</span> 8 mph NW
                  </div>
                  <div className="detail">
                    <span className="detail-label">Pressure:</span> 1014 hPa
                  </div>
                </div>
              </div>
              <div className="forecast">
                <div className="forecast-day">
                  <div>Tue</div>
                  <div>🌤️</div>
                  <div>75°</div>
                </div>
                <div className="forecast-day">
                  <div>Wed</div>
                  <div>⛅</div>
                  <div>72°</div>
                </div>
                <div className="forecast-day">
                  <div>Thu</div>
                  <div>🌧️</div>
                  <div>68°</div>
                </div>
                <div className="forecast-day">
                  <div>Fri</div>
                  <div>⛅</div>
                  <div>70°</div>
                </div>
                <div className="forecast-day">
                  <div>Sat</div>
                  <div>☀️</div>
                  <div>76°</div>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          <div className="window-content notifications">
            <div className="notification-list">
              <div className="notification unread">
                <div className="notification-icon">🔔</div>
                <div className="notification-content">
                  <div className="notification-title">New message from Sarah</div>
                  <div className="notification-time">2 minutes ago</div>
                </div>
              </div>
              <div className="notification unread">
                <div className="notification-icon">📅</div>
                <div className="notification-content">
                  <div className="notification-title">Meeting in 15 minutes</div>
                  <div className="notification-time">10 minutes ago</div>
                </div>
              </div>
              <div className="notification">
                <div className="notification-icon">📊</div>
                <div className="notification-content">
                  <div className="notification-title">May analytics report is ready</div>
                  <div className="notification-time">1 hour ago</div>
                </div>
              </div>
            </div>
          </div>
          
          <ExposeWrapper label="Task Manager" className="tasks-window">
            <div className="window-content tasks">
              <div className="task-filters">
                <button className="filter-button active">All</button>
                <button className="filter-button">Today</button>
                <button className="filter-button">Upcoming</button>
                <button className="filter-button">Completed</button>
              </div>
              <div className="task-list">
                <div className="task completed">
                  <input type="checkbox" checked />
                  <div className="task-content">
                    <div className="task-title">Review project proposal</div>
                    <div className="task-meta">Yesterday</div>
                  </div>
                </div>
                <div className="task">
                  <input type="checkbox" />
                  <div className="task-content">
                    <div className="task-title">Team standup meeting</div>
                    <div className="task-meta">Today, 10:00 AM</div>
                  </div>
                </div>
                <div className="task">
                  <input type="checkbox" />
                  <div className="task-content">
                    <div className="task-title">Complete quarterly report</div>
                    <div className="task-meta">Today, 4:00 PM</div>
                  </div>
                </div>
                <div className="task">
                  <input type="checkbox" />
                  <div className="task-content">
                    <div className="task-title">Client presentation preparation</div>
                    <div className="task-meta">Tomorrow, 2:00 PM</div>
                  </div>
                </div>
              </div>
              <div className="task-add">
                <input type="text" placeholder="Add new task..." />
                <button>+</button>
              </div>
            </div>
          </ExposeWrapper>
          
          <div className="window-content music-player">
            <div className="now-playing">
              <div className="album-art"></div>
              <div className="track-info">
                <div className="track-title">Midnight City</div>
                <div className="track-artist">M83</div>
              </div>
            </div>
            <div className="player-controls">
              <div className="progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '35%' }}></div>
                </div>
                <div className="time-labels">
                  <span>1:24</span>
                  <span>4:03</span>
                </div>
              </div>
              <div className="control-buttons">
                <button className="control-button">⏮️</button>
                <button className="control-button">⏹️</button>
                <button className="control-button">▶️</button>
                <button className="control-button">⏭️</button>
              </div>
            </div>
          </div>
          
          <ExposeWrapper label="Stock Market" className="stocks-window">
            <div className="window-content stocks">
              <div className="market-summary">
                <div className="index">
                  <div className="index-name">DOW</div>
                  <div className="index-value">36,452.65</div>
                  <div className="index-change positive">+1.2%</div>
                </div>
                <div className="index">
                  <div className="index-name">NASDAQ</div>
                  <div className="index-value">14,765.23</div>
                  <div className="index-change positive">+0.8%</div>
                </div>
                <div className="index">
                  <div className="index-name">S&P 500</div>
                  <div className="index-value">4,536.12</div>
                  <div className="index-change negative">-0.3%</div>
                </div>
              </div>
              <div className="stock-list">
                <div className="stock">
                  <div className="stock-symbol">AAPL</div>
                  <div className="stock-price">176.28</div>
                  <div className="stock-change positive">+2.4%</div>
                </div>
                <div className="stock">
                  <div className="stock-symbol">MSFT</div>
                  <div className="stock-price">305.17</div>
                  <div className="stock-change positive">+1.1%</div>
                </div>
                <div className="stock">
                  <div className="stock-symbol">GOOGL</div>
                  <div className="stock-price">2,832.45</div>
                  <div className="stock-change positive">+0.9%</div>
                </div>
                <div className="stock">
                  <div className="stock-symbol">AMZN</div>
                  <div className="stock-price">3,456.78</div>
                  <div className="stock-change negative">-0.6%</div>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          <div className="window-content calculator">
            <div className="calculator-display">537</div>
            <div className="calculator-buttons">
              <button className="calc-button function">AC</button>
              <button className="calc-button function">+/-</button>
              <button className="calc-button function">%</button>
              <button className="calc-button operator">÷</button>
              
              <button className="calc-button">7</button>
              <button className="calc-button">8</button>
              <button className="calc-button">9</button>
              <button className="calc-button operator">×</button>
              
              <button className="calc-button">4</button>
              <button className="calc-button">5</button>
              <button className="calc-button">6</button>
              <button className="calc-button operator">-</button>
              
              <button className="calc-button">1</button>
              <button className="calc-button">2</button>
              <button className="calc-button">3</button>
              <button className="calc-button operator">+</button>
              
              <button className="calc-button zero">0</button>
              <button className="calc-button">.</button>
              <button className="calc-button operator">=</button>
            </div>
          </div>
          
          <ExposeWrapper label="Email Inbox" className="email-window">
            <div className="window-content email">
              <div className="email-toolbar">
                <button className="email-button">New</button>
                <button className="email-button">Reply</button>
                <button className="email-button">Forward</button>
                <button className="email-button">Delete</button>
                <div className="email-search">
                  <input type="text" placeholder="Search emails..." />
                </div>
              </div>
              <div className="email-list">
                <div className="email-item unread">
                  <div className="email-sender">Project Team</div>
                  <div className="email-subject">Weekly Status Update</div>
                  <div className="email-date">9:15 AM</div>
                </div>
                <div className="email-item unread">
                  <div className="email-sender">Sarah Johnson</div>
                  <div className="email-subject">Question about the new design</div>
                  <div className="email-date">Yesterday</div>
                </div>
                <div className="email-item">
                  <div className="email-sender">Robert Davis</div>
                  <div className="email-subject">Upcoming team building event</div>
                  <div className="email-date">May 5</div>
                </div>
                <div className="email-item">
                  <div className="email-sender">AWS Billing</div>
                  <div className="email-subject">Your AWS invoice is available</div>
                  <div className="email-date">May 2</div>
                </div>
                <div className="email-item">
                  <div className="email-sender">LinkedIn</div>
                  <div className="email-subject">5 new connections for you</div>
                  <div className="email-date">May 1</div>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          <ExposeWrapper label="Notes" className="notes-window">
            <div className="window-content notes">
              <div className="notes-sidebar">
                <div className="note-item active">
                  <div className="note-title">Meeting Notes</div>
                  <div className="note-date">May 7</div>
                </div>
                <div className="note-item">
                  <div className="note-title">Project Ideas</div>
                  <div className="note-date">May 5</div>
                </div>
                <div className="note-item">
                  <div className="note-title">Shopping List</div>
                  <div className="note-date">May 3</div>
                </div>
                <div className="note-item">
                  <div className="note-title">Book Recommendations</div>
                  <div className="note-date">Apr 28</div>
                </div>
              </div>
              <div className="note-content">
                <div className="note-editor">
                  <input type="text" className="note-title-input" defaultValue="Meeting Notes" />
                  <textarea 
                    className="note-body-input"
                    defaultValue="# Team Meeting - May 7

- Discussed Q2 goals
- New feature prioritization
- Team roles and responsibilities
- Next steps for product launch

Action items:
1. Sarah: Update roadmap
2. Michael: Create design mockups
3. John: Review technical requirements"
                  ></textarea>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          <div className="window-content contacts">
            <div className="contacts-search">
              <input type="text" placeholder="Search contacts..." />
            </div>
            <div className="contacts-list">
              <div className="contact">
                <div className="contact-avatar"></div>
                <div className="contact-info">
                  <div className="contact-name">Alice Chen</div>
                  <div className="contact-details">alice.chen@example.com</div>
                  <div className="contact-details">Engineering Lead</div>
                </div>
              </div>
              <div className="contact">
                <div className="contact-avatar"></div>
                <div className="contact-info">
                  <div className="contact-name">Bob Taylor</div>
                  <div className="contact-details">bob.taylor@example.com</div>
                  <div className="contact-details">Product Manager</div>
                </div>
              </div>
              <div className="contact">
                <div className="contact-avatar"></div>
                <div className="contact-info">
                  <div className="contact-name">Carol White</div>
                  <div className="contact-details">carol.white@example.com</div>
                  <div className="contact-details">UX Designer</div>
                </div>
              </div>
              <div className="contact">
                <div className="contact-avatar"></div>
                <div className="contact-info">
                  <div className="contact-name">David Lee</div>
                  <div className="contact-details">david.lee@example.com</div>
                  <div className="contact-details">Marketing Director</div>
                </div>
              </div>
            </div>
          </div>
          
          <ExposeWrapper label="Code Editor" className="code-editor-window">
            <div className="window-content code-editor">
              <div className="code-toolbar">
                <select className="language-select">
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="c++">C++</option>
                </select>
                <button className="code-button">Run</button>
                <button className="code-button">Save</button>
              </div>
              <div className="code-container">
                <pre className="code-block">
{`// Example JavaScript function
function calculateTotal(items) {
  return items
    .filter(item => item.active)
    .map(item => item.price * item.quantity)
    .reduce((sum, price) => sum + price, 0);
}

// Test data
const cart = [
  { id: 1, name: 'Product 1', price: 10, quantity: 2, active: true },
  { id: 2, name: 'Product 2', price: 15, quantity: 1, active: false },
  { id: 3, name: 'Product 3', price: 25, quantity: 3, active: true }
];

// Calculate and display total
const total = calculateTotal(cart);
console.log(\`Total: \$\${total.toFixed(2)}\`);`}
                </pre>
              </div>
            </div>
          </ExposeWrapper>
          
          <div className="window-content file-explorer">
            <div className="explorer-path">
              <button className="path-button">Home</button>
              <span>/</span>
              <button className="path-button">Documents</button>
              <span>/</span>
              <button className="path-button">Projects</button>
            </div>
            <div className="files-grid">
              <div className="file">
                <div className="file-icon">📁</div>
                <div className="file-name">Images</div>
              </div>
              <div className="file">
                <div className="file-icon">📁</div>
                <div className="file-name">Documents</div>
              </div>
              <div className="file">
                <div className="file-icon">📄</div>
                <div className="file-name">project_plan.docx</div>
              </div>
              <div className="file">
                <div className="file-icon">📄</div>
                <div className="file-name">budget.xlsx</div>
              </div>
              <div className="file">
                <div className="file-icon">📄</div>
                <div className="file-name">presentation.pptx</div>
              </div>
              <div className="file">
                <div className="file-icon">📄</div>
                <div className="file-name">notes.txt</div>
              </div>
            </div>
          </div>
          
          <ExposeWrapper label="Video Conference" className="video-window">
            <div className="window-content video-conference">
              <div className="video-grid">
                <div className="video-participant main">
                  <div className="participant-video"></div>
                  <div className="participant-name">You</div>
                </div>
                <div className="video-participants">
                  <div className="video-participant">
                    <div className="participant-video"></div>
                    <div className="participant-name">John Smith</div>
                  </div>
                  <div className="video-participant">
                    <div className="participant-video"></div>
                    <div className="participant-name">Sarah Johnson</div>
                  </div>
                  <div className="video-participant">
                    <div className="participant-video"></div>
                    <div className="participant-name">Robert Davis</div>
                  </div>
                </div>
              </div>
              <div className="video-controls">
                <button className="video-control-button">🎤</button>
                <button className="video-control-button">📷</button>
                <button className="video-control-button">📊</button>
                <button className="video-control-button">💬</button>
                <button className="video-control-button leave">Leave</button>
              </div>
            </div>
          </ExposeWrapper>
          
          <div className="window-content help-center">
            <div className="help-search">
              <input type="text" placeholder="Search for help..." />
              <button>Search</button>
            </div>
            <div className="help-categories">
              <div className="help-category">
                <div className="category-icon">📚</div>
                <div className="category-title">Documentation</div>
              </div>
              <div className="help-category">
                <div className="category-icon">🎬</div>
                <div className="category-title">Tutorials</div>
              </div>
              <div className="help-category">
                <div className="category-icon">❓</div>
                <div className="category-title">FAQs</div>
              </div>
              <div className="help-category">
                <div className="category-icon">🛠️</div>
                <div className="category-title">Troubleshooting</div>
              </div>
            </div>
            <div className="popular-articles">
              <h3>Popular Articles</h3>
              <ul className="article-list">
                <li><a href="#">Getting Started Guide</a></li>
                <li><a href="#">How to Reset Your Password</a></li>
                <li><a href="#">Managing User Permissions</a></li>
                <li><a href="#">Importing and Exporting Data</a></li>
              </ul>
            </div>
          </div>
          
          <ExposeWrapper label="Network Monitor" className="network-window">
            <div className="window-content network">
              <div className="network-stats">
                <div className="stat-card">
                  <div className="stat-title">Uptime</div>
                  <div className="stat-value">99.98%</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Latency</div>
                  <div className="stat-value">24ms</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Bandwidth</div>
                  <div className="stat-value">8.2MB/s</div>
                </div>
                <div className="stat-card">
                  <div className="stat-title">Connections</div>
                  <div className="stat-value">1,245</div>
                </div>
              </div>
              <div className="network-graph">
                <div className="graph-title">Traffic (Last 24 Hours)</div>
                <div className="graph-container">
                  <div className="graph-line" style={{
                    backgroundImage: `linear-gradient(transparent, transparent 50%, #e9ecef 50%, #e9ecef),
                                      linear-gradient(90deg, transparent 50%, transparent 50%),
                                      linear-gradient(#4dabf7, ${[65, 45, 75, 60, 80, 50, 70].map((h, i) => 
                                        `#4dabf7 ${h}%, transparent ${h}% ${100 - i * 14}%`).join(', ')})`
                  }}></div>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          <div className="window-content terminal">
            <div className="terminal-screen">
              <div className="terminal-line">
                <span className="prompt">user@machine:~$</span>
                <span className="command"> ls -la</span>
              </div>
              <div className="terminal-output">
                drwxr-xr-x  5 user  staff  160 May  7 09:34 .<br/>
                drwxr-xr-x  3 user  staff   96 May  7 09:30 ..<br/>
                -rw-r--r--  1 user  staff  138 May  7 09:32 .gitignore<br/>
                -rw-r--r--  1 user  staff  645 May  7 09:33 README.md<br/>
                drwxr-xr-x 12 user  staff  384 May  7 09:34 src<br/>
              </div>
              <div className="terminal-line">
                <span className="prompt">user@machine:~$</span>
                <span className="command"> npm run build</span>
              </div>
              <div className="terminal-output">
                > project@1.0.0 build<br/>
                > webpack --mode production<br/>
                <br/>
                asset main.js 45.5 KiB [emitted] [minimized] (name: main)<br/>
                runtime modules 937 bytes 4 modules<br/>
                cacheable modules 28.8 KiB<br/>
                  ./src/index.js + 3 modules 28.8 KiB [built] [code generated]<br/>
                webpack 5.72.1 compiled successfully in 1243 ms
              </div>
              <div className="terminal-line">
                <span className="prompt">user@machine:~$</span>
                <span className="cursor"></span>
              </div>
            </div>
          </div>
          
          <ExposeWrapper label="E-Commerce" className="shop-window">
            <div className="window-content shop">
              <div className="shop-categories">
                <button className="category-button active">All</button>
                <button className="category-button">Electronics</button>
                <button className="category-button">Clothing</button>
                <button className="category-button">Home</button>
              </div>
              <div className="product-grid">
                <div className="product">
                  <div className="product-image"></div>
                  <div className="product-details">
                    <div className="product-title">Wireless Headphones</div>
                    <div className="product-price">$89.99</div>
                    <div className="product-rating">★★★★☆</div>
                  </div>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
                <div className="product">
                  <div className="product-image"></div>
                  <div className="product-details">
                    <div className="product-title">Smart Watch</div>
                    <div className="product-price">$199.99</div>
                    <div className="product-rating">★★★★★</div>
                  </div>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
                <div className="product">
                  <div className="product-image"></div>
                  <div className="product-details">
                    <div className="product-title">Bluetooth Speaker</div>
                    <div className="product-price">$59.99</div>
                    <div className="product-rating">★★★☆☆</div>
                  </div>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          <div className="window-content translation">
            <div className="translation-container">
              <div className="translation-side">
                <div className="language-selector">
                  <select>
                    <option value="en" selected>English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
                <textarea className="translation-input" defaultValue="Hello, how are you today? I'm learning about language translation and internationalization in web applications. It's fascinating to see how technology bridges communication gaps between different cultures."></textarea>
              </div>
              <div className="translation-side">
                <div className="language-selector">
                  <select>
                    <option value="en">English</option>
                    <option value="es" selected>Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
                <div className="translation-output">
                  Hola, ¿cómo estás hoy? Estoy aprendiendo sobre traducción de idiomas e internacionalización en aplicaciones web. Es fascinante ver cómo la tecnología cierra las brechas de comunicación entre diferentes culturas.
                </div>
              </div>
            </div>
          </div>
          
          <ExposeWrapper label="Database Admin" className="database-window">
            <div className="window-content database">
              <div className="database-toolbar">
                <button className="db-button">New Query</button>
                <button className="db-button">Export</button>
                <button className="db-button">Backup</button>
                <div className="db-search">
                  <input type="text" placeholder="Search tables..." />
                </div>
              </div>
              <div className="database-view">
                <div className="schema-sidebar">
                  <div className="schema-item expanded">
                    <div className="schema-header">Tables</div>
                    <div className="schema-children">
                      <div className="schema-item active">users</div>
                      <div className="schema-item">products</div>
                      <div className="schema-item">orders</div>
                      <div className="schema-item">categories</div>
                    </div>
                  </div>
                  <div className="schema-item">
                    <div className="schema-header">Views</div>
                  </div>
                  <div className="schema-item">
                    <div className="schema-header">Functions</div>
                  </div>
                </div>
                <div className="query-area">
                  <div className="query-editor">SELECT * FROM users LIMIT 10;</div>
                  <div className="query-results">
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>id</th>
                          <th>name</th>
                          <th>email</th>
                          <th>created_at</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>John Smith</td>
                          <td>john@example.com</td>
                          <td>2025-03-15</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Sarah Johnson</td>
                          <td>sarah@example.com</td>
                          <td>2025-03-18</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Michael Brown</td>
                          <td>michael@example.com</td>
                          <td>2025-04-02</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          <div className="window-content pdf-viewer">
            <div className="pdf-toolbar">
              <button className="pdf-button">⬅️</button>
              <div className="pdf-page-info">Page 3 of 28</div>
              <button className="pdf-button">➡️</button>
              <select className="pdf-zoom">
                <option>50%</option>
                <option>75%</option>
                <option selected>100%</option>
                <option>125%</option>
                <option>150%</option>
              </select>
            </div>
            <div className="pdf-document">
              <div className="pdf-page">
                <div className="page-content">
                  <h1 className="pdf-title">Project Proposal</h1>
                  <h2 className="pdf-heading">Executive Summary</h2>
                  <div className="pdf-paragraph">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Mauris euismod, nisi vel efficitur convallis, nisl erat facilisis nunc, vel molestie libero nisi vel elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
                  </div>
                  <h2 className="pdf-heading">Project Scope</h2>
                  <div className="pdf-paragraph">
                    Curabitur consectetur mauris a nisi varius, at gravida nisi tincidunt. Sed vestibulum magna eu tellus commodo, vel malesuada justo hendrerit. Nullam malesuada tempor augue, eget volutpat nulla commodo at. Donec in lectus eget velit hendrerit maximus.
                  </div>
                  <div className="pdf-image"></div>
                </div>
              </div>
            </div>
          </div>
          
          <ExposeWrapper label="Social Feed" className="social-window">
            <div className="window-content social">
              <div className="post-composer">
                <div className="composer-avatar"></div>
                <div className="composer-input">
                  <input type="text" placeholder="What's on your mind?" />
                </div>
                <button className="post-button">Post</button>
              </div>
              <div className="social-posts">
                <div className="social-post">
                  <div className="post-header">
                    <div className="post-avatar"></div>
                    <div className="post-meta">
                      <div className="post-author">Sarah Johnson</div>
                      <div className="post-time">15 minutes ago</div>
                    </div>
                  </div>
                  <div className="post-content">
                    Just finished the new design for our upcoming product launch! Can't wait to share more details soon. 🎉 #design #productlaunch
                  </div>
                  <div className="post-image"></div>
                  <div className="post-actions">
                    <button className="post-action">👍 Like</button>
                    <button className="post-action">💬 Comment</button>
                    <button className="post-action">🔄 Share</button>
                  </div>
                  <div className="post-stats">
                    <div>42 likes</div>
                    <div>7 comments</div>
                  </div>
                </div>
                <div className="social-post">
                  <div className="post-header">
                    <div className="post-avatar"></div>
                    <div className="post-meta">
                      <div className="post-author">Michael Brown</div>
                      <div className="post-time">2 hours ago</div>
                    </div>
                  </div>
                  <div className="post-content">
                    Great team meeting today! We're making significant progress on our Q2 goals. Thanks everyone for your hard work and dedication!
                  </div>
                  <div className="post-actions">
                    <button className="post-action">👍 Like</button>
                    <button className="post-action">💬 Comment</button>
                    <button className="post-action">🔄 Share</button>
                  </div>
                  <div className="post-stats">
                    <div>18 likes</div>
                    <div>3 comments</div>
                  </div>
                </div>
              </div>
            </div>
          </ExposeWrapper>
          
          <ExposeWrapper label="AI Assistant" className="ai-window">
            <div className="window-content ai-assistant">
              <div className="ai-conversation">
                <div className="ai-message">
                  <div className="ai-avatar"></div>
                  <div className="message-bubble">Hello! I'm your AI assistant. How can I help you today?</div>
                </div>
                <div className="user-message">
                  <div className="message-bubble">Can you help me analyze this dataset?</div>
                </div>
                <div className="ai-message">
                  <div className="ai-avatar"></div>
                  <div className="message-bubble">Of course! Please upload your dataset or provide me with some details about what you're looking to analyze, and I'll help you get started.</div>
                </div>
                <div className="user-message">
                  <div className="message-bubble">I have a CSV file with customer purchase history. I'd like to identify buying patterns.</div>
                </div>
                <div className="ai-message">
                  <div className="ai-avatar"></div>
                  <div className="message-bubble">Great! For customer purchase pattern analysis, I recommend looking at:
                  1. Frequency of purchases
                  2. Average order value
                  3. Category preferences
                  4. Seasonal patterns
                  
                  Would you like me to help you set up visualizations for these metrics once you upload the CSV?</div>
                </div>
              </div>
              <div className="ai-input">
                <input type="text" placeholder="Type your message..." />
                <button>Send</button>
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

// Export components for library use
export { ExposeProvider } from './ExposeContext';
export { ExposeWrapper } from './components/ExposeWrapper';
export { useExpose } from './ExposeContext';