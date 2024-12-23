import { ReactNode, Suspense } from "react";

interface SuspenseWrapperProps {
  children: ReactNode; // 代表任何合法的 React 子元素
  fallback?: ReactNode; // fallback 是可選的
}

export default function SuspenseWrapper({
  children,
  fallback = <div>Loading...</div>,
}: SuspenseWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
