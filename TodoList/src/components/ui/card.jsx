export function Card({ children }) {
  return <div className="bg-white rounded-lg p-4 shadow-lg">{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
