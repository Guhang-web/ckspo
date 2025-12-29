type BoltProps = {
  size?: number | string;   
  className?: string;   
  title?: string;
};

export default function BoltSmall({ size = 48, className = "", title }: BoltProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      className={className}
    >
      {title ? <title>{title}</title> : null}
      <path d="M38 2 10 36h16L22 62l32-36H38l6-24z" />
    </svg>
  );
}
