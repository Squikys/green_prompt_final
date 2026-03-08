"use client"

import { useState, useEffect } from "react"
import {
  Leaf,
  Zap,
  BarChart3,
  Chrome,
  Brain,
  Shield,
  ArrowRight,
  Copy,
  Download,
  Github,
  Linkedin,
  Menu,
  X,
  Building2,
  Code,
  Trophy,
  Users,
  Sparkles,
  Target,
  Award,
  TrendingUp,
  Play,
  ChevronDown,
} from "lucide-react"

function App() {
  const [typedText, setTypedText] = useState("")
  const [demoPrompt, setDemoPrompt] = useState("")
  const [optimizedPrompt, setOptimizedPrompt] = useState("")
  const [carbonSaved, setCarbonSaved] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [tokenReduction, setTokenReduction] = useState(0)
  const [useAiMode, setUseAiMode] = useState(false)

  const fullText =
    "Can you please help me write a very detailed and comprehensive analysis of the environmental impact of artificial intelligence systems, including all possible factors, considerations, and implications?"
  const optimizedText =
    "Analyze AI's environmental impact: energy consumption, carbon footprint, and sustainability solutions."

  useEffect(() => {
    let i = 0
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          setTypedText(optimizedText)
        }, 1000)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [])

  const handleAnalyze = async () => {
    if (!demoPrompt.trim()) return;
    const inDevlopment = false;
    if (inDevlopment === true) {
      setDemoPrompt("Apologies for the inconvenience. We are currently unable to deploy our backend due to its complex and storage-intensive nature, which makes hosting costly. However, you can still experience the functionality by visiting the 'Try Live Demo' page, where you'll be redirected to a YouTube video showcasing the working demo.")
      setOptimizedPrompt("Apologies for the inconvenience. We are currently unable to deploy our backend due to its complex and storage-intensive nature, which makes hosting costly. However, you can still experience the functionality by visiting the 'Try Live Demo' page, where you'll be redirected to a YouTube video showcasing the working demo.")
      setCarbonSaved("N/A")
      setTokenReduction("N/A")
      return;
    }

    const endpoint = useAiMode ? '/optimize/ai' : '/optimize';
    setIsAnalyzing(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: demoPrompt,
          model_name: "gpt-4",
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data)
      setOptimizedPrompt(data.balanced)
      const co2SavedPercentage = (((data.co2emission_original - data.co2emission_balanced) / data.co2emission_original) * 100).toFixed(2) + '%';

      setCarbonSaved(co2SavedPercentage);

      const originalWordCount = demoPrompt.trim().split(/\s+/).length;
      const balancedWordCount = data.balanced.trim().split(/\s+/).length;
      const tokenSavedPercentage = (
        ((originalWordCount - balancedWordCount) / originalWordCount) * 100
      ).toFixed(2);
      setTokenReduction(tokenSavedPercentage);

    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const scrollToDemo = () => {
    document.getElementById("demo").scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen transition-all duration-500 dark">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 transition-all duration-500 bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "4s" }}
          ></div>

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-30 bg-gray-900/50"
            style={{
              backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }
            }
          ></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-xl z-50 border-b transition-all duration-500 bg-gray-900/80 border-gray-700/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-green-500/25">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent transition-all duration-300">
                PromptGreen
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#how-it-works"
                className="relative transition-all duration-300 hover:text-green-600 group text-gray-300"
              >
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#features"
                className="relative transition-all duration-300 hover:text-green-600 group text-gray-300"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a href="#demo" className="relative transition-all duration-300 hover:text-green-600 group text-gray-300">
                Demo
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a
                href="#enterprise"
                className="relative transition-all duration-300 hover:text-green-600 group text-gray-300"
              >
                Enterprise
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </a>

              <button className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-xl hover:shadow-green-500/25 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Download className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Download Extension</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg transition-all duration-300 text-white hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t transition-all duration-300 border-gray-700">
              <div className="flex flex-col space-y-4 pt-4">
                <a href="#how-it-works" className="transition-colors duration-300 hover:text-green-600 text-gray-300">
                  How It Works
                </a>
                <a href="#features" className="transition-colors duration-300 hover:text-green-600 text-gray-300">
                  Features
                </a>
                <a href="#demo" className="transition-colors duration-300 hover:text-green-600 text-gray-300">
                  Demo
                </a>
                <a href="#enterprise" className="transition-colors duration-300 hover:text-green-600 text-gray-300">
                  Enterprise
                </a>
                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 w-fit">
                  <Download className="w-4 h-4" />
                  <span>Download Extension</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modern Hero Section */}
      <section className="relative pt-32 pb-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-900/30 to-emerald-900/30 px-4 py-2 rounded-full border border-green-800 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-400">AI-Powered Sustainability</span>
                </div>

                {/* Main Heading */}
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-bold leading-tight transition-colors duration-300 text-white">
                    Write Smarter.
                    <br />
                    <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent animate-pulse">
                      Save Energy.
                    </span>
                    <br />
                    <span className="text-4xl md:text-5xl text-gray-300">Prompt Sustainably.</span>
                  </h1>
                </div>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl leading-relaxed max-w-2xl transition-colors duration-300 text-gray-300">
                  PromptGreen helps you reduce your AI carbon footprint by optimizing your prompts for
                  <span className="text-green-600 font-semibold"> maximum efficiency</span> and
                  <span className="text-emerald-600 font-semibold"> minimum environmental impact</span>.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-3 justify-center font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 transform overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Chrome className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Download Chrome Extension</span>
                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>

                  <button
                    onClick={scrollToDemo}
                    className="group relative border-2 border-green-600 text-green-600 px-8 py-4 rounded-2xl transition-all duration-300 flex items-center space-x-3 justify-center font-semibold hover:scale-105 hover:shadow-xl backdrop-blur-sm overflow-hidden hover:bg-green-600/10"
                  >
                    <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    <Play className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Try Live Demo</span>
                  </button>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">12K+</div>
                    <div className="text-sm text-gray-400">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">2.3M</div>
                    <div className="text-sm text-gray-400">Prompts Optimized</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">847kg</div>
                    <div className="text-sm text-gray-400">CO₂ Saved</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Interactive Demo */}
              <div className="relative">
                <div className="relative rounded-3xl shadow-2xl p-8 backdrop-blur-xl border transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] transform bg-gray-900/80 border-gray-700/50 shadow-black/20">
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full animate-bounce opacity-80"></div>
                  <div
                    className="absolute -bottom-4 -left-4 w-6 h-6 bg-emerald-500 rounded-full animate-bounce opacity-60"
                    style={{ animationDelay: "1s" }}
                  ></div>

                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium ml-4 text-gray-400">PromptGreen Optimizer</span>
                    </div>
                    <div className="space-y-4">
                      <div className="text-sm font-medium text-gray-400">Original Prompt:</div>
                      <div className="border-2 rounded-xl p-4 transition-all duration-300 bg-red-900/20 border-red-800/50">
                        <p className="font-mono text-sm leading-relaxed transition-colors duration-300 text-gray-200">
                          {typedText}
                        </p>
                        <span className="animate-pulse text-green-600 font-bold">|</span>
                      </div>
                      {typedText === optimizedText && (
                        <div className="animate-fade-in space-y-4">
                          <div className="text-sm font-medium text-gray-400">Optimized Prompt:</div>
                          <div className="border-2 rounded-xl p-4 transition-all duration-300 bg-green-900/20 border-green-800/50">
                            <p className="font-mono text-sm leading-relaxed transition-colors duration-300 text-gray-200">
                              {optimizedText}
                            </p>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                            <div className="flex items-center space-x-2">
                              <Leaf className="w-5 h-5 text-green-600" />
                              <span className="text-green-600 font-semibold">0.8g CO₂ saved • 65% reduction</span>
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <div
                                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                                style={{ animationDelay: "0.4s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -right-8 top-1/4 hidden lg:block">
                  <div
                    className="p-4 rounded-xl shadow-lg backdrop-blur-sm border animate-float bg-gray-800/80 border-gray-700"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium text-white">Real-time</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -left-8 bottom-1/4 hidden lg:block">
                  <div
                    className="p-4 rounded-xl shadow-lg backdrop-blur-sm border animate-float bg-gray-800/80 border-gray-700"
                    style={{ animationDelay: "2s" }}
                  >
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-white">Private</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section id="how-it-works" className="py-20 relative transition-colors duration-300 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 px-4 py-2 rounded-full border border-blue-800 backdrop-blur-sm mb-6">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-400">Simple Process</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 text-white">
              How It{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto transition-colors duration-300 text-gray-300">
              Transform your AI prompts in three simple steps and start saving energy immediately
            </p>
          </div>
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 relative">
              {/* Connection Lines */}
              <div className="hidden lg:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transform -translate-y-1/2 opacity-30"></div>
              <div className="hidden lg:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 transform -translate-y-1/2 opacity-30"></div>

              {/* Step 1 */}
              <div className="group relative">
                <div className="relative p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl transform cursor-pointer backdrop-blur-sm border-2 bg-gray-800/80 hover:bg-gray-750/80 border-gray-700/50 hover:border-green-500/50">
                  {/* Floating Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    1
                  </div>
                  {/* Icon */}
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-green-500/25">
                      <Copy className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl mx-auto blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-3xl font-bold mb-6 transition-colors duration-300 text-white">
                    Paste Your Prompt
                  </h3>
                  <p className="text-lg leading-relaxed transition-colors duration-300 text-gray-300">
                    Simply copy and paste your AI prompt into our intelligent analyzer. Works with any text length and
                    supports all major AI platforms.
                  </p>

                  <div className="mt-6 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
                    <Sparkles className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-green-400">Instant analysis ready</span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative">
                <div className="relative p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl transform cursor-pointer backdrop-blur-sm border-2 bg-gray-800/80 hover:bg-gray-750/80 border-gray-700/50 hover:border-blue-500/50">
                  {/* Floating Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    2
                  </div>
                  {/* Icon */}
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-blue-500/25">
                      <Brain className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl mx-auto blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-3xl font-bold mb-6 transition-colors duration-300 text-white">AI Analysis</h3>
                  <p className="text-lg leading-relaxed transition-colors duration-300 text-gray-300">
                    Our advanced AI engine detects redundancy, removes filler words, and optimizes structure while
                    preserving meaning and intent.
                  </p>

                  <div className="mt-6 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-blue-400">Smart optimization in progress</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative">
                <div className="relative p-8 rounded-3xl transition-all duration-500 hover:scale-105 hover:shadow-2xl transform cursor-pointer backdrop-blur-sm border-2 bg-gray-800/80 hover:bg-gray-750/80 border-gray-700/50 hover:border-emerald-500/50">
                  {/* Floating Number */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    3
                  </div>
                  {/* Icon */}
                  <div className="relative mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-emerald-500/25">
                      <Leaf className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-3xl mx-auto blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="text-3xl font-bold mb-6 transition-colors duration-300 text-white">Save Energy</h3>
                  <p className="text-lg leading-relaxed transition-colors duration-300 text-gray-300">
                    Get your optimized prompt with detailed CO₂ savings report and environmental impact metrics. Track
                    your contribution to sustainability.
                  </p>

                  <div className="mt-6 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-400">Impact tracking enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section id="demo" className="py-20 relative transition-colors duration-300 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-900/30 to-pink-900/30 px-4 py-2 rounded-full border border-purple-800 backdrop-blur-sm mb-6">
              <Play className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-400">Interactive Demo</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 text-white">
              Try It{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Live</span>
            </h2>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto transition-colors duration-300 text-gray-300">
              See how much CO₂ you can save with optimized prompts
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl backdrop-blur-xl border bg-gray-900/80 border-gray-700/50">
              <div className="mb-8">
                <label className="block text-lg font-semibold mb-4 transition-colors duration-300 text-gray-300">
                  Paste your prompt here:
                </label>
                <textarea
                  className="w-full h-40 p-6 border-2 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 resize-none transition-all duration-300 text-lg backdrop-blur-sm bg-gray-800/80 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Enter your AI prompt to see how much it can be optimized..."
                  value={demoPrompt}
                  onChange={(e) => setDemoPrompt(e.target.value)}
                />
              </div>
              {/* Engine toggle */}
              <div className="flex items-center justify-between mb-6 p-1 rounded-2xl border border-gray-700 bg-gray-800/60 backdrop-blur-sm">
                <button
                  onClick={() => setUseAiMode(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${!useAiMode
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25'
                      : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                  <Zap className="w-4 h-4" />
                  NLTK Engine
                </button>
                <button
                  onClick={() => setUseAiMode(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 ${useAiMode
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-400 hover:text-gray-200'
                    }`}
                >
                  <Brain className="w-4 h-4" />
                  AI Engine · Qwen2.5
                </button>
              </div>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAnalyze}
                  disabled={!demoPrompt.trim() || isAnalyzing}
                  className={`bg-gradient-to-r ${useAiMode
                      ? 'from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:shadow-purple-500/25'
                      : 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-green-500/25'
                    } text-white px-8 py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 hover:scale-105 hover:shadow-xl transform font-semibold text-lg`}
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      <span>Analyze & Optimize</span>
                    </>
                  )}
                </button>
              </div>
              {optimizedPrompt && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-lg mb-4 transition-colors duration-300 text-white">
                        Original Prompt
                      </h4>
                      <div className="border-2 rounded-2xl p-6 transition-colors duration-300 bg-red-900/20 border-red-800/50">
                        <p className="text-sm leading-relaxed transition-colors duration-300 text-gray-300">
                          {demoPrompt}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-4 transition-colors duration-300 text-white">
                        Optimized Prompt
                      </h4>
                      <div className="border-2 rounded-2xl p-6 transition-colors duration-300 bg-green-900/20 border-green-800/50">
                        <p className="text-sm leading-relaxed transition-colors duration-300 text-gray-300">
                          {optimizedPrompt}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-2 rounded-2xl p-6 transition-colors duration-300 bg-green-900/20 border-green-800/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg transition-colors duration-300 text-green-400">
                          Environmental Impact
                        </h4>
                        <p className="text-lg transition-colors duration-300 text-green-300">
                          CO₂ Saved: {carbonSaved} • Token Reduction: {tokenReduction}%
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(optimizedPrompt)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 hover:scale-105 hover:shadow-lg transform font-semibold"
                      >
                        <Copy className="w-5 h-5" />
                        <span>Copy Optimized</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 relative transition-colors duration-300 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 transition-colors duration-300 text-white">Features</h2>
            <p className="text-xl transition-colors duration-300 text-gray-300">
              Everything you need to optimize your AI usage
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Real-time Optimizer",
                desc: "Instantly optimize your prompts as you type",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: BarChart3,
                title: "Carbon Estimator",
                desc: "Track your CO₂ savings and environmental impact",
                color: "from-blue-400 to-indigo-500",
              },
              {
                icon: Leaf,
                title: "Energy Dashboard",
                desc: "Monitor usage patterns and sustainability metrics",
                color: "from-green-400 to-emerald-500",
              },
              {
                icon: Chrome,
                title: "Chrome Extension",
                desc: "Works seamlessly with ChatGPT, Claude, and more",
                color: "from-purple-400 to-pink-500",
              },
              {
                icon: Brain,
                title: "AI-Powered Engine",
                desc: "Advanced GPT-powered prompt rewriting",
                color: "from-cyan-400 to-blue-500",
              },
              {
                icon: Shield,
                title: "Privacy First",
                desc: "Your prompts are never stored or shared",
                color: "from-red-400 to-pink-500",
              },
            ].map((feature, index) => (
              <div key={index} className="group">
                <div className="p-6 rounded-xl shadow-lg border transition-all duration-500 hover:scale-105 hover:shadow-2xl transform cursor-pointer bg-gray-800 border-gray-700 hover:bg-gray-750">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 transition-colors duration-300 text-white">
                    {feature.title}
                  </h3>
                  <p className="transition-colors duration-300 text-gray-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section id="enterprise" className="py-20 relative transition-colors duration-300 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 transition-colors duration-300 text-white">Enterprise Solutions</h2>
            <p className="text-xl transition-colors duration-300 text-gray-300">
              Scale your AI sustainability efforts across your organization
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Enterprise API */}
            <div className="group">
              <div className="p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl transform cursor-pointer bg-gray-900 border border-gray-700">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center transition-colors duration-300 text-white">
                  Enterprise API
                </h3>
                <p className="text-center mb-6 transition-colors duration-300 text-gray-300">
                  SaaS model for AI-heavy companies to reduce compute costs and environmental impact at scale.
                </p>
                <ul className="space-y-2 mb-6 transition-colors duration-300 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Bulk prompt optimization</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Real-time cost monitoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Custom optimization rules</span>
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
                  Learn More
                </button>
              </div>
            </div>

            {/* Developer SDK */}
            <div className="group">
              <div className="p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl transform cursor-pointer bg-gray-900 border border-gray-700">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center transition-colors duration-300 text-white">
                  Developer SDK
                </h3>
                <p className="text-center mb-6 transition-colors duration-300 text-gray-300">
                  Integrate with AI products like Notion AI, Jasper, and other platforms seamlessly.
                </p>
                <ul className="space-y-2 mb-6 transition-colors duration-300 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Easy integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Multiple language support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Comprehensive documentation</span>
                  </li>
                </ul>
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
                  Get SDK
                </button>
              </div>
            </div>

            {/* Gamification */}
            <div className="group">
              <div className="p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl transform cursor-pointer bg-gray-900 border border-gray-700">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center transition-colors duration-300 text-white">
                  Sustainability Gamification
                </h3>
                <p className="text-center mb-6 transition-colors duration-300 text-gray-300">
                  Earn badges and compete with community stats for eco-conscious prompting.
                </p>
                <ul className="space-y-2 mb-6 transition-colors duration-300 text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Achievement badges</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Community leaderboards</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Impact tracking</span>
                  </li>
                </ul>
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 hover:shadow-lg transform">
                  Join Community
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gamification Stats */}
      <section className="py-20 relative transition-colors duration-300 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 transition-colors duration-300 text-white">Community Impact</h2>
            <p className="text-xl transition-colors duration-300 text-gray-300">Join thousands making a difference</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Users, value: "12,847", label: "Active Users", color: "text-blue-500" },
              { icon: Award, value: "2.3M", label: "Prompts Optimized", color: "text-green-500" },
              { icon: Leaf, value: "847kg", label: "CO₂ Saved", color: "text-emerald-500" },
              { icon: Trophy, value: "156", label: "Badges Earned", color: "text-yellow-500" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl transition-all duration-300 hover:scale-105 transform bg-gray-800"
              >
                <stat.icon className={`w-8 h-8 mx-auto mb-4 ${stat.color}`} />
                <div className="text-3xl font-bold mb-2 transition-colors duration-300 text-white">{stat.value}</div>
                <div className="transition-colors duration-300 text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 relative transition-colors duration-300 bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 transition-colors duration-300 text-white">Track Your Impact</h2>
            <p className="text-xl transition-colors duration-300 text-gray-300">
              See your environmental contribution in real-time
            </p>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl bg-gray-900 border border-gray-700">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="rounded-lg p-6 text-center transition-all duration-300 hover:scale-105 transform bg-green-900/20">
                  <div className="text-3xl font-bold text-green-600 mb-2">47.3g</div>
                  <div className="transition-colors duration-300 text-gray-300">CO₂ Saved This Month</div>
                </div>
                <div className="rounded-lg p-6 text-center transition-all duration-300 hover:scale-105 transform bg-blue-900/20">
                  <div className="text-3xl font-bold text-blue-600 mb-2">234</div>
                  <div className="transition-colors duration-300 text-gray-300">Prompts Optimized</div>
                </div>
                <div className="rounded-lg p-6 text-center transition-all duration-300 hover:scale-105 transform bg-purple-900/20">
                  <div className="text-3xl font-bold text-purple-600 mb-2">68%</div>
                  <div className="transition-colors duration-300 text-gray-300">Average Reduction</div>
                </div>
              </div>
              <div className="rounded-lg p-6 transition-colors duration-300 bg-gray-800">
                <h3 className="text-lg font-semibold mb-4 transition-colors duration-300 text-white">
                  Weekly Carbon Savings
                </h3>
                <div className="h-32 rounded-lg flex items-end justify-between p-4 transition-colors duration-300 bg-gray-900">
                  {[40, 60, 35, 80, 45, 70, 55].map((height, index) => (
                    <div
                      key={index}
                      className="bg-green-600 rounded-t w-8 transition-all duration-500 hover:bg-green-500 transform hover:scale-110"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extension CTA */}
      <section className="py-20 relative transition-colors duration-300 bg-gradient-to-r from-green-800 to-emerald-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Prompt Green?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already making a difference. Start optimizing your AI prompts today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 justify-center font-semibold hover:scale-105 hover:shadow-xl transform">
              <Chrome className="w-5 h-5" />
              <span>Download Chrome Extension</span>
            </button>
            <button className="border border-white text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2 justify-center hover:scale-105 hover:shadow-lg transform">
              <span>View Documentation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-green-100 mt-6 text-sm">Works with ChatGPT, Claude, Bard, and more AI platforms</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative transition-colors duration-300 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">PromptGreen</span>
              </div>
              <p className="text-gray-400">Making AI more sustainable, one prompt at a time.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">
                  Chrome Extension
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Dashboard
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  API
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  SDK
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <a href="#" className="block hover:text-white transition-colors">
                  About
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Documentation
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="block hover:text-white transition-colors">
                  Enterprise
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>Built with ❤️ at Hackathons by Team Full of Bugs</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
