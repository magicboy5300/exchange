export function Logo({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="汇率换算 Logo"
      className={`${className} object-contain`} // Ensure image maintains aspect ratio
    />
  );
}