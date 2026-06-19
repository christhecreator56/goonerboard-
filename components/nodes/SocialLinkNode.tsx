import React, { useState } from "react";
import { NodeProps } from "@xyflow/react";
import { Link as LinkIcon, ExternalLink, RefreshCw } from "lucide-react";
import { NodeWrapper } from "./NodeWrapper";
import { useCanvasStore, type CustomNode } from "@/store/canvasStore";

// Inline brand SVGs for maximum reliability
const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11C4.483 20.455 12 20.455 12 20.455s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="currentColor" {...props}>
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-1.02-.335.073-.668-.138-.74-.473-.073-.335.138-.668.473-.74 3.854-.88 7.15-.502 9.814 1.13.295.18.387.565.206.86zm1.224-2.72c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.078-1.182-.413.125-.85-.107-.975-.52-.125-.413.107-.85.52-.975 3.67-1.114 8.24-.57 11.347 1.343.367.227.488.708.26 1.074zm.11-2.82c-3.26-1.937-8.644-2.115-11.758-1.17-.5.15-1.022-.135-1.173-.635-.15-.5.135-1.022.635-1.173 3.62-1.1 9.563-.9 13.328 1.334.45.267.6.846.333 1.296-.267.45-.846.6-1.296.333z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface SocialMetadata {
  title: string;
  description: string;
  image?: string;
  platform: "youtube" | "twitter" | "instagram" | "github" | "spotify" | "generic";
  platformName: string;
  color: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const SocialLinkNode: React.FC<NodeProps<CustomNode>> = ({ id, data, selected }) => {
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const [inputUrl, setInputUrl] = useState(data.url || "");
  const [loading, setLoading] = useState(false);

  const url = data.url || "";
  const loaded = data.loaded || false;

  const handleTitleChange = (newTitle: string) => {
    updateNodeData(id, { title: newTitle });
  };

  const detectPlatform = (rawUrl: string): SocialMetadata => {
    const cleanUrl = rawUrl.toLowerCase();
    
    if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) {
      return {
        title: data.title || "YouTube Video",
        description: data.description || "Watch this awesome video content on YouTube.",
        platform: "youtube",
        platformName: "YouTube",
        color: "border-red-600 bg-red-950/20 text-red-400 focus-within:border-red-500",
        icon: YoutubeIcon,
      };
    }
    if (cleanUrl.includes("twitter.com") || cleanUrl.includes("x.com")) {
      return {
        title: data.title || "X Profile / Post",
        description: data.description || "Check out latest updates on the social network X.",
        platform: "twitter",
        platformName: "X / Twitter",
        color: "border-neutral-700 bg-neutral-900/60 text-white focus-within:border-neutral-500",
        icon: XIcon,
      };
    }
    if (cleanUrl.includes("instagram.com")) {
      return {
        title: data.title || "Instagram Post",
        description: data.description || "View photos and videos from Instagram.",
        platform: "instagram",
        platformName: "Instagram",
        color: "border-pink-600 bg-pink-950/20 text-pink-400 focus-within:border-pink-500",
        icon: InstagramIcon,
      };
    }
    if (cleanUrl.includes("github.com")) {
      return {
        title: data.title || "GitHub Repository",
        description: data.description || "Explore source code and developer tools on GitHub.",
        platform: "github",
        platformName: "GitHub",
        color: "border-zinc-600 bg-zinc-950/30 text-zinc-100 focus-within:border-zinc-500",
        icon: GithubIcon,
      };
    }
    if (cleanUrl.includes("spotify.com")) {
      return {
        title: data.title || "Spotify Music",
        description: data.description || "Listen to tracks, playlists, and podcasts on Spotify.",
        platform: "spotify",
        platformName: "Spotify",
        color: "border-emerald-600 bg-emerald-950/20 text-emerald-400 focus-within:border-emerald-500",
        icon: SpotifyIcon,
      };
    }

    // Default generic platform
    return {
      title: data.title || "Web Link",
      description: data.description || "Visit the website link to explore content.",
      platform: "generic",
      platformName: "Website",
      color: "border-purple-600 bg-purple-950/20 text-purple-400 focus-within:border-purple-500",
      icon: LinkIcon,
    };
  };

  const handleLoadLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setLoading(true);

    // Mock an unfurl fetch with a small timeout
    setTimeout(() => {
      let formattedUrl = inputUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      // Infer details based on domain
      const metadata = detectPlatform(formattedUrl);
      
      // Parse some nice dummy info if not already there
      let inferredTitle = metadata.title;
      const inferredDesc = metadata.description;
      
      try {
        const domain = new URL(formattedUrl).hostname.replace("www.", "");
        inferredTitle = `${metadata.platformName} - ${domain}`;
      } catch {
        // Ignored
      }

      updateNodeData(id, {
        url: formattedUrl,
        loaded: true,
        title: inferredTitle,
        description: inferredDesc,
        platform: metadata.platform,
      });
      setLoading(false);
    }, 800);
  };

  const handleReset = () => {
    updateNodeData(id, {
      url: "",
      loaded: false,
      title: "",
      description: "",
      platform: undefined,
    });
    setInputUrl("");
  };

  const currentMeta = loaded ? detectPlatform(url) : null;
  const PlatformIcon = currentMeta ? currentMeta.icon : LinkIcon;

  return (
    <NodeWrapper
      id={id}
      title={loaded && currentMeta ? currentMeta.platformName : "Social Link"}
      onTitleChange={handleTitleChange}
      selected={selected}
      icon={<PlatformIcon className="text-purple-400 w-3.5 h-3.5" />}
    >
      <div className="flex flex-col gap-2.5 min-w-[260px]">
        {!loaded ? (
          <form onSubmit={handleLoadLink} className="flex flex-col gap-2">
            <div className="text-xs text-neutral-500 select-none">
              Paste URL to create a quick-link card
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="https://..."
              />
              <button
                type="submit"
                disabled={loading}
                className="p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-medium text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1 select-none"
              >
                {loading ? <RefreshCw size={12} className="animate-spin" /> : "Link"}
              </button>
            </div>
          </form>
        ) : (
          <div className={`border rounded-lg p-3 ${currentMeta?.color} flex flex-col gap-2 transition-all`}>
            {/* Header info */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-neutral-950/60 rounded-md">
                  <PlatformIcon size={16} />
                </span>
                <span className="text-xs font-bold select-none">{currentMeta?.platformName}</span>
              </div>
              <div className="flex gap-1.5">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-neutral-950/40 rounded transition-colors text-neutral-400 hover:text-white"
                  title="Open Link"
                >
                  <ExternalLink size={12} />
                </a>
                <button
                  onClick={handleReset}
                  className="p-1 hover:bg-neutral-950/40 rounded transition-colors text-neutral-400 hover:text-white cursor-pointer"
                  title="Reset Link"
                >
                  <RefreshCw size={12} />
                </button>
              </div>
            </div>

            {/* URL Display */}
            <div className="text-[10px] text-neutral-500 truncate select-all">{url}</div>

            {/* Title and Description */}
            <div className="flex flex-col gap-1 mt-1">
              <input
                type="text"
                value={data.title || ""}
                onChange={(e) => updateNodeData(id, { title: e.target.value })}
                className="bg-transparent border-none text-xs font-semibold text-neutral-200 focus:outline-none focus:ring-1 focus:ring-purple-500/30 rounded w-full p-0.5"
                placeholder="Card Title"
              />
              <textarea
                value={data.description || ""}
                onChange={(e) => updateNodeData(id, { description: e.target.value })}
                className="bg-transparent border-none text-[11px] text-neutral-400 focus:outline-none focus:ring-1 focus:ring-purple-500/30 rounded w-full p-0.5 resize-none h-[44px]"
                placeholder="Add card description..."
              />
            </div>
          </div>
        )}
      </div>
    </NodeWrapper>
  );
};
