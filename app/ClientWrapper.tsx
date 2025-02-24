import type React from "react"

const ClientWrapper: React.FC = ({ children }) => {
  return <div className="dark:bg-gray-900 transition-colors">{children}</div>
}

export default ClientWrapper