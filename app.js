(() => {
  "use strict";

  const STORAGE_KEY = "am-phase2-prototype-v1";
  const nowLabel = () => new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date());
  const money = value => `${Number(value || 0).toLocaleString("vi-VN")}đ`;
  const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const packages = [
    { id: "giga", name: "Internet Giga", group: "Internet", speed: "300Mbps · Wi-Fi 6", price: 200000, image: "assets/packages/internet-giga.png" },
    { id: "sky", name: "Internet Sky", group: "Internet", speed: "500Mbps · Wi-Fi 6", price: 205000, image: "assets/packages/internet-giga.png" },
    { id: "meta", name: "Internet Meta", group: "Internet", speed: "1Gbps · Wi-Fi 7", price: 300000, image: "assets/packages/internet-giga.png" },
    { id: "giga-f1", name: "Internet Giga F1", group: "Internet", speed: "500Mbps · Mesh Wi-Fi", price: 225000, image: "assets/packages/internet-giga.png" },
    { id: "play1", name: "Combo Play 1", group: "Combo", speed: "Internet 300Mbps + FPT Play", price: 240000, image: "assets/packages/combo-sky.png" },
    { id: "play4", name: "Combo Sky", group: "Combo", speed: "Internet 500Mbps + thể thao", price: 230000, image: "assets/packages/combo-sky.png" },
    { id: "combo-meta", name: "Combo Meta", group: "Combo", speed: "Internet 1Gbps + FPT Play", price: 315000, image: "assets/packages/combo-sky.png" },
    { id: "combo-f1", name: "Combo Sky F1", group: "Combo", speed: "Internet 500Mbps + giải trí", price: 275000, image: "assets/packages/combo-sky.png" },
    { id: "triple", name: "Triple Internet & Camera", group: "Triple", speed: "Internet 500Mbps + Camera", price: 349000, image: "assets/packages/camera.png" },
    { id: "triple-play", name: "Triple Play Camera", group: "Triple", speed: "Internet + FPT Play + Camera", price: 399000, image: "assets/packages/camera.png" },
    { id: "triple-home", name: "Triple Smart Home", group: "Triple", speed: "Internet 1Gbps + Camera + IoT", price: 449000, image: "assets/packages/camera.png" },
    { id: "triple-sky", name: "Triple Sky", group: "Triple", speed: "Internet + thể thao + Camera", price: 429000, image: "assets/packages/camera.png" }
  ];
  const vouchers = [
    { id: "v50", name: "ƯU ĐÃI 50", code: "UUDAI50", value: 50000, state: "active", image: "assets/packages/internet-giga.png" },
    { id: "v100", name: "ƯU ĐÃI 100", code: "UUDAI100", value: 100000, state: "active", image: "assets/packages/combo-sky.png" },
    { id: "v150", name: "ƯU ĐÃI 150", code: "UUDAI150", value: 150000, state: "active", image: "assets/packages/camera.png" },
    { id: "v200", name: "ƯU ĐÃI 200", code: "UUDAI200", value: 200000, state: "expired", reason: "Đã hết hạn 30/09/2026", image: "assets/packages/combo-sky.png" }
  ];
  const banners = {
    sports: { name: "Ngoại hạng Anh 4K", image: "assets/packages/combo-sky.png", title: "TRẢI NGHIỆM CHẤT LƯỢNG 4K" },
    internet: { name: "Internet Giga tốc độ cao", image: "assets/packages/internet-giga.png", title: "KẾT NỐI MẠNH MẼ MỖI NGÀY" },
    camera: { name: "Camera an tâm", image: "assets/packages/camera.png", title: "AN TÂM CHO MỌI TỔ ẤM" }
  };
  const campaignSeed = [
    { id: "c1", name: "Menu Gói Cước", scope: "HCM · 80 ngày", linked: false },
    { id: "c2", name: "Tạo Menu cá nhân hóa đến Khách hàng", scope: "Toàn quốc", linked: true, shortlink: "fpt.vn/am/quangth11", products: ["giga", "meta", "play1"], vouchers: ["v50", "v100"] },
    { id: "c3", name: "Danh sách gói tổng hợp", scope: "HCM 01", linked: true, shortlink: "fpt.vn/am/quangth12", products: ["sky", "play4"], vouchers: ["v50"] },
    { id: "c4", name: "Nâng cấp dịch vụ", scope: "Toàn quốc", linked: false },
    { id: "c5", name: "Landing Page Ngoại Hạng Anh", scope: "HCM · Hà Nội", linked: true, shortlink: "fpt.vn/am/quangth13", products: ["triple"], vouchers: [] },
    { id: "c6", name: "Trang chủ FPT", scope: "Toàn quốc", linked: false }
  ];
  const campaignGuides = {
    c1: { purpose: "Tư vấn nhanh danh sách gói cước chuẩn theo khu vực, không cần cá nhân hóa sâu.", avoid: "Khách có nhu cầu riêng cần chọn lọc gói hoặc nhiều location.", steps: ["Chọn đúng Tỉnh/Thành phố và Phường/Xã.", "Kiểm tra nhóm Internet, Combo, Triple đang được hiển thị.", "Chia sẻ đúng Campaign Link được tạo cho bạn."] },
    c2: { purpose: "Tạo Menu riêng theo nhu cầu khách hàng, sắp xếp gói và ưu đãi phù hợp với một location đã xác định.", avoid: "Gửi một Menu cho khách ở nhiều location khác nhau hoặc dùng thay Menu nâng cấp dịch vụ.", steps: ["Xác nhận chính xác location và loại hình nhà.", "Chọn tối đa 3 gói mỗi nhóm, sắp xếp gói ưu tiên lên đầu.", "Kiểm tra voucher còn lượt trước khi gửi.", "Mở Landing Page kiểm tra lần cuối rồi mới chia sẻ."], pending: "Pending Product: thiết lập nhiều chiến dịch con để đa dạng location. Prototype hiện chỉ mô tả định hướng, chưa mở chức năng tạo chiến dịch con." },
    c3: { purpose: "Cho khách tham khảo toàn bộ nhóm gói đang bán tại một khu vực.", avoid: "Khách đã chốt rõ nhu cầu và cần Menu ngắn, cá nhân hóa.", steps: ["Kiểm tra phạm vi gói được cấp.", "Không tự thêm gói ngoài catalog.", "Dùng bộ lọc trên Landing Page để hướng khách chọn nhóm phù hợp."] },
    c4: { purpose: "Tư vấn khách hàng hiện hữu muốn nâng cấp gói hoặc bổ sung dịch vụ.", avoid: "Khách đăng ký mới chưa có hợp đồng FPT.", steps: ["Xác minh khách hàng hiện hữu.", "Chọn đúng nhóm nâng cấp được cấp.", "Không dùng Menu đăng ký mới thay thế."] },
    c5: { purpose: "Tư vấn nhóm khách quan tâm nội dung thể thao và Ngoại Hạng Anh.", avoid: "Khách chỉ cần Internet cơ bản, không quan tâm truyền hình.", steps: ["Kiểm tra khu vực có gói thể thao.", "Ưu tiên Combo/Triple phù hợp.", "Kiểm tra banner và thời hạn chương trình trước khi gửi."] },
    c6: { purpose: "Điều hướng khách về trang FPT tổng quát khi nhu cầu chưa xác định.", avoid: "Khách đã có nhu cầu cụ thể cần tracking theo gói hoặc voucher.", steps: ["Xác nhận khách chưa chốt nhu cầu.", "Giải thích đây là trang thông tin tổng quát.", "Sau khi xác định nhu cầu, chuyển sang Campaign Link phù hợp."] }
  };
  const defaultState = {
    role: "sales", view: "dashboard", activeTab: "campaign-list", selectedCampaign: "c2", selectedLink: "l1", selectedOrder: "AM-20261007-018", landing: { type: "campaign", id: "c2", packageId: "meta" },
    guideSeenVersion: 0, quotaMode: "ok", selectedVoucher: "v100",
    campaigns: campaignSeed,
    customLinks: [
      { id: "l1", name: "Internet Quận 7", initials: "IQ", avatar: "blue", url: "https://fpt.vn/internet", shortlink: "fpt.vn/s/q7-net", province: "TP. Hồ Chí Minh", ward: "Phường Tân Phú", propertyType: "Nhà mặt đất (Nhà riêng/Nhà phố)", packageIds: ["giga", "meta"], created: "05/10/2026", updated: "07/10/2026", clicks: 86, leads: 18, orders: 7 },
      { id: "l2", name: "Gói mạng cho gia đình", initials: "GM", avatar: "orange", url: "https://fpt.vn/internet?source=family", shortlink: "fpt.vn/s/family", province: "Chưa thiết lập", ward: "", packageIds: [], created: "06/10/2026", updated: "06/10/2026", clicks: 42, leads: 9, orders: 3 },
      { id: "l3", name: "Combo Hà Nội", initials: "CH", avatar: "green", url: "https://fpt.vn/combo", shortlink: "fpt.vn/s/combo-hn", province: "Hà Nội", ward: "Phường Cầu Giấy", packageIds: [], created: "02/10/2026", updated: "06/10/2026", clicks: 31, leads: 5, orders: 2 }
    ],
    orders: [
      { id: "AM-20261007-018", customer: "Trần Minh Anh", phone: "0912345678", address: "72 Nguyễn Thị Thập, P. Tân Phú, TP.HCM", packageId: "meta", voucherId: "v100", sourceType: "Campaign Link", source: "Tạo Menu cá nhân hóa", owner: "Nguyễn Thành Quang", status: "Mới tạo", created: "07/10/2026 08:20", age: 26, suspect: false, history: [{ label: "Đơn được tạo qua Campaign Link", at: "07/10/2026 08:20", actor: "Khách hàng" }] },
      { id: "AM-20261005-012", customer: "Lê Hoàng Nam", phone: "0987654321", address: "Q. Bình Tân, TP.HCM", packageId: "giga", voucherId: "v50", sourceType: "Custom Link", source: "Internet Quận 7", owner: "Nguyễn Thành Quang", status: "Đang xác minh", created: "05/10/2026 09:10", age: 53, suspect: false, history: [{ label: "Đang xác minh thông tin", at: "05/10/2026 10:05", actor: "SOP" }] },
      { id: "AM-20261003-006", customer: "Võ Hải Yến", phone: "0908123123", address: "Cầu Giấy, Hà Nội", packageId: "play4", voucherId: null, sourceType: "ECOM", source: "Có dấu vết Link AM", owner: "Trần Mai Linh", status: "Đang xác minh", created: "03/10/2026 14:30", age: 91, suspect: true, history: [{ label: "Nguồn ghi nhận ECOM", at: "03/10/2026 14:30", actor: "Hệ thống" }] },
      { id: "AM-20261001-002", customer: "Ngô Thùy Dương", phone: "0934111222", address: "Q. 1, TP.HCM", packageId: "triple", voucherId: "v150", sourceType: "Campaign Link", source: "Landing Page Ngoại Hạng Anh", owner: "Nguyễn Thành Quang", status: "Hoàn tất", created: "01/10/2026 10:15", age: 0, suspect: false, history: [{ label: "Hoàn tất triển khai", at: "04/10/2026 16:00", actor: "SOP" }] }
    ],
    disputes: [
      { id: "TS-1001", orderId: "AM-20261003-006", sales: "Trần Mai Linh", reason: "Khách mở Link AM trước khi đặt", evidence: "Ảnh chụp hội thoại", status: "Chờ tiếp nhận", creator: "TPKD HCM 01", updated: "07/10/2026 09:10", history: ["TPKD HCM 01 gửi yêu cầu · 07/10/2026 09:10"] },
      { id: "TS-0998", orderId: "AM-20260928-031", sales: "Nguyễn Thành Quang", reason: "Sai nguồn", evidence: "Log link", status: "Đang xử lý", creator: "TPKD HCM 01", updated: "06/10/2026 16:30", history: ["FTQ tiếp nhận · 06/10/2026 16:30"] },
      { id: "TS-0992", orderId: "AM-20260925-020", sales: "Nguyễn Thành Quang", reason: "Có attribution", evidence: "Ảnh", status: "Đã duyệt", creator: "TPKD HCM 01", updated: "06/10/2026 13:05", history: ["DVKH duyệt · 06/10/2026 13:05"] }
    ]
  };

  function loadState() {
    try {
      const loaded = { ...structuredClone(defaultState), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
      if (["orders", "order-detail", "disputes"].includes(loaded.view)) loaded.view = "dashboard";
      if (loaded.role === "ops") loaded.role = "manager";
      return loaded;
    }
    catch (_) { return structuredClone(defaultState); }
  }
  let state = loadState();
  let campaignDraft = null;
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const getPackage = id => packages.find(p => p.id === id) || packages[0];
  const getVoucher = id => vouchers.find(v => v.id === id);
  const badge = text => `<span class="badge">${escapeHtml(text)}</span>`;
  const actionButton = (label, action, id, kind = "secondary") => `<button class="btn ${kind}" data-action="${action}" data-id="${escapeHtml(id)}">${label}</button>`;

  function toast(message, type = "success") {
    const el = $("#toast");
    el.textContent = message; el.className = `toast ${type}`;
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.add("hidden"), 2800);
  }
  function openModal(title, subtitle, body) {
    $("#modal-title").textContent = title; $("#modal-subtitle").textContent = subtitle || ""; $("#modal-body").innerHTML = body;
    $("#modal-root").classList.remove("hidden");
  }
  const closeModal = () => $("#modal-root").classList.add("hidden");

  const titles = { dashboard: "Dashboard", campaigns: "Chiến dịch", "campaign-detail": "Chi tiết chiến dịch", "campaign-config": "Cấu hình chiến dịch", "custom-link-form": "Tạo Custom Link", "custom-link-detail": "Chi tiết Custom Link", "custom-link-edit": "Chỉnh sửa Custom Link", landing: "Landing Page", checkout: "Checkout" };
  function navigate(view) {
    if (!$("#view-" + view)) view = "dashboard";
    if (state.view === "campaign-config" && view !== "campaign-config") campaignDraft = null;
    state.view = view; save();
    $$(".view").forEach(el => el.classList.toggle("active", el.id === `view-${view}`));
    $$(".nav-item[data-view]").forEach(el => el.classList.toggle("active", (view === "dashboard" && el.dataset.view === "dashboard") || (view.includes("campaign") && el.dataset.view === "campaigns") || (view.includes("custom-link") && el.dataset.view === "campaigns") || (view.includes("order") && el.dataset.view === "orders") || (view === "disputes" && el.dataset.view === "disputes")));
    $("#crumb-current").textContent = titles[view] || "Affiliate Marketing";
    renderView(view); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function applyRole() {
    const labels = { sales: "Salesman · HCM 01", manager: "TPKD / FCM · HCM 01" };
    $("#role-switch").value = state.role; $("#role-label").textContent = labels[state.role];
    document.body.dataset.role = state.role;
    $$(".manager-only").forEach(el => el.style.display = state.role === "sales" ? "none" : "");
    $("#dashboard-scope").textContent = state.role === "sales" ? "Hiệu suất cá nhân trong kỳ đang chọn" : "Hiệu suất đơn vị HCM 01";
    const summary = $("#role-summary-text"); if (summary) summary.textContent = state.role === "sales" ? "Theo dõi click, lead, đơn và hiệu quả từng Link AM của bạn." : "Theo dõi Sales active, hiệu quả chiến dịch và phân bổ lead của đơn vị.";
  }

  function renderDashboard() {
    const manager = state.role !== "sales";
    const values = manager ? ["12.245", "1.595", 148, "12,3", "nghiath28", "sinhnd", "NTN Ninh Thuận", "NTN Ninh Thuận"] : [312, 54, 12, "3,8", "Bạn", "Bạn", "HCM 01", "HCM 01"];
    const labels = ["Traffic (click)", "Leads", "Đơn đủ tiêu chuẩn", "Leads / 100 click", "Sales traffic cao nhất", "Sales nhiều đơn nhất", "Chi nhánh nhiều đơn nhất", "Chi nhánh nhiều leads nhất"];
    $("#kpi-grid").innerHTML = labels.map((x, i) => `<article class="kpi-card"><span>${x}</span><b>${values[i]}</b><small>${i === 0 ? "2.209 sales click · 6 ngày traffic" : i === 1 ? "AM 1.507 · online 88" : i === 2 ? "Tỷ lệ chốt 9,3%" : i === 3 ? "Click có data 06/10 cao nhất" : i === 4 ? "1.174 click · 0 leads · 0 đơn" : i === 5 ? "5 đơn · 17 leads" : i === 6 ? "37 đơn · chốt 25%" : "244 leads · 37 đơn"}</small></article>`).join("");
    const salesRank = [["nghiath28", 1174], ["ngam51", 348], ["nhhv", 255], ["longb", 244], ["thanhnt", 201], ["hoangh", 161]];
    const campaignRank = [["NTN - Ninh Thuận", 37], ["HCM - Vũ Long", 20], ["KTN Tân An", 16], ["Đà Nẵng", 12], ["HCM - Bình Tân", 10], ["HCM - Thủ Đức", 8]];
    $("#sales-ranking").innerHTML = salesRank.map(([n,v]) => `<div><span>${n}</span><i style="width:${Math.max(12, v / 12)}%"></i><b>${v.toLocaleString("vi-VN")}</b></div>`).join("");
    $("#campaign-ranking").innerHTML = campaignRank.map(([n,v]) => `<div><span>${n}</span><i style="width:${Math.max(12, v * 2.4)}%"></i><b>${v}</b></div>`).join("");
    const series = [36, 58, 44, 73, 62, 90, 78];
    $("#trend-chart").innerHTML = series.map((h, i) => `<div class="chart-column"><div class="bar blue" style="height:${h}%"></div><div class="bar cyan" style="height:${Math.max(15, h - 17)}%"></div><div class="bar orange" style="height:${Math.max(9, h - 38)}%"></div><div class="bar green" style="height:${Math.max(6, h - 52)}%"></div><span>${i + 1}/10</span></div>`).join("");
    const funnelValues = manager ? [9728, 1595, 148, 93] : [246, 54, 12, 6];
    $("#funnel").innerHTML = [["Unique Users", funnelValues[0]], ["Lead hợp lệ", funnelValues[1]], ["Tổng đơn", funnelValues[2]], ["Hoàn tất", funnelValues[3]]].map((x, i) => `<div class="funnel-step" style="width:${100 - i * 12}%"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");
    const statuses = [["Mới tạo", 9], ["Đang xác minh", 12], ["Đã chốt lịch", 5], ["Đang triển khai", 7], ["Hoàn tất", 19], ["Hủy", 4]];
    $("#order-status-list").innerHTML = statuses.map(x => `<li><span>${x[0]}</span><b>${x[1]}</b></li>`).join("");
    const rows = state.campaigns.filter(c => c.linked).slice(0, 2).map(c => [c.name, "Campaign Link", 312, 248, 51, 10, "4,0%"]).concat(state.customLinks.slice(0, 2).map(l => [l.name, "Custom Link", l.clicks, Math.round(l.clicks * .78), l.leads, l.orders, `${(l.orders / Math.max(1, l.clicks * .78) * 100).toFixed(1)}%`]));
    $("#source-performance").innerHTML = rows.map(r => `<tr>${r.map((c, i) => `<td>${i === 1 ? badge(c) : escapeHtml(c)}</td>`).join("")}</tr>`).join("");
    $("#inactive-sales").innerHTML = ["Phạm Mỹ An", "Lê Quốc Bảo", "Đỗ Hoài Nam"].map(n => `<div><span class="avatar">${n.split(" ").slice(-2).map(x => x[0]).join("")}</span><span><b>${n}</b><small>Chưa có click hợp lệ</small></span></div>`).join("");
  }

  function renderCampaigns() {
    const query = $("#campaign-search").value.trim().toLowerCase();
    $("#campaign-table").innerHTML = state.campaigns.filter(c => c.name.toLowerCase().includes(query)).map((c, i) => `<tr><td>${i + 1}</td><td><div class="campaign-name"><img src="${c.products?.length ? getPackage(c.products[0]).image : "assets/packages/internet-giga.png"}" alt=""/><span><b>${escapeHtml(c.name)}</b><small>${c.linked ? "Campaign Link đã sẵn sàng" : "Chưa tạo link cá nhân"}</small></span></div></td><td class="right action-cell">${actionButton("? HDSD", "guide-campaign", c.id)} ${c.linked ? `${actionButton("◉", "detail-campaign", c.id)} ${actionButton("✎", "config-campaign", c.id, "primary")} ${actionButton("▣", "copy-campaign", c.id)}` : actionButton("⌁ Tạo link", "create-campaign", c.id, "primary")}</td></tr>`).join("");
    const q = $("#link-search").value.trim().toLowerCase();
    $("#custom-link-table").innerHTML = state.customLinks.filter(l => l.name.toLowerCase().includes(q)).map(l => `<tr><td><div class="link-identity"><span class="link-avatar ${l.avatar}">${escapeHtml(l.initials)}</span><div><b>${escapeHtml(l.name)}</b><small>${escapeHtml(l.shortlink)}</small></div></div></td><td>${l.packageIds.length ? `<div class="package-chips">${l.packageIds.map(id => { const p = getPackage(id); return `<span><img src="${p.image}" alt=""/>${escapeHtml(p.name)}</span>`; }).join("")}</div>` : `<b>${escapeHtml(l.url)}</b><small>URL đích</small>`}</td><td>${escapeHtml(l.province)}${l.ward ? `<small>${escapeHtml(l.ward)}</small>` : ""}</td><td>${escapeHtml(l.updated)}</td><td class="right">${actionButton("Xem", "open-link", l.id)} ${actionButton("✎", "edit-link", l.id, "primary")} ${actionButton("Sao chép", "copy-link", l.id)}</td></tr>`).join("");
    renderVoucherCatalog();
    switchTab(state.activeTab);
  }
  function renderVoucherCatalog() {
    const filter = $("#voucher-link-filter")?.value || "all";
    const remaining = { v50: 18, v100: 7, v150: 0, v200: 0 };
    const links = { v50: ["Tạo Menu cá nhân hóa", "Danh sách gói tổng hợp"], v100: ["Tạo Menu cá nhân hóa", "Internet Quận 7"], v150: ["Landing Page Ngoại Hạng Anh"], v200: [] };
    const allowed = filter === "all" ? vouchers : vouchers.filter(v => filter === "c2" ? ["v50","v100"].includes(v.id) : filter === "c3" ? v.id === "v50" : filter === "l1" ? v.id === "v100" : true);
    $("#voucher-catalog-grid").innerHTML = allowed.map(v => `<article class="voucher-card visual-voucher catalog ${v.state !== "active" || !remaining[v.id] ? "disabled" : ""}"><img src="${v.image}" alt=""/><span><b>${v.code}</b><strong>Giảm ${money(v.value)}</strong><small>${links[v.id].length ? `Đang áp dụng: ${links[v.id].join(" · ")}` : v.reason}</small></span><div class="voucher-availability"><b>${remaining[v.id]}</b><small>lượt có thể áp dụng</small></div></article>`).join("") || `<div class="empty-selection">Không có voucher phù hợp với Link AM đã chọn.</div>`;
  }
  function switchTab(tab) {
    state.activeTab = tab; save();
    $$("[data-tab]").forEach(x => x.classList.toggle("active", x.dataset.tab === tab));
    $$(".tab-panel").forEach(x => x.classList.toggle("active", x.id === `tab-${tab}`));
  }

  function renderCampaignConfig() {
    const c = state.campaigns.find(x => x.id === state.selectedCampaign) || state.campaigns[0];
    $("#config-title").textContent = `Cấu hình · ${c.name}`; $("#config-link-meta").textContent = `Campaign Link cá nhân · ${c.shortlink}`;
    c.products ||= []; c.vouchers ||= [];
    if (!campaignDraft || campaignDraft.id !== c.id) campaignDraft = { id: c.id, products: [...c.products], vouchers: [...c.vouchers], visibility: { Internet: c.visibility?.Internet ?? true, Combo: c.visibility?.Combo ?? true, Triple: c.visibility?.Triple ?? true }, bannerId: c.bannerId || "sports", bannerVisible: c.bannerVisible ?? true };
    $("#product-groups").innerHTML = ["Internet", "Combo", "Triple"].map((group, index) => {
      const groupPackages = packages.filter(p => p.group === group);
      const selected = groupPackages.filter(p => campaignDraft.products.includes(p.id));
      const available = groupPackages.filter(p => !campaignDraft.products.includes(p.id));
      return `<article class="card form-card product-group ${campaignDraft.visibility[group] ? "" : "group-off"}"><div class="card-head"><div><h2>${index + 2}. Cấu hình gói <span class="blue-text">${group}</span></h2><p>Khối hoạt động độc lập; tắt hiển thị không làm mất gói đã chọn</p></div><div class="group-status"><span>Hiển thị</span><label class="switch"><input data-group-toggle="${group}" type="checkbox" ${campaignDraft.visibility[group] ? "checked" : ""}/><span></span></label></div></div><div class="group-picker"><select data-campaign-add="${group}" ${selected.length >= 3 ? "disabled" : ""}><option value="">${selected.length >= 3 ? "Đã chọn đủ 3/3 gói" : "Chọn gói để thêm"}</option>${available.map(p => `<option value="${p.id}">${p.name} · ${money(p.price)}/tháng</option>`).join("")}</select><b>Đã chọn ${selected.length}/3 gói</b></div><div class="package-list selected-packages">${selected.map((p, order) => `<div class="package-row visual"><em>⋮⋮</em><img src="${p.image}" alt=""/><span><b>${order + 1}. ${p.name}</b><small>${p.speed}<br/>${money(p.price)}/tháng</small></span><div class="package-actions"><button type="button" class="icon-btn small" data-action="move-campaign-package-up" data-id="${p.id}" ${order === 0 ? "disabled" : ""}>↑</button><button type="button" class="icon-btn small" data-action="move-campaign-package-down" data-id="${p.id}" ${order === selected.length - 1 ? "disabled" : ""}>↓</button><button type="button" class="icon-btn small danger" data-action="remove-campaign-package" data-id="${p.id}">×</button></div></div>`).join("") || `<div class="empty-selection">Chưa chọn gói ${group}.</div>`}</div></article>`;
    }).join("");
    $("#voucher-list").innerHTML = vouchers.map(v => `<div class="voucher-card visual-voucher ${v.state !== "active" ? "disabled" : ""}"><img src="${v.image}" alt=""/><span><b>${v.code}</b><strong>Giảm ${money(v.value)}</strong><small>${v.state === "active" ? "Đang hiệu lực · Đúng phạm vi" : v.reason}</small></span><label class="switch"><input name="campaign-voucher" value="${v.id}" type="checkbox" ${campaignDraft.vouchers.includes(v.id) ? "checked" : ""} ${v.state !== "active" ? "disabled" : ""}/><span></span></label></div>`).join("");
    $("#voucher-master").checked = campaignDraft.vouchers.length > 0;
    const banner = banners[campaignDraft.bannerId]; $("#campaign-banner-preview img").src = banner.image; $("#campaign-banner-preview b").textContent = banner.title; $("#banner-name").textContent = banner.name; $("#banner-visible").checked = campaignDraft.bannerVisible; $$("#banner-options [data-banner]").forEach(x => x.classList.toggle("selected", x.dataset.banner === campaignDraft.bannerId));
    $$("[name='campaign-property-type']").forEach(x => x.checked = x.value === (c.propertyType || "Nhà mặt đất (Nhà riêng/Nhà phố)")); syncCampaignBuilding(); if (c.building) $("#campaign-building").value = c.building;
  }

  function renderCampaignDetail() {
    const c = state.campaigns.find(x => x.id === state.selectedCampaign) || state.campaigns[0];
    $("#campaign-detail-name").textContent = c.name;
    $("#campaign-detail-avatar").textContent = c.name.split(" ").slice(0, 2).map(x => x[0]).join("");
    $("#campaign-detail-shortlink").textContent = c.shortlink;
    $("#campaign-detail-shortlink").nextElementSibling.dataset.copy = c.shortlink;
    $("#campaign-detail-kpis").innerHTML = [["KHTN", "32.384"], ["KHTN được xử lí", "10.345"], ["Số hợp đồng", "12.480"], ["Tỷ lệ chuyển đổi", "12.8%"]].map(([label, value]) => `<article class="kpi-card"><span>${label} ⓘ</span><b>${value}</b></article>`).join("");
    const assigned = vouchers.map((v, i) => ({ ...v, remaining: [18, 7, 0, 0][i], note: ["Dùng tốt cho gói Internet", "Còn ít — ưu tiên khách phù hợp", "Không đủ hạn mức cá nhân", v.reason][i] }));
    $("#usable-voucher-count").textContent = `${assigned.filter(v => v.state === "active" && v.remaining > 0).length}/${assigned.length}`;
    $("#campaign-voucher-catalog").innerHTML = assigned.map(v => `<article class="voucher-card visual-voucher ${v.state !== "active" || !v.remaining ? "disabled" : ""}"><img src="${v.image}" alt=""/><span><b>${v.code}</b><strong>Giảm ${money(v.value)}</strong><small>${v.state === "active" ? v.note : v.reason}</small></span><div class="voucher-availability"><b>${v.remaining}</b><small>lượt có thể áp dụng</small></div></article>`).join("");
    const guide = campaignGuides[c.id] || campaignGuides.c1;
    $("#campaign-guide-title").textContent = `Mục tiêu & HDSD · ${c.name}`;
    $("#campaign-guide-purpose").textContent = guide.purpose;
    $("#campaign-guide-avoid").textContent = guide.avoid;
    $("#campaign-guide-steps").innerHTML = guide.steps.map((step, i) => `<li><b>Bước ${i + 1}:</b> ${escapeHtml(step)}</li>`).join("");
    $("#campaign-guide-pending").classList.toggle("hidden", !guide.pending);
    $("#campaign-guide-pending").textContent = guide.pending || "";
  }

  function validateCustomLink(name, rawUrl) {
    const trimmed = name.trim();
    if (trimmed.length < 5 || trimmed.length > 100) return "Tên link phải dài từ 5–100 ký tự.";
    if (state.customLinks.some(l => l.name.toLowerCase() === trimmed.toLowerCase())) return "Tên link đã tồn tại trong danh sách của bạn.";
    try {
      const u = new URL(rawUrl); const host = u.hostname.toLowerCase();
      if (u.protocol !== "https:" || !(host === "fpt.vn" || host.endsWith(".fpt.vn")) || u.username || u.password) return "URL phải dùng HTTPS, thuộc fpt.vn và không chứa thông tin đăng nhập.";
      if (!/(internet|combo|goi-cuoc|truyen-hinh|fpt\.vn\/?$)/i.test(u.pathname + u.hostname)) return "Trang đích chưa ánh xạ được ngành hàng hỗ trợ.";
      u.hash = ""; u.pathname = u.pathname.replace(/\/+$/, "") || "/"; return { url: u.toString() };
    } catch (_) { return "URL không đúng định dạng."; }
  }
  function renderAvatarPicker() {
    const colors = [["blue", "IQ"], ["orange", "AM"], ["green", "FT"], ["purple", "SP"]];
    $("#avatar-picker").innerHTML = colors.map((x, i) => `<button type="button" class="link-avatar ${x[0]} ${i === 0 ? "selected" : ""}" data-avatar="${x[0]}" data-initials="${x[1]}">${x[1]}</button>`).join("");
  }
  function renderLinkDetail() {
    const l = state.customLinks.find(x => x.id === state.selectedLink); if (!l) return;
    $("#detail-avatar").textContent = l.initials; $("#detail-avatar").className = `link-avatar large ${l.avatar}`; $("#detail-name").textContent = l.name;
    $("#detail-shortlink").textContent = l.shortlink; $("#detail-shortlink").nextElementSibling.dataset.copy = l.shortlink;
    $("#detail-location").textContent = l.province === "Chưa thiết lập" ? "Chưa thiết lập · Landing dùng catalog nguồn" : `${l.province}${l.ward ? ` · ${l.ward}` : ""}`;
    $("#package-count").textContent = l.packageIds.length ? `${l.packageIds.length} gói` : "Catalog nguồn";
    const shown = l.packageIds.length ? l.packageIds.map(getPackage) : packages.slice(0, 3);
    $("#detail-packages").innerHTML = l.packageIds.length ? shown.map(p => `<div class="package-row visual"><img src="${p.image}" alt=""/><span><b>${p.name}</b><small>${p.speed}<br/>${money(p.price)}/tháng</small></span>${badge("Tùy biến")}</div>`).join("") : "";
    $("#link-kpis").innerHTML = [["Click hợp lệ", l.clicks], ["Lead hợp lệ", l.leads], ["Đơn", l.orders], ["CR tạo đơn", `${(l.orders / Math.max(1, Math.round(l.clicks * .78)) * 100).toFixed(1)}%`]].map(x => `<article class="kpi-card"><span>${x[0]}</span><b>${x[1]}</b></article>`).join("");
  }
  function renderLinkEdit() {
    const l = state.customLinks.find(x => x.id === state.selectedLink); if (!l) return;
    $("#edit-link-name").value = l.name; $("#edit-link-url").value = l.url; $("#edit-province").value = l.province === "Chưa thiết lập" ? "TP. Hồ Chí Minh" : l.province;
    populateEditWards(l.ward); $$("[name='property-type']").forEach(x => x.checked = x.value === (l.propertyType || "Nhà mặt đất (Nhà riêng/Nhà phố)"));
    renderEditPackages(l);
  }
  const wardsByProvince = { "TP. Hồ Chí Minh": ["Phường Tân Phú", "Phường Bình Trị Đông", "Phường Tân Thuận", "Phường Bình Thạnh"], "Hà Nội": ["Phường Cầu Giấy", "Phường Tây Hồ", "Phường Hoàng Mai"] };
  const buildingsByWard = { "Phường Tân Phú": ["Sunrise City", "The Golden Star", "Hưng Phúc"], "Phường Bình Trị Đông": ["Akari City", "Moonlight Boulevard", "Lê Thành Twin Towers"], "Phường Tân Thuận": ["Vinhomes Golden River", "Eco Green Sài Gòn", "Sunshine City"], "Phường An Lạc": ["The Western Capital", "Imperial Place", "NBB Garden"], "Phường Bình Thạnh": ["Vinhomes Central Park", "Saigon Pearl", "The Manor"], "Phường Cầu Giấy": ["Vinhomes D\u0027Capitale", "Discovery Complex", "Indochina Plaza"], "Phường Tây Hồ": ["Sunshine Riverside", "D\u0027El Dorado", "Ciputra"], "Phường Hoàng Mai": ["Gamuda Gardens", "Times City", "The One Residence"] };
  function populateEditWards(selected = "") { const select = $("#edit-ward"), list = wardsByProvince[$("#edit-province").value] || []; select.innerHTML = list.map(w => `<option ${w === selected ? "selected" : ""}>${w}</option>`).join(""); }
  function syncCampaignBuilding() { const apartment = $("[name=campaign-property-type]:checked")?.value === "Căn hộ chung cư", field = $("#campaign-building-field"), select = $("#campaign-building"); field.classList.toggle("hidden", !apartment); select.required = apartment; if (apartment) { const list = buildingsByWard[$("#campaign-ward").value] || ["Chưa có chung cư phù hợp"]; select.innerHTML = `<option value="">Chọn chung cư</option>${list.map(x => `<option>${x}</option>`).join("")}`; } }
  function renderEditPackages(l) {
    const province = $("#edit-province").value;
    const isInvalid = p => province === "Hà Nội" && p.group === "Triple";
    $("#custom-package-counter").textContent = `${l.packageIds.length}/3 gói`;
    $("#product-catalog").innerHTML = packages.map(p => `<button type="button" class="product-choice ${l.packageIds.includes(p.id) ? "selected" : ""} ${isInvalid(p) ? "unavailable" : ""}" data-action="toggle-custom-package" data-id="${p.id}" ${isInvalid(p) && !l.packageIds.includes(p.id) ? "disabled" : ""}><img src="${p.image}" alt=""/><span><b>${p.name}</b><small>${isInvalid(p) ? "Chưa áp dụng tại Hà Nội" : p.speed}</small><strong>${money(p.price)}/tháng</strong></span><i>${l.packageIds.includes(p.id) ? "✓" : "+"}</i></button>`).join("");
    $("#edit-packages").innerHTML = l.packageIds.map((id, index) => { const p = getPackage(id); return `<div class="package-row visual ${isInvalid(p) ? "invalid-package" : ""}"><em>⋮⋮</em><img src="${p.image}" alt=""/><span><b>${index + 1}. ${p.name}</b><small>${isInvalid(p) ? "⚠ Không còn khả dụng tại location mới — hãy bỏ hoặc thay gói" : `${p.speed}<br/>${money(p.price)}/tháng`}</small></span><div class="package-actions"><button type="button" class="icon-btn small" data-action="move-custom-package-up" data-id="${id}" ${index === 0 ? "disabled" : ""}>↑</button><button type="button" class="icon-btn small" data-action="move-custom-package-down" data-id="${id}" ${index === l.packageIds.length - 1 ? "disabled" : ""}>↓</button><button type="button" class="icon-btn small danger" data-action="remove-custom-package" data-id="${id}">×</button></div></div>`; }).join("") || `<div class="info-callout">Chưa chọn gói tùy biến. Landing tiếp tục dùng catalog và giá của URL nguồn.</div>`;
  }

  function landingContext() {
    if (state.landing.type === "custom") {
      const l = state.customLinks.find(x => x.id === state.landing.id) || state.customLinks[0];
      return { name: l.name, packages: l.packageIds.length ? l.packageIds.map(getPackage) : packages.slice(0, 3), voucherIds: [], sourceType: "Custom Link", source: l.name, owner: "Nguyễn Thành Quang" };
    }
    const c = state.campaigns.find(x => x.id === state.landing.id) || state.campaigns.find(x => x.linked);
    return { name: c.name, packages: (c.products || []).map(getPackage), voucherIds: c.vouchers || [], sourceType: "Campaign Link", source: c.name, owner: "Nguyễn Thành Quang" };
  }
  function renderLanding() {
    const ctx = landingContext(); const list = ctx.packages.length ? ctx.packages : packages.slice(0, 3);
    $("#landing-packages").innerHTML = list.map(p => `<article class="landing-package"><img src="${p.image}" alt="${escapeHtml(p.name)}"/><span class="eyebrow">${p.group}</span><h3>${p.name}</h3><p>${p.speed}</p><b>${money(p.price)}<small>/tháng</small></b><ul><li>Thiết bị Wi-Fi thế hệ mới</li><li>Hỗ trợ tận nơi</li></ul><button class="btn primary" data-action="choose-package" data-id="${p.id}">Đăng ký gói này</button></article>`).join("");
    const valid = ctx.voucherIds.map(getVoucher).filter(v => v?.state === "active");
    $("#landing-vouchers").innerHTML = valid.length ? `<h2>Ưu đãi dành cho bạn</h2><div class="voucher-grid">${valid.map(v => `<div class="voucher-card"><b>${v.name}</b><strong>Giảm ${money(v.value)}</strong></div>`).join("")}</div>` : "";
  }
  function renderCheckout() {
    const ctx = landingContext(); const p = getPackage(state.landing.packageId || ctx.packages[0]?.id); state.landing.packageId = p.id;
    const available = ctx.voucherIds.map(getVoucher).filter(v => v?.state === "active" && v.value <= 100000);
    if (state.quotaMode === "error") {
      $("#checkout-vouchers").innerHTML = ""; $("#quota-note").textContent = "Ưu đãi tạm không khả dụng. Bạn vẫn có thể tiếp tục đăng ký."; state.selectedVoucher = null;
    } else if (!available.length || state.quotaMode === "none") {
      $("#checkout-vouchers").innerHTML = ""; $("#quota-note").textContent = "Hiện không có voucher đủ điều kiện. Đơn hàng vẫn có thể tiếp tục."; state.selectedVoucher = null;
    } else {
      if (!available.some(v => v.id === state.selectedVoucher)) state.selectedVoucher = available[0].id;
      $("#checkout-vouchers").innerHTML = available.map(v => `<label class="voucher-choice"><input type="radio" name="checkout-voucher" value="${v.id}" ${state.selectedVoucher === v.id ? "checked" : ""}/><span><b>${v.name}</b><small>Giảm ${money(v.value)}</small></span></label>`).join("");
      $("#quota-note").textContent = "Đã đối soát hạn mức qua API ngoài. Chỉ voucher đủ điều kiện được hiển thị.";
    }
    const discount = getVoucher(state.selectedVoucher)?.value || 0;
    $("#summary-package").innerHTML = `<b>${p.name}</b><p>${p.group} · Thanh toán hàng tháng</p>`; $("#base-price").textContent = money(p.price); $("#discount").textContent = `−${money(discount)}`; $("#total-price").textContent = money(Math.max(0, p.price - discount)); save();
  }

  function visibleOrders() { return state.role === "sales" ? state.orders.filter(o => o.owner === "Nguyễn Thành Quang") : state.orders; }
  function renderOrders() {
    const filter = $("#order-filter").value, query = $("#order-search").value.trim().toLowerCase();
    $("#order-table").innerHTML = visibleOrders().filter(o => (filter === "Tất cả" || o.status === filter) && `${o.id} ${o.phone}`.toLowerCase().includes(query)).map(o => `<tr><td><b>${o.id}</b>${o.suspect ? `<small class="danger">Nghi vấn AM/ECOM</small>` : ""}</td><td><b>${o.customer}</b><small>${o.phone}</small></td><td>${getPackage(o.packageId).name}<small>${o.sourceType} · ${o.source}</small></td><td>${o.created}</td><td>${badge(o.status)}</td><td class="right">${actionButton("Xem", "open-order", o.id)} ${o.suspect && state.role === "manager" ? actionButton("Tra soát", "dispute-order", o.id, "primary") : ""}</td></tr>`).join("");
  }
  function renderOrderDetail() {
    const o = state.orders.find(x => x.id === state.selectedOrder); if (!o) return;
    $("#order-detail-title").textContent = `Đơn ${o.id}`; $("#order-detail-source").textContent = `${o.sourceType} · ${o.source}`;
    const editable = ["Mới tạo", "Đang xác minh"].includes(o.status) && state.role === "sales";
    $("#edit-order-btn").disabled = !editable; $("#edit-order-btn").textContent = editable ? "✎ Chỉnh sửa đơn" : "🔒 Đơn không còn được sửa";
    const dl = $("#view-order-detail .detail-list"); dl.innerHTML = [["Khách hàng", o.customer], ["Số điện thoại", o.phone], ["Địa chỉ", o.address], ["Sản phẩm", `${getPackage(o.packageId).name} · ${money(getPackage(o.packageId).price)}/tháng`], ["Voucher", getVoucher(o.voucherId)?.name || "Không áp dụng"], ["Sales owner", o.owner]].map(x => `<div><dt>${x[0]}</dt><dd>${escapeHtml(x[1])}</dd></div>`).join("");
    const stages = ["Tạo đơn hàng", "Thanh toán", "Xuất hóa đơn", "Ký kết HĐPL", "Triển khai", "Hoàn tất đơn hàng"];
    const statusIndex = { "Mới tạo": 0, "Đang xác minh": 1, "Đã chốt lịch triển khai": 3, "Đang triển khai": 4, "Hoàn tất": 5, "Hủy": 0 }[o.status] ?? 0;
    $("#order-progress").innerHTML = stages.map((label, i) => `<div class="progress-step ${i < statusIndex ? "done" : i === statusIndex ? "active" : ""}"><i>${i < statusIndex ? "✓" : i + 1}</i><b>${label}</b><small>${i === 0 ? o.created : i === statusIndex ? o.status : "Chưa thực hiện"}</small></div>`).join("");
    $("#order-timeline").innerHTML = o.history.map(h => `<div class="timeline-item"><i></i><div><b>${h.label}</b><p>${h.at} · ${h.actor}</p></div></div>`).join("");
  }

  const disputeStates = ["Nháp", "Chờ tiếp nhận", "Đang xử lý", "Đã duyệt", "Từ chối", "Đã cập nhật ghi nhận", "Đã rút"];
  function renderDisputeSummary(selector) {
    const el = $(selector); if (!el) return;
    el.innerHTML = disputeStates.map(s => `<button data-dispute-filter="${s}"><span>${s}</span><b>${state.disputes.filter(d => d.status === s).length}</b></button>`).join("");
  }
  function renderDisputes(filter = "") {
    renderDisputeSummary("#dispute-filter-row");
    $("#create-dispute-btn").style.display = state.role === "manager" ? "" : "none";
    $("#dispute-table").innerHTML = state.disputes.filter(d => !filter || d.status === filter).map(d => `<tr><td><b>${d.id}</b></td><td>${d.orderId}</td><td>${d.sales}</td><td>${d.updated}</td><td>${badge(d.status)}</td><td class="right">${actionButton("Xem / xử lý", "open-dispute", d.id, d.status === "Nháp" ? "primary" : "secondary")}</td></tr>`).join("");
  }

  function disputeForm(orderId = "", draft = null) {
    return `<form id="dispute-form" class="config-stack"><input type="hidden" name="editId" value="${draft?.id || ""}"/><label>Mã đơn *<input name="orderId" required value="${escapeHtml(draft?.orderId || orderId)}" ${draft ? "readonly" : ""}/></label><label>Link AM *<input name="link" required value="fpt.vn/am/quangth11"/></label><label>Sales đề nghị ghi nhận *<input name="sales" required value="${escapeHtml(draft?.sales || "Nguyễn Thành Quang")}"/></label><label>Lý do *<textarea name="reason" required>${escapeHtml(draft?.reason || "Đơn phát sinh sau khi khách truy cập Link AM")}</textarea></label><label>Minh chứng *<input name="evidence" required value="${escapeHtml(draft?.evidence || "Ảnh chụp hội thoại và log truy cập")}"/></label><div class="modal-actions"><button class="btn secondary" name="intent" value="draft">Lưu nháp</button><button class="btn primary" name="intent" value="send">Gửi yêu cầu</button></div></form>`;
  }
  function openDispute(id) {
    const d = state.disputes.find(x => x.id === id); if (!d) return;
    let actions = "";
    if (state.role === "manager" && d.status === "Nháp") actions = `${actionButton("Sửa nháp", "edit-dispute", d.id)} ${actionButton("Xóa nháp", "delete-dispute", d.id)}`;
    if (state.role === "manager" && d.status === "Chờ tiếp nhận") actions = actionButton("Rút yêu cầu", "withdraw-dispute", d.id);
    if (state.role === "ops" && d.status === "Chờ tiếp nhận") actions = actionButton("Tiếp nhận", "accept-dispute", d.id, "primary");
    if (state.role === "ops" && d.status === "Đang xử lý") actions = `${actionButton("Từ chối", "reject-dispute", d.id)} ${actionButton("Duyệt", "approve-dispute", d.id, "primary")}`;
    if (state.role === "ops" && d.status === "Đã duyệt") actions = actionButton("Xác nhận đã cập nhật ghi nhận", "complete-dispute", d.id, "primary");
    openModal(`${d.id} · ${d.status}`, `${d.orderId} · ${d.sales}`, `<dl class="detail-list"><div><dt>Lý do</dt><dd>${escapeHtml(d.reason)}</dd></div><div><dt>Minh chứng</dt><dd>${escapeHtml(d.evidence)}</dd></div><div><dt>Người tạo</dt><dd>${escapeHtml(d.creator)}</dd></div></dl><h3>Lịch sử</h3><div class="timeline">${d.history.map(h => `<div class="timeline-item"><i></i><div>${escapeHtml(h)}</div></div>`).join("")}</div><div class="modal-actions">${actions}</div>`);
  }

  function renderView(view) {
    if (view === "dashboard") renderDashboard();
    if (view === "campaigns") renderCampaigns();
    if (view === "campaign-config") renderCampaignConfig();
    if (view === "campaign-detail") renderCampaignDetail();
    if (view === "custom-link-form") renderAvatarPicker();
    if (view === "custom-link-detail") renderLinkDetail();
    if (view === "custom-link-edit") renderLinkEdit();
    if (view === "landing") renderLanding();
    if (view === "checkout") renderCheckout();
  }

  function createCampaign(id) {
    const c = state.campaigns.find(x => x.id === id); if (!c || c.linked) return;
    c.linked = true; c.shortlink = `fpt.vn/am/quang-${c.id}`; c.products = ["giga", "sky"]; c.vouchers = ["v50"];
    state.landing = { type: "campaign", id: c.id, packageId: "giga" }; save(); renderCampaigns(); toast("Đã tạo Campaign Link cá nhân. Link sẽ giữ nguyên qua mọi lần chỉnh sửa."); navigate("landing");
  }
  function openCampaign(id) { state.landing = { type: "campaign", id, packageId: state.campaigns.find(c => c.id === id)?.products?.[0] || "giga" }; save(); navigate("landing"); }
  function selectLink(id, view) { state.selectedLink = id; save(); navigate(view); }

  document.addEventListener("click", e => {
    const nav = e.target.closest("[data-view]"); if (nav) return navigate(nav.dataset.view);
    const viewLink = e.target.closest("[data-view-link]"); if (viewLink) return navigate(viewLink.dataset.viewLink);
    const openTab = e.target.closest("[data-open-tab]"); if (openTab) { state.activeTab = openTab.dataset.openTab; save(); return navigate("campaigns"); }
    const back = e.target.closest("[data-back]"); if (back) return navigate(back.dataset.back);
    const tab = e.target.closest("[data-tab]"); if (tab) return switchTab(tab.dataset.tab);
    const copy = e.target.closest("[data-copy]"); if (copy) { navigator.clipboard?.writeText(copy.dataset.copy); return toast("Đã sao chép Shortlink."); }
    const avatar = e.target.closest("[data-avatar]"); if (avatar) { $$("[data-avatar]").forEach(x => x.classList.remove("selected")); avatar.classList.add("selected"); return; }
    const campaignSection = e.target.closest("[data-campaign-section]"); if (campaignSection) { $$("[data-campaign-section]").forEach(x => x.classList.toggle("active", x === campaignSection)); $$(".campaign-section").forEach(x => x.classList.toggle("active", x.id === `campaign-section-${campaignSection.dataset.campaignSection}`)); return; }
    const bannerChoice = e.target.closest("[data-banner]"); if (bannerChoice && campaignDraft) { campaignDraft.bannerId = bannerChoice.dataset.banner; return renderCampaignConfig(); }
    const action = e.target.closest("[data-action]"); if (!action) return;
    const id = action.dataset.id, name = action.dataset.action;
    if (name === "create-campaign") createCampaign(id);
    if (name === "open-campaign") openCampaign(id);
    if (name === "detail-campaign") { state.selectedCampaign = id; save(); navigate("campaign-detail"); }
    if (name === "config-campaign") { state.selectedCampaign = id; save(); navigate("campaign-config"); }
    if (name === "copy-campaign") { const c = state.campaigns.find(x => x.id === id); if (c?.shortlink) { navigator.clipboard?.writeText(c.shortlink); toast("Đã sao chép Campaign Link."); } }
    if (name === "guide-campaign") { state.selectedCampaign = id; save(); showGuide(id); }
    if (name === "open-guide-detail") { state.selectedCampaign = id; save(); closeModal(); navigate("campaign-detail"); setTimeout(() => document.querySelector('[data-campaign-section="guide"]')?.click(), 0); }
    if (name === "open-link") selectLink(id, "custom-link-detail");
    if (name === "edit-link") selectLink(id, "custom-link-edit");
    if (name === "copy-link") { const l = state.customLinks.find(x => x.id === id); if (l) { navigator.clipboard?.writeText(l.shortlink); toast("Đã sao chép Shortlink."); } }
    if (name === "toggle-custom-package") { const l = state.customLinks.find(x => x.id === state.selectedLink); if (!l) return; if (l.packageIds.includes(id)) l.packageIds = l.packageIds.filter(x => x !== id); else if (l.packageIds.length < 3) l.packageIds.push(id); else return toast("Custom Link chỉ được chọn tối đa 3 gói.", "error"); save(); renderEditPackages(l); }
    if (name === "choose-package") { state.landing.packageId = id; state.selectedVoucher = null; save(); navigate("checkout"); }
    if (name === "remove-custom-package") { const l = state.customLinks.find(x => x.id === state.selectedLink); l.packageIds = l.packageIds.filter(x => x !== id); save(); renderEditPackages(l); }
    if (name === "remove-campaign-package" && campaignDraft) { campaignDraft.products = campaignDraft.products.filter(x => x !== id); renderCampaignConfig(); }
    if (["move-custom-package-up", "move-custom-package-down"].includes(name)) { const l = state.customLinks.find(x => x.id === state.selectedLink); const from = l.packageIds.indexOf(id), to = from + (name.endsWith("up") ? -1 : 1); if (from >= 0 && to >= 0 && to < l.packageIds.length) [l.packageIds[from], l.packageIds[to]] = [l.packageIds[to], l.packageIds[from]]; save(); renderEditPackages(l); }
    if (["move-campaign-package-up", "move-campaign-package-down"].includes(name) && campaignDraft) { const group = getPackage(id).group, ordered = campaignDraft.products.filter(pid => getPackage(pid).group === group), fromGroup = ordered.indexOf(id), toGroup = fromGroup + (name.endsWith("up") ? -1 : 1), target = ordered[toGroup]; if (target) { const from = campaignDraft.products.indexOf(id), to = campaignDraft.products.indexOf(target); [campaignDraft.products[from], campaignDraft.products[to]] = [campaignDraft.products[to], campaignDraft.products[from]]; } renderCampaignConfig(); }
  });

  function transitionDispute(id, next, note = "") {
    const d = state.disputes.find(x => x.id === id); if (!d) return;
    d.status = next; d.updated = nowLabel(); d.history.push(`${state.role === "ops" ? "FTQ / DVKH" : "TPKD / FCM"}: ${next}${note ? ` · ${note}` : ""} · ${d.updated}`);
    if (next === "Đã cập nhật ghi nhận") { const o = state.orders.find(x => x.id === d.orderId); if (o) { o.sourceType = "Campaign Link"; o.suspect = false; o.history.push({ label: "Đã cập nhật ghi nhận ECOM → AM", at: d.updated, actor: "FTQ / DVKH" }); } }
    save(); closeModal(); renderDisputes(); toast(`Đã chuyển yêu cầu sang “${next}”.`);
  }

  $("#role-switch").addEventListener("change", e => { state.role = e.target.value; save(); applyRole(); renderView(state.view); toast(`Đã chuyển sang vai trò ${e.target.selectedOptions[0].text}.`); });
  $("#modal-close").addEventListener("click", closeModal); $("#modal-root").addEventListener("click", e => { if (e.target.id === "modal-root") closeModal(); });
  $("#refresh-btn").addEventListener("click", () => { renderDashboard(); toast("Đã làm mới dữ liệu lúc " + nowLabel()); });
  $("#period-filter").addEventListener("change", renderDashboard); $("#link-filter").addEventListener("change", renderDashboard);
  $("#campaign-search").addEventListener("input", renderCampaigns); $("#link-search").addEventListener("input", renderCampaigns);
  $("#voucher-link-filter").addEventListener("change", renderVoucherCatalog);
  $("#create-link-btn").addEventListener("click", () => { $("#custom-link-form").reset(); navigate("custom-link-form"); });
  $("#open-campaign-config").addEventListener("click", () => navigate("campaign-config"));
  $("#campaign-detail-open").addEventListener("click", () => openCampaign(state.selectedCampaign));
  $("#edit-custom-link").addEventListener("click", () => navigate("custom-link-edit"));
  $("#download-qr").addEventListener("click", () => toast("Đã tải mã QR mô phỏng.") );
  $("#scroll-packages").addEventListener("click", () => $("#landing-packages").scrollIntoView({ behavior: "smooth" }));
  $("#guide-btn").addEventListener("click", () => showGuide());
  $("#campaign-guide-open").addEventListener("click", () => showGuide(state.selectedCampaign));

  function showGuide(campaignId = "") {
    state.guideSeenVersion = 2; save();
    const c = state.campaigns.find(x => x.id === campaignId);
    if (!c) return openModal("Hướng dẫn Affiliate Marketing", "Chọn đúng loại Menu trước khi thiết lập", `<ol class="guide-steps"><li><b>Chọn đúng chiến dịch</b><p>Đọc mục tiêu và trường hợp không nên dùng ngay tại nút “? HDSD”.</p></li><li><b>Cấu hình đúng location</b><p>Gói, giá và chung cư được lọc theo khu vực đã chọn.</p></li><li><b>Kiểm tra voucher</b><p>Mở tab Voucher áp dụng để xem số lượt còn trước khi tư vấn.</p></li><li><b>Kiểm tra trước khi gửi</b><p>Mở Landing Page, kiểm tra thứ tự gói, banner và ưu đãi.</p></li></ol>`);
    const guide = campaignGuides[c.id] || campaignGuides.c1;
    openModal(`HDSD · ${c.name}`, "Đọc trước khi tạo hoặc chia sẻ Campaign Link", `<div class="guide-audience"><b>Mục tiêu</b><p>${escapeHtml(guide.purpose)}</p></div><div class="guide-warning"><b>Không dùng khi</b><p>${escapeHtml(guide.avoid)}</p></div><ol class="guide-steps">${guide.steps.map((step,i) => `<li><b>Bước ${i + 1}</b><p>${escapeHtml(step)}</p></li>`).join("")}</ol>${guide.pending ? `<div class="pending-note">${escapeHtml(guide.pending)}</div>` : ""}<button class="btn primary full" data-action="open-guide-detail" data-id="${c.id}">Mở chi tiết chiến dịch</button>`);
  }

  $("#campaign-config-form").addEventListener("submit", e => {
    e.preventDefault(); const c = state.campaigns.find(x => x.id === state.selectedCampaign);
    const selectedProducts = [...(campaignDraft?.products || [])];
    const invalidGroup = ["Internet", "Combo", "Triple"].find(g => selectedProducts.filter(id => getPackage(id).group === g).length > 3);
    const selectedVouchers = [...e.currentTarget.querySelectorAll('[name="campaign-voucher"]:checked')].map(x => x.value);
    if (invalidGroup || selectedVouchers.length > 4) return toast(invalidGroup ? `${invalidGroup} chỉ được chọn tối đa 3 gói.` : "Chỉ được bật tối đa 4 voucher.", "error");
    c.products = selectedProducts; c.vouchers = selectedVouchers; c.visibility = { ...campaignDraft.visibility }; c.bannerId = campaignDraft.bannerId; c.bannerVisible = campaignDraft.bannerVisible; c.propertyType = e.currentTarget.querySelector("[name='campaign-property-type']:checked")?.value || ""; c.building = c.propertyType === "Căn hộ chung cư" ? $("#campaign-building").value : ""; c.updated = nowLabel(); save(); campaignDraft = null; toast("Cấu hình chiến dịch thành công."); renderCampaignConfig();
  });
  $("#campaign-config-form").addEventListener("change", e => {
    if (!campaignDraft) return;
    if (e.target.matches("[data-campaign-add]")) { if (e.target.value) campaignDraft.products.push(e.target.value); return renderCampaignConfig(); }
    if (e.target.matches("[data-group-toggle]")) { campaignDraft.visibility[e.target.dataset.groupToggle] = e.target.checked; return renderCampaignConfig(); }
    if (e.target.name === "campaign-property-type" || e.target.id === "campaign-ward") syncCampaignBuilding();
    if (e.target.id === "banner-visible") { campaignDraft.bannerVisible = e.target.checked; }
    if (e.target.name === "campaign-voucher") { campaignDraft.vouchers = $$('#voucher-list [name="campaign-voucher"]:checked').map(x => x.value); if (!campaignDraft.vouchers.length) $("#voucher-master").checked = false; }
  });
  $("#voucher-master").addEventListener("change", e => { if (!campaignDraft) return; if (!e.target.checked) { campaignDraft.vouchers = []; return renderCampaignConfig(); } });

  $("#custom-link-form").addEventListener("submit", e => {
    e.preventDefault(); const name = $("#link-name").value, result = validateCustomLink(name, $("#destination-url").value); const box = $("#link-validation");
    box.classList.remove("hidden");
    if (typeof result === "string") { box.textContent = result; box.classList.add("error"); return; }
    box.classList.remove("error"); box.textContent = "URL hợp lệ. Đang tạo Shortlink và QR…";
    const selected = $("#avatar-picker .selected") || $("#avatar-picker [data-avatar]"); const slug = name.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);
    const l = { id: uid("link"), name: name.trim(), initials: selected.dataset.initials, avatar: selected.dataset.avatar, url: result.url, shortlink: `fpt.vn/s/${slug}-${Math.random().toString(36).slice(2,5)}`, province: "Chưa thiết lập", ward: "", propertyType: "", packageIds: [], created: "07/10/2026", updated: "07/10/2026", clicks: 0, leads: 0, orders: 0 };
    state.customLinks.unshift(l); state.selectedLink = l.id; save(); toast("Tạo Custom Link thành công."); navigate("custom-link-detail");
  });
  $("#edit-province").addEventListener("change", () => { const l = state.customLinks.find(x => x.id === state.selectedLink); populateEditWards(); if (l) { renderEditPackages(l); toast("Đã giữ các gói còn hợp lệ và đánh dấu gói cần xử lý."); } });
  $("#edit-ward").addEventListener("change", () => { const l = state.customLinks.find(x => x.id === state.selectedLink); if (l) renderEditPackages(l); });
  $("#custom-link-edit-form").addEventListener("submit", e => {
    e.preventDefault(); const l = state.customLinks.find(x => x.id === state.selectedLink), name = $("#edit-link-name").value.trim();
    if (name.length < 5 || name.length > 100 || state.customLinks.some(x => x.id !== l.id && x.name.toLowerCase() === name.toLowerCase())) return toast("Tên phải dài 5–100 ký tự và không trùng link khác.", "error");
    if ($("#edit-province").value === "Hà Nội" && l.packageIds.some(id => getPackage(id).group === "Triple")) return toast("Cần bỏ hoặc thay gói Triple không khả dụng trước khi lưu.", "error");
    l.name = name; l.province = $("#edit-province").value; l.ward = $("#edit-ward").value; l.propertyType = $("[name='property-type']:checked")?.value || ""; l.updated = "07/10/2026"; save(); toast("Đã lưu Custom Link; Shortlink và QR không thay đổi."); navigate("custom-link-detail");
  });

  $("#checkout-vouchers").addEventListener("change", e => { if (e.target.name === "checkout-voucher") { state.selectedVoucher = e.target.value; save(); renderCheckout(); } });
  $("#submit-order").addEventListener("click", () => {
    const form = $("#checkout-form"); if (!form.reportValidity()) return;
    openModal("Đăng ký đã được ghi nhận", "Mô phỏng điểm kiểm tra voucher của AM", `<div class="success-panel"><b>Thông tin đã được chuyển sang hệ thống xử lý đơn hàng.</b><p>Prototype AM dừng tại bước xác nhận điều kiện voucher; quản lý và chỉnh sửa đơn thuộc SOP nên không hiển thị trong phân hệ này.</p><button class="btn primary full" data-view-link="dashboard">Về Dashboard</button></div>`);
  });
  $("#modal-body").addEventListener("submit", e => {
    e.preventDefault(); const fd = new FormData(e.target);
    if (e.target.id === "dispute-form") {
      const orderId = fd.get("orderId"), editId = fd.get("editId");
      if (state.disputes.some(d => d.id !== editId && d.orderId === orderId && !["Từ chối", "Đã rút", "Đã cập nhật ghi nhận"].includes(d.status))) return toast("Đơn đã có một nháp hoặc yêu cầu đang mở.", "error");
      const intent = e.submitter?.value || "send", status = intent === "draft" ? "Nháp" : "Chờ tiếp nhận";
      if (editId) {
        const d = state.disputes.find(x => x.id === editId);
        d.sales = fd.get("sales"); d.reason = fd.get("reason"); d.evidence = fd.get("evidence"); d.status = status; d.updated = nowLabel(); d.history.push(`TPKD HCM 01: ${status === "Nháp" ? "Cập nhật nháp" : "Gửi yêu cầu"} · ${d.updated}`);
        save(); closeModal(); renderDisputes(); toast(status === "Nháp" ? "Đã cập nhật nháp." : "Đã gửi yêu cầu tra soát."); return;
      }
      const d = { id: `TS-${1000 + state.disputes.length + 1}`, orderId, sales: fd.get("sales"), reason: fd.get("reason"), evidence: fd.get("evidence"), status, creator: "TPKD HCM 01", updated: nowLabel(), history: [`TPKD HCM 01: ${status} · ${nowLabel()}`] };
      state.disputes.unshift(d); save(); closeModal(); renderDisputes(); toast(status === "Nháp" ? "Đã lưu nháp đầy đủ thông tin." : "Đã gửi yêu cầu tra soát.");
    }
    if (e.target.id === "reject-form") transitionDispute(fd.get("id"), "Từ chối", fd.get("reason"));
    if (e.target.id === "edit-order-form") {
      const o = state.orders.find(x => x.id === fd.get("id")); const before = `${o.phone} · ${o.address} · ${getPackage(o.packageId).name}`;
      o.phone = fd.get("phone"); o.address = fd.get("address"); o.packageId = fd.get("packageId"); const after = `${o.phone} · ${o.address} · ${getPackage(o.packageId).name}`;
      o.history.unshift({ label: `Cập nhật đơn (${fd.get("reason")}): ${before} → ${after}`, at: nowLabel(), actor: "Nguyễn Thành Quang" }); save(); closeModal(); renderOrderDetail(); toast("Đã lưu thay đổi, lý do và lịch sử đơn.");
    }
  });

  applyRole(); navigate(state.view || "dashboard");
  if (state.guideSeenVersion < 2) setTimeout(showGuide, 500);
})();
