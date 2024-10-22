// src/components/common/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
  }
  
  export function Button({ isLoading, children, ...props }: ButtonProps) {
    return (
      <button
        {...props}
        className={`px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50 ${props.className}`}
        disabled={isLoading || props.disabled}
      >
        {isLoading ? 'Loading...' : children}
      </button>
    );
  } 