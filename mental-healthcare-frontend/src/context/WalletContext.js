import { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

export const WalletContext = createContext();

export function WalletProvider({ children }) {
  const [balance, setBalance] = useState(0);
  const token = localStorage.getItem("token");

  const fetchBalance = async () => {
    if (!token) return;
    try {
      const res = await api.get("/payments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const total =
        res.data?.length > 0
          ? res.data
              .filter((p) => p.status === "success")
              .reduce((sum, p) => sum + (p.type === "deposit" ? p.amount : -p.amount), 0)
          : 0;
      setBalance(total);
    } catch (err) {
      console.error("❌ Lỗi khi lấy số dư:", err);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [token]);

  // Hàm cập nhật thủ công sau khi nạp tiền / thanh toán
  const updateBalance = (amount, type) => {
    setBalance((prev) =>
      type === "deposit" ? prev + amount : prev - amount
    );
  };

  return (
    <WalletContext.Provider value={{ balance, updateBalance, fetchBalance }}>
      {children}
    </WalletContext.Provider>
  );
}
