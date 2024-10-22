
// src/components/common/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
  }
  
  export function Input({ label, error, ...props }: InputProps) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          {...props}
          className={`w-full px-3 py-2 border rounded ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
    );
  }
  