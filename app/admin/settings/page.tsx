"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const [form, setForm] = useState({
    fullName: "",
    business: "",
    email: "",
    phone: "",
    fax: "",
    country: "",
    city: "",
    postcode: "",
    state: "",
  });
  const [file, setFile] = useState<File | null>(null);

  // Load current user profile on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/admin/settings/profile");
        const json = await res.json();
        if (json.success && json.profile) {
          const p = json.profile;
          setUserId(p.id);
          setForm({
            fullName: p.full_name || "",
            business: "",
            email: p.email || "",
            phone: p.phone || "",
            fax: p.fax || "",
            country: p.country || "",
            city: p.city || "",
            postcode: p.postcode || "",
            state: p.state || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  async function uploadFile(userId: string) {
    if (!file) return null;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("userId", userId);
    const res = await fetch("/api/admin/settings/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Upload failed");
    return json.url;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (!userId) {
        throw new Error("User ID not found");
      }

      let avatar_url = null;
      if (file) {
        avatar_url = await uploadFile(userId);
      }

      const payload = {
        userId,
        data: {
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          fax: form.fax,
          country: form.country,
          city: form.city,
          postcode: form.postcode,
          state: form.state,
          ...(avatar_url && { avatar_url }),
        },
      };
      const res = await fetch("/api/admin/settings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Save failed");
      alert("Settings saved successfully");
    } catch (err: any) {
      alert(err.message || String(err));
    }
  }

  function handleCancel() {
    // go back or reset
    window.history.back();
  }

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-white">Loading profile...</p>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between bg-white/70 rounded-2xl px-3 py-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">Manage your application settings and preferences.</p>
            </div>
          </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-12">
          {/* Left nav */}
          <aside className="col-span-3 border-r border-gray-100 p-6 bg-gray-50">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "general" ? "bg-white shadow" : "hover:bg-gray-100"}`}>
                General Information
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "preferences" ? "bg-white shadow" : "hover:bg-gray-100"}`}>
                Preferences
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "security" ? "bg-white shadow" : "hover:bg-gray-100"}`}>
                Security
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "notifications" ? "bg-white shadow" : "hover:bg-gray-100"}`}>
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("accountManager")}
                className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "accountManager" ? "bg-white shadow" : "hover:bg-gray-100"}`}>
                Account Manager
              </button>
              <button
                onClick={() => setActiveTab("billings")}
                className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === "billings" ? "bg-white shadow" : "hover:bg-gray-100"}`}>
                Billings
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="col-span-9 p-6">
            {activeTab === "general" && (
              <form onSubmit={handleSave} className="space-y-6">
                <h2 className="text-lg font-semibold">General Information</h2>
                <p className="text-sm text-gray-400">Profile and organization information.</p>

                <div className="flex items-start gap-8">
                  <div className="w-36">
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">JD</div>
                    <div className="flex gap-2">
                      <button type="button" className="flex-1 px-3 py-2 rounded-full bg-indigo-600 text-white text-sm">Upload</button>
                      <button type="button" className="flex-1 px-3 py-2 rounded-full  border border-gray-200 text-sm">Delete</button>
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">Full name</label>
                      <input name="fullName" value={form.fullName} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Email Address</label>
                      <input name="email" value={form.email} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-200" />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Business Name</label>
                      <input name="business" value={form.business} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Phone Number</label>
                      <input name="phone" value={form.phone} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-200" />
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Fax</label>
                      <input name="fax" value={form.fax} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-200" />
                    </div>
                    <div />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-800">Address</h3>
                  <div className="grid grid-cols-4 gap-4 mt-3">
                    <div>
                      <label className="text-xs text-gray-500">Country</label>
                      <input name="country" value={form.country} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">City</label>
                      <input name="city" value={form.city} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Postcode</label>
                      <input name="postcode" value={form.postcode} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">State</label>
                      <input name="state" value={form.state} onChange={handleChange} className="mt-1 w-full rounded-md border-gray-200" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={handleCancel} className="px-4 py-2 rounded-full border text-sm">Cancel</button>
                  <button type="submit" onClick={handleSave} className="px-4 py-2 rounded-full bg-indigo-600 shadow-2xl transition-all duration-200 ease-in-out hover:scale-110 text-white text-sm">Save Changes</button>
                </div>
              </form>
            )}

            {activeTab !== "general" && (
              <div className="p-6 bg-white rounded-lg">Content for <strong>{activeTab}</strong> (placeholder)</div>
            )}
          </main>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
