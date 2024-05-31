import { ReactNode } from "react";

interface FormGridItemProps {
  children: ReactNode;
}

export default function FormGridItem({ children }: FormGridItemProps) {
  return <div className="login-grid-container">{children}</div>;
}
