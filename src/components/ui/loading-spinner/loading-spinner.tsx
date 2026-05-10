import { Loading } from "../loading";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className,
}: LoadingSpinnerProps) => {
  return <Loading size={size} variant="spinner" center className={className} />;
};