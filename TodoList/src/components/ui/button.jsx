export function Button({ children, onClick, variant = "default" }) {
  const variants = {
    default: "bg-blue-500 text-white px-4 py-2 rounded",
    outline: "border border-blue-500 text-blue-500 px-4 py-2 rounded",
    destructive: "bg-red-500 text-white px-4 py-2 rounded",
  };

  return (
    <button onClick={onClick} className={`${variants[variant]} hover:opacity-75`}>
      {children}
    </button>
  );
}
