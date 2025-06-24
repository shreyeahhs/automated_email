import { useState } from "react";
import type { ChangeEvent } from 'react';

const BACKEND_URL = "http://localhost:8000"; // Adjust if backend runs elsewhere

const EmailDashboard = () => {
  const [file, setFile] = useState<File | null>(null);
  const [template, setTemplate] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [status, setStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    setStatus([]);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${BACKEND_URL}/api/upload_excel`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload file");
      const data = await res.json();
      setStatus([data.message]);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleTemplateChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTemplate(e.target.value);
  };

  const handlePreview = async () => {
    setError("");
    setPreview("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/email_preview?recipient=example@example.com&template=${encodeURIComponent(template)}`);
      if (!res.ok) throw new Error("Failed to fetch preview");
      const data = await res.json();
      setPreview(data.preview || "");
    } catch (err: any) {
      setError(err.message || "Preview failed");
    }
  };

  const handleSendEmails = async () => {
    setLoading(true);
    setError("");
    setStatus([]);
    try {
      const formData = new FormData();
      formData.append("template", template);
      const res = await fetch(`${BACKEND_URL}/api/send_emails`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to send emails");
      const data = await res.json();
      setStatus(data.status || ["No status returned"]);
    } catch (err: any) {
      setError(err.message || "Send failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="max-w-6xl mx-full">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg border-b border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl text-white">📧</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bulk Email Sender</h1>
              <p className="text-gray-600 mt-1">Send personalized emails to your entire contact list</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="bg-white rounded-b-2xl shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Upload & Template */}
            <div className="space-y-8">
              {/* File Upload Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">📊</span>
                  <h2 className="text-xl font-semibold text-gray-900">Upload Excel File</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <div className="text-4xl text-gray-400">📁</div>
                        <p className="text-gray-600">
                          {file ? file.name : "Click to select Excel file"}
                        </p>
                        <p className="text-sm text-gray-500">Supports .xlsx and .xls files</p>
                      </div>
                    </label>
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {uploading ? "Uploading..." : "Upload File"}
                  </button>
                </div>
              </div>
              {/* Email Template Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">✍️</span>
                  <h2 className="text-xl font-semibold text-gray-900">Email Template</h2>
                </div>
                <div className="space-y-4">
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-4 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={8}
                    value={template}
                    onChange={handleTemplateChange}
                    placeholder="Enter your email template here...\n\nYou can use variables like:\n{recipient} - Recipient email"
                  />
                  <button
                    onClick={handlePreview}
                    disabled={!template}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Generate Preview
                  </button>
                </div>
              </div>
            </div>
            {/* Right Column - Preview & Actions */}
            <div className="space-y-8">
              {/* Preview Section */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">👁️</span>
                  <h2 className="text-xl font-semibold text-gray-900">Email Preview</h2>
                </div>
                {preview ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-gray-700 text-sm leading-relaxed" style={{padding: 0, margin: 0}} dangerouslySetInnerHTML={{ __html: preview }} />
                  </div>
                ) : (
                  <div className="bg-white border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <div className="text-gray-400 text-4xl mb-2">📋</div>
                    <p className="text-gray-500">Email preview will appear here</p>
                    <p className="text-sm text-gray-400 mt-1">Create a template and click preview</p>
                  </div>
                )}
              </div>
              {/* Send Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xl">🚀</span>
                  <h2 className="text-xl font-semibold text-gray-900">Send Emails</h2>
                </div>
                <button
                  onClick={handleSendEmails}
                  disabled={loading || !template || !file}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
                    loading 
                      ? "bg-yellow-500 text-white cursor-not-allowed" 
                      : !template || !file
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending Emails...</span>
                    </div>
                  ) : (
                    "Send All Emails"
                  )}
                </button>
                {(!template || !file) && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Please upload a file and create a template first
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Status/Error Report Section */}
          <div className="border-t border-gray-200 p-8">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl">📊</span>
                <h2 className="text-xl font-semibold text-gray-900">Delivery Status Report</h2>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="space-y-2">
                  {error && (
                    <div className="text-red-600 font-semibold">{error}</div>
                  )}
                  {status.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 py-2 px-3 rounded-lg bg-gray-50">
                      <span className="text-sm font-mono text-gray-700">{item}</span>
                    </div>
                  ))}
                  {!error && status.length === 0 && (
                    <div className="text-gray-400 text-center">No status yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDashboard;