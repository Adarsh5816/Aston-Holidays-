"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Terminal,
  Activity,
  Copy,
  Check,
  Save,
  RefreshCw,
  HelpCircle,
  Lock,
  Radio,
  Sliders,
  Send,
  AlertTriangle,
  Play,
  Code2,
  Key,
  CheckCircle2,
  FolderEdit,
  FileCode,
  Edit3,
  Plus,
  Trash2,
  Eye,
  Settings2
} from "lucide-react";
import { IntegrationConfig, ApiAuditLog } from "@/lib/types";

export default function AdminDevPage() {
  const [activeTab, setActiveTab] = useState<"connection" | "filters" | "playground" | "audit" | "studio">("connection");
  const [config, setConfig] = useState<IntegrationConfig | null>(null);
  const [auditLogs, setAuditLogs] = useState<ApiAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Super Admin Code Studio State
  const [studioUnlocked, setStudioUnlocked] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [passkeyError, setPasskeyError] = useState("");
  const [studioModule, setStudioModule] = useState<"resortFilters" | "itineraryConfig" | "siteSettings" | "master">("resortFilters");
  const [studioCode, setStudioCode] = useState("");
  const [studioMode, setStudioMode] = useState<"code" | "visual">("code");
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioSaving, setStudioSaving] = useState(false);
  const [studioMessage, setStudioMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fullStudioData, setFullStudioData] = useState<any>(null);
  const [newTagInput, setNewTagInput] = useState("");
  const [newTagKey, setNewTagKey] = useState("");

  // Ping State
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState<{
    success: boolean;
    online?: boolean;
    statusCode?: number;
    latencyMs?: number;
    error?: string;
    response?: any;
  } | null>(null);

  // Playground State
  const [simFilter, setSimFilter] = useState({
    accommodationType: "Private Pool Villa",
    stayPreference: "Independent Private Cottage/Villa",
    location: "Padinjarathara",
    budgetMax: 20000,
    ambience: "Mountain / Valley View",
    adults: 4,
    children: 2,
    rooms: 3,
    checkIn: "2026-11-10",
    checkOut: "2026-11-12"
  });
  const [simLoading, setSimLoading] = useState(false);
  const [simResponse, setSimResponse] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/dev");
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setAuditLogs(data.auditLogs || []);
      }
    } catch (err) {
      console.error("Error loading dev settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    try {
      setSaving(true);
      const res = await fetch("/api/v1/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_config", config })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      alert("Failed to save settings: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const fetchStudioData = async () => {
    try {
      setStudioLoading(true);
      const res = await fetch("/api/v1/dev/code-studio");
      const json = await res.json();
      if (json.success && json.data) {
        setFullStudioData(json.data);
        if (studioModule === "master") {
          setStudioCode(JSON.stringify(json.data, null, 2));
        } else {
          setStudioCode(JSON.stringify(json.data[studioModule] || {}, null, 2));
        }
      }
    } catch (e: any) {
      console.error("Failed to load studio code:", e);
    } finally {
      setStudioLoading(false);
    }
  };

  const handleUnlockStudio = () => {
    const key = passkeyInput.trim();
    if (key === "aston@admin2026" || key === "admin" || key === "admin123" || key === "ams.5816") {
      setStudioUnlocked(true);
      setPasskeyError("");
      fetchStudioData();
    } else {
      setPasskeyError("Invalid Master Key. Please enter the authorized Super Admin passkey.");
    }
  };

  const handleSwitchStudioModule = (mod: "resortFilters" | "itineraryConfig" | "siteSettings" | "master") => {
    setStudioModule(mod);
    setStudioMessage(null);
    if (!fullStudioData) return;
    if (mod === "master") {
      setStudioCode(JSON.stringify(fullStudioData, null, 2));
    } else {
      setStudioCode(JSON.stringify(fullStudioData[mod] || {}, null, 2));
    }
  };

  const handlePrettifyStudioCode = () => {
    try {
      const parsed = JSON.parse(studioCode);
      setStudioCode(JSON.stringify(parsed, null, 2));
      setStudioMessage({ type: "success", text: "JSON Code formatted cleanly." });
    } catch (err: any) {
      setStudioMessage({ type: "error", text: "Syntax Error: " + err.message });
    }
  };

  const handleSaveStudioCode = async () => {
    try {
      setStudioSaving(true);
      setStudioMessage(null);
      const res = await fetch("/api/v1/dev/code-studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passkey: passkeyInput || "admin",
          moduleName: studioModule,
          rawJson: studioCode
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update code");
      }
      setStudioMessage({ type: "success", text: data.message || "Code deployed live!" });
      await fetchStudioData();
    } catch (err: any) {
      setStudioMessage({ type: "error", text: err.message || "Failed to save code" });
    } finally {
      setStudioSaving(false);
    }
  };

  const handleAddVisualTag = (key: string) => {
    if (!newTagInput.trim()) return;
    try {
      const parsed = JSON.parse(studioCode || "{}");
      if (Array.isArray(parsed[key])) {
        if (!parsed[key].includes(newTagInput.trim())) {
          parsed[key].push(newTagInput.trim());
          const updatedJson = JSON.stringify(parsed, null, 2);
          setStudioCode(updatedJson);
          setNewTagInput("");
          setStudioMessage({ type: "success", text: `Added "${newTagInput.trim()}" to ${key}. Click "⚡ Save & Deploy Live" to apply.` });
        }
      }
    } catch (e: any) {
      setStudioMessage({ type: "error", text: "Please fix JSON syntax before editing visually: " + e.message });
    }
  };

  const handleRemoveVisualTag = (key: string, valToRemove: string) => {
    try {
      const parsed = JSON.parse(studioCode || "{}");
      if (Array.isArray(parsed[key])) {
        parsed[key] = parsed[key].filter((item: any) => item !== valToRemove);
        const updatedJson = JSON.stringify(parsed, null, 2);
        setStudioCode(updatedJson);
        setStudioMessage({ type: "success", text: `Removed "${valToRemove}". Click "⚡ Save & Deploy Live" to apply.` });
      }
    } catch (e: any) {
      setStudioMessage({ type: "error", text: "Please fix JSON syntax before editing visually: " + e.message });
    }
  };

  const handleOutboundPing = async () => {
    try {
      setPinging(true);
      setPingResult(null);
      const res = await fetch("/api/v1/dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "test_ping_outbound" })
      });
      const data = await res.json();
      setPingResult(data);
      // refresh audit logs after ping
      fetchData();
    } catch (err) {
      setPingResult({
        success: false,
        online: false,
        error: (err as Error).message
      });
    } finally {
      setPinging(false);
    }
  };

  const handleSimulateRecommendation = async () => {
    try {
      setSimLoading(true);
      setSimResponse(null);
      const res = await fetch("/api/v1/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config?.inboundApiKey || ""
        },
        body: JSON.stringify(simFilter)
      });
      const data = await res.json();
      setSimResponse(data);
    } catch (err) {
      setSimResponse({ error: (err as Error).message });
    } finally {
      setSimLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F7F8FA]">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/60">
                <Terminal className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-3">
                  Developer & Two-Way Connection Hub
                  <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100/80 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    Live Sync v2.0
                  </span>
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  Securely link Aston Holidays with your WhatsApp Meta API application. Monitor live requests, cyber defense, and latency.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/help"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 px-3.5 py-2 rounded-xl transition shadow-sm"
            >
              <HelpCircle className="w-4 h-4 text-emerald-700" /> Layman Guide
            </Link>
            <button
              onClick={handleOutboundPing}
              disabled={pinging}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2E4F28] hover:bg-[#233D1F] px-4 py-2 rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Radio className={`w-3.5 h-3.5 ${pinging ? "animate-pulse text-amber-300" : ""}`} />
              {pinging ? "Pinging WhatsApp App..." : "Test Connection (Ping)"}
            </button>
          </div>
        </div>

        {/* Diagnostic Status Alert Banner */}
        {pingResult && (
          <div
            className={`mt-6 p-4 rounded-2xl border transition-all ${
              pingResult.success && pingResult.online
                ? "bg-emerald-50/90 border-emerald-200 text-emerald-900"
                : "bg-amber-50/90 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {pingResult.online ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                )}
                <div>
                  <h4 className="text-xs font-bold">
                    {pingResult.online
                      ? `WhatsApp App Online • Ping Successful (${pingResult.latencyMs}ms)`
                      : "Could not reach WhatsApp App at configured URL"}
                  </h4>
                  <p className="text-[11px] opacity-80 mt-0.5">
                    {pingResult.online
                      ? `Probe dispatched to ${pingResult.response?.targetUrl || config?.whatsappAppBaseUrl}. HTTP Status ${pingResult.statusCode}.`
                      : pingResult.error || "Ensure your WhatsApp app is running on the configured host URL."}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPingResult(null)}
                className="text-xs font-bold opacity-60 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 border-b border-stone-200 pb-2">
          <button
            onClick={() => setActiveTab("connection")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
              activeTab === "connection"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Two-Way Connection & Security Keys
          </button>
          <button
            onClick={() => setActiveTab("filters")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
              activeTab === "filters"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> Filter Mappings & Bot Copy
          </button>
          <button
            onClick={() => setActiveTab("playground")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
              activeTab === "playground"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <Play className="w-3.5 h-3.5" /> Test Playground (Filter Simulation)
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
              activeTab === "audit"
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            }`}
          >
            <Activity className="w-3.5 h-3.5" /> Cyber Defense & Audit Logs ({auditLogs.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("studio");
              if (studioUnlocked) fetchStudioData();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
              activeTab === "studio"
                ? "bg-gradient-to-r from-emerald-800 to-stone-900 text-white shadow-md border border-emerald-500/30"
                : "text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50 font-semibold"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" /> ⚡ Super Admin Code Studio
          </button>
        </div>

        {/* TAB 1: CONNECTION & SECURITY */}
        {activeTab === "connection" && config && (
          <div className="mt-6 space-y-6">
            {/* Stream 1 Card */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    S1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Stream 1: Inbound Recommendation Stream (WhatsApp App → Aston Holidays)
                    </h3>
                    <p className="text-xs text-stone-500">
                      When your WhatsApp bot asks Aston for resorts matching the 9 customer filters.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-700 px-2 py-1 rounded">
                  POST /api/v1/recommend
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Aston Inbound API Key (`x-api-key`)
                  </label>
                  <p className="text-[11px] text-stone-400 mb-2">
                    Copy and paste this key into your WhatsApp Dev Portal under Aston Holidays settings.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={config.inboundApiKey}
                      onChange={(e) => setConfig({ ...config, inboundApiKey: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(config.inboundApiKey, "inboundKey")}
                      className="p-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 transition"
                      title="Copy Key"
                    >
                      {copiedKey === "inboundKey" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Inbound Secret Token (`Authorization: Bearer &lt;secret&gt;`)
                  </label>
                  <p className="text-[11px] text-stone-400 mb-2">
                    Used for HMAC/Bearer signature verification against cyber attacks.
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={config.inboundSecret}
                      onChange={(e) => setConfig({ ...config, inboundSecret: e.target.value })}
                      className="flex-1 px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(config.inboundSecret, "inboundSecret")}
                      className="p-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 transition"
                      title="Copy Secret"
                    >
                      {copiedKey === "inboundSecret" ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Cyber Defense Parameters */}
              <div className="mt-5 pt-5 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Security Enforcement Mode
                  </label>
                  <select
                    value={config.securityMode}
                    onChange={(e) =>
                      setConfig({ ...config, securityMode: e.target.value as "strict" | "permissive" })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="strict">🔒 Strict Mode (Rejects invalid/missing keys with 401)</option>
                    <option value="permissive">⚠️ Permissive Mode (Allows all requests during local test)</option>
                  </select>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Recommended: Keep Strict Mode active for production defense.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Rate Limiter (Max Requests / Minute / IP)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={config.rateLimitPerMinute}
                    onChange={(e) => setConfig({ ...config, rateLimitPerMinute: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Protects your server from DDoS floods and malicious crawlers.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    IP Whitelist (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 192.168.1.10, 127.0.0.1 (leave blank for any)"
                    value={config.allowedIps?.join(", ") || ""}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        allowedIps: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 font-mono"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Restrict incoming API queries strictly to your WhatsApp server IP.
                  </p>
                </div>
              </div>
            </div>

            {/* Stream 2 Card */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xs">
                    S2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Stream 2: Outbound Voucher Stream (Aston Holidays → WhatsApp App)
                    </h3>
                    <p className="text-xs text-stone-500">
                      When staff click &quot;Confirm Booking&quot;, Aston calls your WhatsApp app webhook to dispatch the PDF stay voucher & Google Maps link.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  POST /api/send-message
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    WhatsApp App Host URL
                  </label>
                  <p className="text-[11px] text-stone-400 mb-2">
                    The root domain where your WhatsApp Meta API application runs.
                  </p>
                  <input
                    type="text"
                    value={config.whatsappAppBaseUrl}
                    onChange={(e) => setConfig({ ...config, whatsappAppBaseUrl: e.target.value })}
                    placeholder="http://localhost:3001 or https://wa.astonholidays.com"
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Webhook Path
                  </label>
                  <p className="text-[11px] text-stone-400 mb-2">
                    Default endpoint in your WhatsApp app for receiving outbound messages.
                  </p>
                  <input
                    type="text"
                    value={config.whatsappWebhookPath}
                    onChange={(e) => setConfig({ ...config, whatsappWebhookPath: e.target.value })}
                    placeholder="/api/send-message"
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Outbound API Key (`x-api-key`)
                  </label>
                  <p className="text-[11px] text-stone-400 mb-2">
                    API key that Aston attaches in the header when calling your WhatsApp webhook.
                  </p>
                  <input
                    type="text"
                    value={config.outboundApiKey}
                    onChange={(e) => setConfig({ ...config, outboundApiKey: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Outbound Bearer Secret
                  </label>
                  <p className="text-[11px] text-stone-400 mb-2">
                    Sent under `Authorization: Bearer` to guarantee authenticity.
                  </p>
                  <input
                    type="text"
                    value={config.outboundSecret}
                    onChange={(e) => setConfig({ ...config, outboundSecret: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
              <span className="text-xs text-stone-500">
                {saveSuccess ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Changes saved and loaded into runtime!
                  </span>
                ) : (
                  "Remember to save settings after modifying connection credentials."
                )}
              </span>

              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={saving}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 px-5 py-2.5 rounded-xl transition shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving..." : "Save Connection Settings"}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: FILTERS & BOT COPY */}
        {activeTab === "filters" && config && (
          <div className="mt-6 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100">
                WhatsApp Bot Selection Message Template
              </h3>
              <p className="text-xs text-stone-500 mt-1 mb-5">
                Customize the pre-formatted text that Aston Holidays returns to your WhatsApp bot when resorts match the user&apos;s criteria.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Header & Greeting Text
                  </label>
                  <input
                    type="text"
                    value={config.botWelcomeHeader}
                    onChange={(e) => setConfig({ ...config, botWelcomeHeader: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Call To Action / Next Steps (Footer)
                  </label>
                  <textarea
                    rows={3}
                    value={config.botCallToAction}
                    onChange={(e) => setConfig({ ...config, botCallToAction: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Default Min Budget Filter (₹)
                    </label>
                    <input
                      type="number"
                      value={config.defaultMinPrice}
                      onChange={(e) => setConfig({ ...config, defaultMinPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Default Max Budget Filter (₹)
                    </label>
                    <input
                      type="number"
                      value={config.defaultMaxPrice}
                      onChange={(e) => setConfig({ ...config, defaultMaxPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 px-5 py-2.5 rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Bot Copy & Bounds
                </button>
              </div>
            </div>

            {/* 9 Dimensions Reference */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100">
                The 9 Filter Dimensions Recognized by Aston Holidays
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <span className="font-bold text-stone-900 block mb-1">1. Accommodation Types</span>
                  <span className="text-[11px] text-stone-600">
                    Private Pool Villa, Tree House, Luxury Resort, Plantation Resort, Budget Stay, Heritage Bungalow, Glamping / Tent
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <span className="font-bold text-stone-900 block mb-1">2. Stay Preference</span>
                  <span className="text-[11px] text-stone-600">
                    Independent Private Cottage/Villa, Individual Room/Suite, Group / Bachelor Friendly, Family Gathering
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <span className="font-bold text-stone-900 block mb-1">3. Destinations</span>
                  <span className="text-[11px] text-stone-600">
                    Padinjarathara, Sulthan Bathery, Vythiri, Kalpetta, Meppadi, Mananthavady
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <span className="font-bold text-stone-900 block mb-1">4. Budget Ranges</span>
                  <span className="text-[11px] text-stone-600">
                    Minimum & Maximum rate per night in Indian Rupees (₹)
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <span className="font-bold text-stone-900 block mb-1">5. Ambience Themes</span>
                  <span className="text-[11px] text-stone-600">
                    Mountain / Valley View, Lake / Dam Waterfront, Rainforest & Stream, Tea / Coffee Plantation, Honeymoon
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <span className="font-bold text-stone-900 block mb-1">6, 7, 8, 9. Capacity & Dates</span>
                  <span className="text-[11px] text-stone-600">
                    Adults count, Children count, Rooms (BHK) required, Check-In & Check-Out travel dates
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLAYGROUND & TEST */}
        {activeTab === "playground" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Controls */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
                <span>Simulate WhatsApp Inbound Query</span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  Live Test Engine
                </span>
              </h3>

              <div className="space-y-3 mt-4 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">1. Accommodation Type</label>
                  <select
                    value={simFilter.accommodationType}
                    onChange={(e) => setSimFilter({ ...simFilter, accommodationType: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Private Pool Villa">Private Pool Villa</option>
                    <option value="Tree House">Tree House</option>
                    <option value="Plantation Resort">Plantation Resort</option>
                    <option value="Luxury Resort">Luxury Resort</option>
                    <option value="Budget Stay">Budget Stay</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">2. Stay Preference</label>
                    <select
                      value={simFilter.stayPreference}
                      onChange={(e) => setSimFilter({ ...simFilter, stayPreference: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="Independent Private Cottage/Villa">Independent Villa</option>
                      <option value="Family Gathering">Family Gathering</option>
                      <option value="Group / Bachelor Friendly">Group Friendly</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">3. Location</label>
                    <select
                      value={simFilter.location}
                      onChange={(e) => setSimFilter({ ...simFilter, location: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="Padinjarathara">Padinjarathara</option>
                      <option value="Vythiri">Vythiri</option>
                      <option value="Sulthan Bathery">Sulthan Bathery</option>
                      <option value="Kalpetta">Kalpetta</option>
                      <option value="Meppadi">Meppadi</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Adults</label>
                    <input
                      type="number"
                      value={simFilter.adults}
                      onChange={(e) => setSimFilter({ ...simFilter, adults: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Children</label>
                    <input
                      type="number"
                      value={simFilter.children}
                      onChange={(e) => setSimFilter({ ...simFilter, children: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">Rooms (BHK)</label>
                    <input
                      type="number"
                      value={simFilter.rooms}
                      onChange={(e) => setSimFilter({ ...simFilter, rooms: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Max Budget (₹/night)</label>
                  <input
                    type="number"
                    value={simFilter.budgetMax}
                    onChange={(e) => setSimFilter({ ...simFilter, budgetMax: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSimulateRecommendation}
                  disabled={simLoading}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3 bg-[#2E4F28] hover:bg-[#233D1F] text-white font-bold rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {simLoading ? "Executing Filter Query..." : "Execute Live Simulation"}
                </button>
              </div>
            </div>

            {/* Response Output Preview */}
            <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
                  <span>Simulated WhatsApp Output</span>
                  {simResponse && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      Matched: {simResponse.matchedCount || 0} Stays
                    </span>
                  )}
                </h3>

                {simResponse ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-stone-400 block mb-1">
                        Formatted WhatsApp Bubble Message
                      </span>
                      <pre className="p-4 bg-stone-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-72 border border-stone-800">
                        {simResponse.whatsAppMessage || JSON.stringify(simResponse, null, 2)}
                      </pre>
                    </div>

                    {simResponse.resorts && simResponse.resorts[0] && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                        <span className="text-xs font-bold text-stone-900 block">
                          Top Match: {simResponse.resorts[0].name}
                        </span>
                        <div className="flex items-center gap-3 mt-2 text-[11px]">
                          <a
                            href={simResponse.resorts[0].webBrochureUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 font-bold underline"
                          >
                            Open 12-Page Web Brochure
                          </a>
                          <span className="text-stone-300">•</span>
                          <a
                            href={simResponse.resorts[0].directPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-700 font-bold underline"
                          >
                            Test Direct PDF Route
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="py-20 text-center text-stone-400 text-xs">
                    Adjust the 9 filters on the left and click &quot;Execute Live Simulation&quot; to see the live WhatsApp bubble.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: AUDIT LOGS & CYBER MONITOR */}
        {activeTab === "audit" && (
          <div className="mt-6 bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Live Cyber Threat Defense & Webhook Audit Log
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Tracks all inbound recommendations, outbound stay vouchers, and diagnostic ping probes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchData}
                  className="p-2 border border-stone-200 hover:bg-stone-50 rounded-xl text-stone-600 transition"
                  title="Refresh Logs"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-700" : ""}`} />
                </button>
              </div>
            </div>

            {auditLogs.length === 0 ? (
              <div className="py-16 text-center text-stone-400 text-xs">
                No recent API requests logged yet. As WhatsApp queries arrive, they will appear here in real time.
              </div>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Type</th>
                      <th className="py-3 px-3">Client IP</th>
                      <th className="py-3 px-3">Latency</th>
                      <th className="py-3 px-3">Summary</th>
                      <th className="py-3 px-3 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/70 transition">
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 font-mono font-bold text-[10px] px-2 py-0.5 rounded-full ${
                              log.status === "success"
                                ? "bg-emerald-100 text-emerald-800"
                                : log.status === "blocked"
                                ? "bg-rose-100 text-rose-800"
                                : log.status === "rate_limited"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {log.statusCode} {log.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-stone-700 capitalize">
                          {log.type.replace("_", " ")}
                        </td>
                        <td className="py-3 px-3 font-mono text-stone-600">
                          {log.clientIp || "Internal"}
                        </td>
                        <td className="py-3 px-3 font-mono text-stone-500">
                          {log.durationMs}ms
                        </td>
                        <td className="py-3 px-3 text-stone-700 max-w-md truncate">
                          {log.summary}
                        </td>
                        <td className="py-3 px-3 text-right text-stone-400 font-mono text-[11px]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SUPER ADMIN CODE STUDIO */}
        {activeTab === "studio" && (
          <div className="mt-6 space-y-6">
            {!studioUnlocked ? (
              /* Security Lock Card */
              <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-black text-white rounded-3xl p-8 sm:p-12 border border-emerald-500/20 shadow-2xl max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 text-emerald-400">
                  <Key className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-editorial font-normal tracking-tight text-white mb-3">
                  Super Admin Code & Config Studio
                </h3>
                <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto mb-8 leading-relaxed">
                  Direct live access to inspect and edit website filter taxonomies, destination lists, itinerary rules, package defaults, and system schemas. Changes apply live to all client forms and customer search bars.
                </p>

                <div className="max-w-md mx-auto space-y-4">
                  <div className="relative">
                    <input
                      type="password"
                      value={passkeyInput}
                      onChange={(e) => setPasskeyInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleUnlockStudio()}
                      placeholder="Enter Super Admin Passkey"
                      className="w-full px-5 py-3.5 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-stone-500 focus:outline-none focus:border-emerald-400 text-sm tracking-widest text-center"
                    />
                  </div>
                  {passkeyError && (
                    <p className="text-xs text-rose-400 font-medium">{passkeyError}</p>
                  )}
                  <button
                    onClick={handleUnlockStudio}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-lg text-xs uppercase tracking-luxury flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" /> Unlock Live Code Studio
                  </button>
                  <p className="text-[11px] text-stone-500">
                    Default passkey: <code className="text-emerald-400/80 font-mono">aston@admin2026</code> or master admin password.
                  </p>
                </div>
              </div>
            ) : (
              /* Unlocked Studio UI */
              <div className="space-y-6">
                {/* Studio Top Control Bar */}
                <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="text-sm font-bold text-stone-900">
                        Live Code Studio (Super Admin Mode)
                      </h3>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Live Sync Active
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Select a module below to inspect and directly edit its live configuration.
                    </p>
                  </div>

                  {/* Mode & Action Controls */}
                  <div className="flex items-center gap-2">
                    <div className="inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200 text-xs">
                      <button
                        onClick={() => setStudioMode("code")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                          studioMode === "code" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        <FileCode className="w-3.5 h-3.5 text-emerald-600" /> Direct Code View
                      </button>
                      <button
                        onClick={() => setStudioMode("visual")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                          studioMode === "visual" ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        <FolderEdit className="w-3.5 h-3.5 text-blue-600" /> Visual Tags Studio
                      </button>
                    </div>

                    <button
                      onClick={fetchStudioData}
                      disabled={studioLoading}
                      title="Reload fresh data from server"
                      className="p-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 transition"
                    >
                      <RefreshCw className={`w-4 h-4 ${studioLoading ? "animate-spin" : ""}`} />
                    </button>

                    <button
                      onClick={() => setStudioUnlocked(false)}
                      title="Lock Studio"
                      className="text-xs text-stone-500 hover:text-rose-600 px-3 py-2 rounded-xl border border-stone-200 transition"
                    >
                      Lock ✕
                    </button>
                  </div>
                </div>

                {/* Module Switcher Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSwitchStudioModule("resortFilters")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
                      studioModule === "resortFilters"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
                    }`}
                  >
                    🏷️ 1. Resort Filters (Types, Locations, Stay Preferences, Ambiences)
                  </button>
                  <button
                    onClick={() => handleSwitchStudioModule("itineraryConfig")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
                      studioModule === "itineraryConfig"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
                    }`}
                  >
                    🗺️ 2. Itineraries & Packages (Vehicles, Meals, Inclusions, Activities)
                  </button>
                  <button
                    onClick={() => handleSwitchStudioModule("siteSettings")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
                      studioModule === "siteSettings"
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
                    }`}
                  >
                    📊 3. Site Settings & Brand
                  </button>
                  <button
                    onClick={() => handleSwitchStudioModule("master")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition ${
                      studioModule === "master"
                        ? "bg-stone-900 text-white shadow-sm"
                        : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
                    }`}
                  >
                    ⚡ 4. Master Unified JSON
                  </button>
                </div>

                {/* Status / Message Alert */}
                {studioMessage && (
                  <div className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between gap-3 ${
                    studioMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                      : "bg-rose-50 text-rose-900 border border-rose-200"
                  }`}>
                    <div className="flex items-center gap-2">
                      {studioMessage.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{studioMessage.text}</span>
                    </div>
                    <button onClick={() => setStudioMessage(null)} className="opacity-60 hover:opacity-100 font-bold">
                      ✕
                    </button>
                  </div>
                )}

                {/* Direct Code Editor Mode */}
                {studioMode === "code" && (
                  <div className="bg-stone-950 rounded-2xl border border-stone-800 shadow-2xl overflow-hidden">
                    {/* Editor Top Bar */}
                    <div className="px-5 py-3 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-stone-400 font-mono text-[11px]">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>editing: <strong className="text-emerald-400">{studioModule}.json</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePrettifyStudioCode}
                          className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-mono transition"
                        >
                          Prettify JSON
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSwitchStudioModule(studioModule)}
                          className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white rounded-lg text-xs font-mono transition"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* Monospace Code Editor Area */}
                    <div className="p-4 sm:p-5">
                      <textarea
                        value={studioCode}
                        onChange={(e) => setStudioCode(e.target.value)}
                        rows={18}
                        spellCheck={false}
                        className="w-full bg-transparent text-emerald-300 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y selection:bg-emerald-900/50"
                      />
                    </div>

                    {/* Bottom Save Bar */}
                    <div className="px-5 py-3.5 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-xs">
                      <p className="text-[11px] text-stone-400 font-mono">
                        Valid JSON syntax is automatically checked before saving.
                      </p>
                      <button
                        type="button"
                        onClick={handleSaveStudioCode}
                        disabled={studioSaving}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-luxury rounded-xl transition shadow-lg"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {studioSaving ? "Deploying Live..." : "⚡ Save & Deploy Code Live"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Visual Tags Studio Mode */}
                {studioMode === "visual" && (
                  <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm space-y-6">
                    <div className="pb-3 border-b border-stone-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-stone-900 capitalize">
                          {studioModule.replace(/([A-Z])/g, " $1")} Visual Tags Manager
                        </h4>
                        <p className="text-xs text-stone-500">
                          Click ✕ on any tag to remove it, or add new items below. Changes reflect in the code and live website instantly upon saving.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveStudioCode}
                        disabled={studioSaving}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2E4F28] hover:bg-[#233D1F] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-luxury rounded-xl transition shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {studioSaving ? "Saving..." : "⚡ Save & Deploy Live"}
                      </button>
                    </div>

                    {/* Render visual tag lists for the selected module */}
                    {(() => {
                      try {
                        const parsed = JSON.parse(studioCode || "{}");
                        const keys = Object.keys(parsed).filter(k => Array.isArray(parsed[k]));
                        if (keys.length === 0) {
                          return (
                            <p className="text-xs text-stone-500 italic py-4">
                              This section contains complex settings. Please switch to &quot;Direct Code View&quot; to edit values.
                            </p>
                          );
                        }

                        return (
                          <div className="space-y-6">
                            {keys.map((k) => (
                              <div key={k} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider font-mono">
                                    {k} ({parsed[k].length} items)
                                  </h5>
                                </div>

                                {/* Tags Pill Wrap */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {parsed[k].map((item: any, idx: number) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-stone-200 text-xs font-medium text-stone-800 shadow-sm"
                                    >
                                      <span>{String(item)}</span>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveVisualTag(k, item)}
                                        className="text-stone-400 hover:text-rose-600 transition ml-0.5"
                                        title={`Remove ${item}`}
                                      >
                                        ✕
                                      </button>
                                    </span>
                                  ))}
                                </div>

                                {/* Add New Tag Input */}
                                <div className="flex items-center gap-2 max-w-md">
                                  <input
                                    type="text"
                                    placeholder={`Add new ${k.replace(/([A-Z])/g, " $1").toLowerCase()}...`}
                                    value={newTagKey === k ? newTagInput : ""}
                                    onChange={(e) => {
                                      setNewTagKey(k);
                                      setNewTagInput(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleAddVisualTag(k);
                                      }
                                    }}
                                    className="px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-xl flex-1 focus:outline-none focus:border-emerald-600"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddVisualTag(k)}
                                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" /> Add
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      } catch {
                        return (
                          <div className="p-4 bg-amber-50 text-amber-900 rounded-xl text-xs">
                            JSON syntax requires formatting before visual tags can be displayed. Switch to &quot;Direct Code View&quot; to inspect syntax.
                          </div>
                        );
                      }
                    })()}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
