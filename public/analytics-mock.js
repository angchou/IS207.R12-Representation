// Script giả lập "bên thứ ba" (analytics) — được nạp bằng next/script với strategy="lazyOnload".
// Nó ghi lại thời điểm thực thi để slide 3.3 đối chiếu với thời điểm trang load xong.
window.__DEMO_ANALYTICS__ = {
  executedAt: performance.now(),
  loadEventEnd:
    (performance.getEntriesByType("navigation")[0] || {}).loadEventEnd || null,
};
