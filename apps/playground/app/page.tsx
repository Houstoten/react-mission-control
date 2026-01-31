"use client"

import { ExposeProvider, ExposeWrapper } from "react-expose"
import { ThemeToggle } from "@/components/theme-toggle"
import { DemoButton } from "@/components/demo-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowUp, 
  Code2, 
  Sparkles, 
  Zap, 
  Palette, 
  Globe,
  Copy,
  Check
} from "lucide-react"
import { useState } from "react"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"

export default function Home() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const featuresRef = useScrollAnimation()
  const demoRef = useScrollAnimation()
  const installRef = useScrollAnimation()

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const installCode = `npm install react-expose
# or
yarn add react-expose
# or  
pnpm add react-expose`

  const usageCode = `import { ExposeProvider, ExposeWrapper } from 'react-expose'

function App() {
  return (
    <ExposeProvider shortcut="ArrowUp+ArrowUp">
      <ExposeWrapper label="Dashboard">
        <YourComponent />
      </ExposeWrapper>

      <ExposeWrapper label="Settings">
        <AnotherComponent />
      </ExposeWrapper>
    </ExposeProvider>
  )
}`

  return (
    <ExposeProvider shortcut="ArrowUp+ArrowUp" blurAmount={10}>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">React Exposé</span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="#features">Features</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#demo">Demo</a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="#installation">Get Started</a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/yourusername/react-expose" target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </Button>
            <ThemeToggle />
          </div>
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="container mx-auto px-4 z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Introducing React Exposé</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-foreground to-secondary animate-gradient">
              Beautiful macOS-like
              <br />UI Components
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto px-4">
              Transform your React applications with stunning Mission Control and Exposé-like experiences. 
              Seamless integration, beautiful animations, and complete customization.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 px-4">
              <Button size="lg" className="gap-2">
                <Code2 className="w-4 h-4" />
                Get Started
              </Button>
              <DemoButton />
            </div>
            
            {/* Live Demo Hint */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 text-muted-foreground">
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm">Press <kbd className="px-2 py-1 rounded bg-background text-xs">↑</kbd> twice quickly to activate Exposé</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative" ref={featuresRef.ref as any}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${featuresRef.isVisible ? 'animate-in' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold mb-4">Why React Exposé?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to create stunning UI experiences</p>
          </div>
          
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${featuresRef.isVisible ? 'animate-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <ExposeWrapper label="Lightning Fast">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Lightning Fast</CardTitle>
                  <CardDescription>
                    Optimized performance with smooth 60fps animations and minimal overhead
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Hardware-accelerated animations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Lazy loading support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Minimal bundle size</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ExposeWrapper>

            <ExposeWrapper label="Fully Customizable">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                    <Palette className="w-6 h-6 text-secondary" />
                  </div>
                  <CardTitle>Fully Customizable</CardTitle>
                  <CardDescription>
                    Complete control over appearance and behavior
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-secondary mt-0.5" />
                      <span>Custom keyboard shortcuts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-secondary mt-0.5" />
                      <span>Theme integration</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-secondary mt-0.5" />
                      <span>CSS-in-JS compatible</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ExposeWrapper>

            <ExposeWrapper label="Universal Support">
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>Universal Support</CardTitle>
                  <CardDescription>
                    Works everywhere your React app does
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Next.js & SSR ready</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>TypeScript support</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5" />
                      <span>Accessibility built-in</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </ExposeWrapper>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-muted/30 relative" ref={demoRef.ref as any}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${demoRef.isVisible ? 'animate-in' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-muted-foreground">Interactive components that tell your story</p>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto ${demoRef.isVisible ? 'animate-scale' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <ExposeWrapper label="Analytics Dashboard">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>Real-time metrics and insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                        <p className="text-2xl font-bold">12,543</p>
                      </div>
                      <div className="text-primary">+23%</div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold">$84,291</p>
                      </div>
                      <div className="text-secondary">+18%</div>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Chart Visualization</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ExposeWrapper>

            <ExposeWrapper label="Project Manager">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>Manage your team's workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Website Redesign", "Mobile App", "API Integration", "Documentation"].map((project, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-primary' : 'bg-secondary'}`} />
                          <span className="font-medium">{project}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {[85, 60, 95, 40][i]}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ExposeWrapper>

            <ExposeWrapper label="Message Center">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Recent Messages</CardTitle>
                  <CardDescription>Stay connected with your team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Sarah Chen", message: "Great work on the presentation!", time: "2m ago" },
                      { name: "Alex Rivera", message: "Can we sync on the API changes?", time: "15m ago" },
                      { name: "Jordan Lee", message: "Documentation is ready for review", time: "1h ago" }
                    ].map((msg, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{msg.name}</p>
                            <span className="text-xs text-muted-foreground">{msg.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ExposeWrapper>

            <ExposeWrapper label="Settings Panel">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>Customize your experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Notifications", enabled: true },
                      { label: "Dark Mode", enabled: false },
                      { label: "Auto-save", enabled: true },
                      { label: "Analytics", enabled: false }
                    ].map((setting, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{setting.label}</span>
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${
                          setting.enabled ? 'bg-primary' : 'bg-muted'
                        }`}>
                          <div className={`w-4 h-4 rounded-full bg-background transition-transform ${
                            setting.enabled ? 'translate-x-4' : ''
                          }`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ExposeWrapper>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section id="installation" className="py-20 relative" ref={installRef.ref as any}>
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 ${installRef.isVisible ? 'animate-in' : 'opacity-0'}`}>
            <h2 className="text-4xl font-bold mb-4">Get Started in Minutes</h2>
            <p className="text-xl text-muted-foreground">Simple installation, powerful results</p>
          </div>

          <div className={`max-w-4xl mx-auto ${installRef.isVisible ? 'animate-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <Tabs defaultValue="npm" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="npm">npm</TabsTrigger>
                <TabsTrigger value="yarn">yarn</TabsTrigger>
                <TabsTrigger value="pnpm">pnpm</TabsTrigger>
              </TabsList>
              <TabsContent value="npm">
                <Card>
                  <CardHeader>
                    <CardTitle>Install with npm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>npm install react-expose</code>
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard("npm install react-expose", "npm")}
                      >
                        {copiedCode === "npm" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="yarn">
                <Card>
                  <CardHeader>
                    <CardTitle>Install with yarn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>yarn add react-expose</code>
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard("yarn add react-expose", "yarn")}
                      >
                        {copiedCode === "yarn" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="pnpm">
                <Card>
                  <CardHeader>
                    <CardTitle>Install with pnpm</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>pnpm add react-expose</code>
                      </pre>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard("pnpm add react-expose", "pnpm")}
                      >
                        {copiedCode === "pnpm" ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Basic Usage</CardTitle>
                <CardDescription>Get up and running with just a few lines of code</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{usageCode}</code>
                  </pre>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(usageCode, "usage")}
                  >
                    {copiedCode === "usage" ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold">React Exposé</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 React Exposé. Built with ❤️ and React.
            </p>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/yourusername/react-expose" target="_blank" rel="noopener noreferrer">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </ExposeProvider>
  )
}