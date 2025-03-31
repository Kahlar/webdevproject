import type React from "react"

interface ClientWrapperProps {
  children: React.ReactNode;
}

const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  return <div className="dark:bg-gray-900 transition-colors">{children}</div>
}

export default ClientWrapper