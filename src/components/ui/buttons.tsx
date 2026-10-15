"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Copy, Moon, Sparkles, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { InlineLoader } from "generative-loaders";

const spring = { type: "spring", stiffness: 600, damping: 25 } as const;

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-bg hover:bg-ink/90",
  secondary: "bg-surface text-ink border border-line hover:border-line-strong",
  ghost: "bg-ink/[0.04] text-ink border border-ink/[0.06] hover:bg-ink/[0.07]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[15px]",
};

const base =
  "relative inline-flex select-none items-center justify-center rounded-full font-medium tracking-tight cursor-pointer transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

/**
 * Optional leading icon slides out, trailing arrow slides in on hover. When it links
 * off-site it shows a short loader on click so the hand-off feels intentional.
 */
export function SlideArrowButton({
  href,
  children,
  icon,
  variant = "primary",
  size = "md",
  external = false,
  loadingLabel = "Opening…",
  className = "",
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  variant?: Variant;
  size?: Size;
  external?: boolean;
  loadingLabel?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => {
        if (!external) return;
        setLoading(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setLoading(false), 1400);
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring}
            className="flex items-center gap-2.5"
          >
            <InlineLoader variant="orbit" size={16} color="currentColor" label={loadingLabel} />
            <span>{loadingLabel}</span>
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={spring}
            className="flex items-center"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {icon && !hovered && (
                <motion.span
                  key="lead"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={spring}
                  className="mr-2.5 flex shrink-0 items-center"
                >
                  {icon}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span layout="position" transition={spring}>
              {children}
            </motion.span>
            <AnimatePresence mode="popLayout" initial={false}>
              {hovered && (
                <motion.span
                  key="trail"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={spring}
                  className="ml-2.5 flex shrink-0 items-center"
                >
                  {external ? <ArrowUpRight className="size-4" /> : <ArrowRight className="size-4" />}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}

/** Icon flips up into a sparkle on hover. */
export function SparkleButton({
  href,
  children,
  icon,
  variant = "ghost",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={href}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {!hovered ? (
            <motion.span
              key="a"
              initial={{ y: -15, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -15, opacity: 0, scale: 0.8 }}
              transition={spring}
              className="absolute inset-0 flex items-center justify-center"
            >
              {icon}
            </motion.span>
          ) : (
            <motion.span
              key="b"
              initial={{ y: 15, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 15, opacity: 0, scale: 0.8 }}
              transition={spring}
              className="absolute inset-0 flex items-center justify-center text-green"
            >
              <Sparkles className="size-4" />
              <motion.svg
                initial={{ opacity: 0, scale: 0, rotate: -45, y: 10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 45, y: 10 }}
                transition={{ ...spring, delay: 0.05 }}
                className="absolute -right-2 -top-3 size-2.5 text-violet"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z" />
              </motion.svg>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="ml-2.5">{children}</span>
    </motion.a>
  );
}

/** Copies text; the copy glyph morphs into a check. */
export function CopyButton({
  value,
  label = "Copy link",
  copiedLabel = "Copied",
  variant = "ghost",
  size = "md",
  className = "",
}: {
  value: string;
  label?: string;
  copiedLabel?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <motion.button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1800);
        } catch {
          // Clipboard can be blocked (insecure context, permissions); leave state as-is.
        }
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <span className="relative flex size-4 shrink-0 items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "check" : "copy"}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={spring}
            className={`absolute inset-0 flex items-center justify-center ${copied ? "text-green" : ""}`}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="ml-2.5" aria-live="polite">
        {copied ? copiedLabel : label}
      </span>
    </motion.button>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- theme is only known on the client
  useEffect(() => setMounted(true), []);
  const dark = mounted && resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      className={`${base} size-9 border border-line bg-surface text-ink hover:border-line-strong`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={mounted ? (dark ? "moon" : "sun") : "none"}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={spring}
          className="flex items-center justify-center"
        >
          {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
