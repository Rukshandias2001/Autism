import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function isLottieAsset(url) {
  const u = (url || "").trim().toLowerCase();
  return u.endsWith(".json") || u.endsWith(".lottie");
}

export default function MediaPreview_1({ src, alt, className }) {
  if (!src) return null;

  if (isLottieAsset(src)) {
    return (
      <div className={className}>
        <DotLottieReact
          src={src}
          autoplay
          loop
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} />;
}
