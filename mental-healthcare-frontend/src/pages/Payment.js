import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";

export default function Payment() {
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Lấy thông tin ví người dùng
  const fetchWallet = async () => {
    try {
      const res = await api.get("/api/wallet/me"); // ✅ sửa endpoint
      setBalance(res.data.balance || 0);
      if (res.data.transactions) setHistory(res.data.transactions.reverse());
    } catch (err) {
      console.error("❌ Lỗi lấy ví:", err);
      alert("Không thể tải thông tin ví. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  // 💰 Nạp tiền
  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return alert("Vui lòng nhập số tiền hợp lệ!");

    try {
      await api.post("/api/wallet/add", { amount }); // ✅ sửa endpoint
      setAmount("");
      await fetchWallet();
      alert("💰 Nạp tiền thành công!");
    } catch (err) {
      console.error("❌ Lỗi nạp tiền:", err);
      alert("Không thể nạp tiền. Vui lòng thử lại!");
    }
  };

  if (loading) return <p className="text-center mt-5">⏳ Đang tải ví của bạn...</p>;

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-3">💰 Ví cá nhân</h3>
      <p>
        Số dư hiện tại:{" "}
        <strong className="text-success">
          {balance.toLocaleString()}đ
        </strong>
      </p>

      {/* 🔸 Form nạp tiền */}
      <form onSubmit={handleAddMoney} className="d-flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Nhập số tiền cần nạp (VD: 50000)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-control"
          min="1000"
        />
        <button className="btn btn-success">Nạp tiền</button>
      </form>

      {/* 📜 Lịch sử giao dịch */}
      <h5 className="fw-semibold mb-3">📜 Lịch sử giao dịch</h5>
      {history.length === 0 ? (
        <p className="text-muted">Chưa có giao dịch nào.</p>
      ) : (
        <ul className="list-group">
          {history.map((t, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                {t.type === "deposit" ? "Nạp tiền" : "Thanh toán"} –{" "}
                {new Date(t.date).toLocaleString("vi-VN")}
              </span>
              <span
                className={
                  t.type === "deposit" ? "text-success" : "text-danger"
                }
              >
                {t.type === "deposit" ? "+" : "-"}
                {t.amount.toLocaleString()}đ
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
