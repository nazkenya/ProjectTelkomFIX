import React, { createContext, useContext, useState } from "react";
import Button from "../ui/Button";

const MessageContext = createContext();

export const useMessage = () => useContext(MessageContext);

export function MessageProvider({ children }) {
  const [config, setConfig] = useState(null);

  const showMessage = ({
    title,
    message,
    type = "info",
    confirmText = "Ya",
    cancelText = "Batal",
    onConfirm,
  }) => {
    setConfig({
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
    });
  };

  const close = () => setConfig(null);

  const handleConfirm = () => {
    config?.onConfirm?.();
    close();
  };

  return (
    <MessageContext.Provider value={{ showMessage }}>
      {children}

      {config && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[500px] max-w-[90%] p-6">
            <h2 className="text-lg font-semibold mb-3">{config.title}</h2>

            <pre className="text-sm whitespace-pre-wrap mb-6">
              {config.message}
            </pre>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={close}>
                {config.cancelText}
              </Button>
              <Button
                onClick={handleConfirm}
                variant={
                  config.type === "danger"
                    ? "destructive"
                    : config.type === "warning"
                    ? "secondary"
                    : "primary"
                }
              >
                {config.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </MessageContext.Provider>
  );
}
