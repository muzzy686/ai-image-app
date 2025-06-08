'use client'

import { useState } from 'react';

export default function Home() {
  const [inputImage, setInputImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [fgUrl, setFgUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!inputImage || !prompt) return;

    setLoading(true);

    // Step 1: 去背景
    const formData = new FormData();
    formData.append('file', inputImage);

    const fgRes = await fetch('/api/remove-bg', {
      method: 'POST',
      body: formData
    });

    const fgBlob = await fgRes.blob();
    const fgObjectUrl = URL.createObjectURL(fgBlob);
    setFgUrl(fgObjectUrl);

    // Step 2: 文生图
    const bgRes = await fetch('/api/generate-bg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const bgJson = await bgRes.json();
    const bgImage = bgJson?.output?.[0] || '';
    setBgUrl(bgImage);

    setLoading(false);
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-xl space-y-4">
        <h1 className="text-2xl font-bold">AI 换背景图工具</h1>

        <input type="file" accept="image/*" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setInputImage(file);
        }} />

        <input
          type="text"
          className="border p-2 w-full"
          placeholder="请输入提示词，如：在巴黎铁塔前"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '生成中...' : '生成图像'}
        </button>

        <div className="space-y-2">
          {fgUrl && <img src={fgUrl} alt="前景图" className="w-full border" />}
          {bgUrl && <img src={bgUrl} alt="背景图" className="w-full border" />}
        </div>
      </div>
    </main>
  );
}
