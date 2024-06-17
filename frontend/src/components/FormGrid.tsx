import { ReactNode } from "react";

interface FormGridProps {
  children: ReactNode;
}

export default function FormGrid({ children }: FormGridProps) {
  return <div className="login-grid">{children}</div>;
}
