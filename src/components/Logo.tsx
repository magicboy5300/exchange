export function Logo({ className = "h-16 w-auto" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="汇率换算 Logo"
      className={`${className} object-contain`}
    />
  );
}