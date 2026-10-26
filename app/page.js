'use client';
import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [mediaList, setMediaList] = useState([
    { id: 1, url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", prompt: "Cyberpunk neon portrait" },
    { id: 2, url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop", prompt: "Futuristic architecture abstract" },
    { id: 3, url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop", prompt: "Surreal dreamscape art" }
  ]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success) {
        setMediaList((prev) => [...data.data, ...prev]);
        setPrompt('');
      }
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] text-white flex flex-col">
      {/* Top Navigation & History Reel */}
      <header className="border-b border-zinc-800 p-4 flex items-center justify-between bg-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl tracking-wider text-orange-500">F</span>
          <span className="text-sm font-medium text-zinc-400 border-l border-zinc-700 pl-3">Workspace</span>
        </div>
        
        {/* Horizontal History Reel Strip */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-2xl px-2 py-1 scrollbar-none">
          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mr-2">History</span>
          {mediaList.map((item) => (
            <div key={item.id} className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-700 shrink-0 hover:border-orange-500 transition cursor-pointer">
              <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center font-bold text-sm">U</div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Left Side: Prompt & Control Panel */}
        <aside className="w-full lg:w-[380px] border-r border-zinc-800 p-6 flex flex-col gap-6 bg-[#161616]">
          <div>
            <h2 className="text-sm font-semibold text-zinc-300 mb-2">Create Image</h2>
            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your imagination to be converted to piece of art..."
                className="w-full h-32 bg-[#202020] border border-zinc-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500 transition resize-none placeholder:text-zinc-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl font-medium text-white shadow-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Generating...' : 'Generate ⚡'}
              </button>
            </form>
          </div>

          {/* Controls / Options */}
          <div className="flex flex-col gap-4 border-t border-zinc-800 pt-4">
            <div className="flex justify-between items-center text-sm text-zinc-400">
              <span>Aspect Ratio</span>
              <select className="bg-[#202020] border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-xs outline-none">
                <option>1:1 Square</option>
                <option>16:9 Landscape</option>
                <option>9:16 Portrait</option>
              </select>
            </div>
            <div className="flex justify-between items-center text-sm text-zinc-400">
              <span>Model</span>
              <span className="text-xs text-white bg-zinc-800 px-2 py-1 rounded border border-zinc-700">Fomi Core v1</span>
            </div>
          </div>
        </aside>

        {/* Right Side: Media Display Grid / Canvas */}
        <section className="flex-1 p-6 bg-[#121212] overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-200">Generated Results</h3>
            <span className="text-xs text-zinc-500">{mediaList.length} items</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {mediaList.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-square shadow-md">
                <img src={item.url} alt={item.prompt} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-4">
                  <p className="text-xs text-zinc-200 line-clamp-2">{item.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
