"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SmartButton } from "@/components/ui/SmartButton";
import { Member1ReactOpt } from "@/components/demos/Member1ReactOpt";
import { Member2NextArch } from "@/components/demos/Member2NextArch";
import { Member3VitalsSeo } from "@/components/demos/Member3VitalsSeo";
import { Member4TailwindSummary } from "@/components/demos/Member4TailwindSummary";

interface SlideInfo {
  codeFile: string;
  speakerNotes: string;
}

interface MemberSection {
  id: number;
  topic: string;
  slides: SlideInfo[];
}

const PRESENTATION_DATA: MemberSection[] = [
  {
    id: 1,
    topic: "Mở đầu & Tối ưu hóa Rendering trong React",
    slides: [
      {
        codeFile: "src/components/demos/Member1ReactOpt.tsx",
        speakerNotes:
          "3 điểm nghẽn chính của Frontend: tải và biên dịch nhiều JS, re-render dây chuyền trên Main Thread, và dung lượng CSS/tài nguyên tĩnh. Các số liệu trên slide đọc trực tiếp từ Resource Timing API của trình duyệt.",
      },
      {
        codeFile: "src/components/demos/Member1ReactOpt.tsx",
        speakerNotes:
          "Khi đặt state ô tìm kiếm ở Component Cha, mỗi phím gõ buộc bảng 1,500 dòng DOM thật bên dưới render lại. Khi tách state xuống IsolatedSearchInput (State Colocation), chỉ riêng ô input render và bảng đứng yên ở lần render = 1.",
      },
      {
        codeFile: "src/components/demos/Member1ReactOpt.tsx",
        speakerNotes:
          "Khi Cha bắt buộc giữ state, ta dùng useMemo để không lọc/sắp xếp lại 5,000 sản phẩm khi state phụ thay đổi, và kết hợp React.memo + useCallback cho component con.",
      },
      {
        codeFile: "src/components/demos/HeavyChartModal.tsx",
        speakerNotes:
          "Dùng React.lazy(() => import('./HeavyChartModal')) kết hợp <Suspense>. Khi bấm mở, trình duyệt mới tải thêm chunk chứa date-fns + zod và ghi nhận trực tiếp trong PerformanceResourceTiming.",
      },
      {
        codeFile: "src/components/demos/Member1ReactOpt.tsx",
        speakerNotes:
          "Đối chiếu code trước/sau khi tách state và biểu đồ các mẫu commit thật vừa thu thập ở Slide 2.",
      },
    ],
  },
  {
    id: 2,
    topic: "Tối ưu Kiến trúc & Luồng dữ liệu với Next.js",
    slides: [
      {
        codeFile: "src/app/rsc-demo/page.tsx & src/app/client-demo/page.tsx",
        speakerNotes:
          "So sánh 2 route thật cùng dùng date-fns và zod: /rsc-demo chạy trên Server Component nên không đóng gói 2 thư viện này xuống trình duyệt, còn /client-demo ('use client') phải tải toàn bộ xuống máy khách.",
      },
      {
        codeFile: "src/app/api/demo/slow/route.ts",
        speakerNotes:
          "Gửi 3 HTTP request thật tới /api/demo/slow (250ms, 350ms, 200ms). Gọi tuần tự mất tổng ~800ms; gọi song song bằng Promise.all hoàn tất theo request dài nhất (~350ms).",
      },
      {
        codeFile: "src/app/api/demo/stream/route.ts",
        speakerNotes:
          "Đọc ReadableStream thật từ /api/demo/stream: chế độ Streaming trả chunk đầu tiên ngay ở ~25ms rồi stream tiếp từng phần; chế độ Blocking phải đợi gần 1 giây mới nhận byte đầu tiên.",
      },
      {
        codeFile: "src/app/api/demo/cache/route.ts",
        speakerNotes:
          "Route /api/demo/cache dùng unstable_cache của Next.js: khi CACHE HIT chỉ mất ~0-2ms trên server; khi gọi POST revalidateTag('demo-isr-product'), cache bị xóa ngay và lần đọc kế tiếp dựng lại dữ liệu mới.",
      },
      {
        codeFile: "src/components/demos/Member2NextArch.tsx",
        speakerNotes:
          "Tổng hợp số đo thật từ Slide 1, 2 và 3 để đối chiếu toàn bộ luồng tải trang giữa CSR truyền thống và Next.js App Router.",
      },
    ],
  },
  {
    id: 3,
    topic: "Tối ưu Tài nguyên, Core Web Vitals & SEO với Next.js",
    slides: [
      {
        codeFile: "src/lib/vitals.ts",
        speakerNotes:
          "Đo trực tiếp LCP, INP và CLS của chính phiên trình duyệt đang mở bằng PerformanceObserver.",
      },
      {
        codeFile: "src/components/demos/Member3VitalsSeo.tsx",
        speakerNotes:
          "Khi ảnh nạp trễ mà không giữ khung tỷ lệ, khối nút bên dưới bị đẩy tụt xuống và PerformanceObserver('layout-shift') ghi nhận CLS > 0. Với next/image giữ sẵn khung cố định, CLS = 0.0000.",
      },
      {
        codeFile: "src/app/layout.tsx",
        speakerNotes:
          "Kiểm tra file font self-hosted do next/font đóng gói và thời điểm thực thi của /analytics-mock.js với strategy='lazyOnload'.",
      },
      {
        codeFile: "src/app/layout.tsx",
        speakerNotes:
          "Đọc trực tiếp các thẻ <title>, <meta> và Open Graph đang có thật trong document.head của trang do Next.js Metadata API sinh từ phía Server.",
      },
      {
        codeFile: "src/components/demos/Member3VitalsSeo.tsx",
        speakerNotes:
          "Fetch thật file /lab/hero-4k.jpg (~1.10 MB JPEG) và endpoint /_next/image?url=/lab/hero-4k.jpg&w=1200&q=75 để đọc kích thước byte và định dạng AVIF/WebP do Sharp nén.",
      },
    ],
  },
  {
    id: 4,
    topic: "Tối ưu Styling với Tailwind CSS & Tổng kết đo lường",
    slides: [
      {
        codeFile: "src/app/api/demo/css-stats/route.ts",
        speakerNotes:
          "Server đọc trực tiếp file CSS trong .next/static/css, đếm số rule CSS, kích thước raw và gzip, đồng thời quét số class token trong toàn bộ thư mục src/.",
      },
      {
        codeFile: "tailwind.config.ts",
        speakerNotes:
          "Mọi component tái sử dụng chung các utility class nguyên tử nên dung lượng CSS hầu như không phình to khi thêm màn hình mới.",
      },
      {
        codeFile: "src/lib/utils.ts & src/components/ui/SmartButton.tsx",
        speakerNotes:
          "Thử nghiệm trực tiếp hàm cn() = twMerge(clsx(...)) trên SmartButton: loại bỏ triệt để các class Tailwind bị trùng khi truyền className ghi đè.",
      },
      {
        codeFile: "src/lib/metrics-store.ts",
        speakerNotes:
          "Bảng tổng hợp lấy hoàn toàn từ các phép đo thật đã chạy trong phiên thuyết trình của cả 4 thành viên.",
      },
      {
        codeFile: "src/lib/utils.ts",
        speakerNotes:
          "Hiển thị code thật của hàm cn() cùng bảng kiểm toán toàn bộ tài nguyên JS, CSS, Font và Web Vitals của phiên trình duyệt hiện tại.",
      },
    ],
  },
];

export default function PresentationHomePage() {
  const [activeMemberIdx, setActiveMemberIdx] = useState(0);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rootStageRef = useRef<HTMLDivElement | null>(null);

  const currentMember = PRESENTATION_DATA[activeMemberIdx];
  const currentSlide = currentMember.slides[activeSlideIdx];
  const globalSlideNumber = activeMemberIdx * 5 + activeSlideIdx + 1;

  const goNextSlide = useCallback(() => {
    if (activeSlideIdx < currentMember.slides.length - 1) {
      setActiveSlideIdx((s) => s + 1);
    } else if (activeMemberIdx < PRESENTATION_DATA.length - 1) {
      setActiveMemberIdx((m) => m + 1);
      setActiveSlideIdx(0);
    }
  }, [activeMemberIdx, activeSlideIdx, currentMember.slides.length]);

  const goPrevSlide = useCallback(() => {
    if (activeSlideIdx > 0) {
      setActiveSlideIdx((s) => s - 1);
    } else if (activeMemberIdx > 0) {
      const prevMember = activeMemberIdx - 1;
      setActiveMemberIdx(prevMember);
      setActiveSlideIdx(PRESENTATION_DATA[prevMember].slides.length - 1);
    }
  }, [activeMemberIdx, activeSlideIdx]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else if (rootStageRef.current?.requestFullscreen) {
        await rootStageRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        setIsFullscreen((v) => !v);
      }
    } catch {
      setIsFullscreen((v) => !v);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight") {
        goNextSlide();
      } else if (e.key === "ArrowLeft") {
        goPrevSlide();
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNextSlide, goPrevSlide, toggleFullscreen]);

  return (
    <div
      ref={rootStageRef}
      className={`min-h-screen bg-neutral-950 text-neutral-100 flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 overflow-y-auto" : ""
      }`}
    >
      {/* ==================== THANH ĐIỀU KHIỂN CĂN GIỮA ==================== */}
      <header className="border-b border-neutral-800 bg-neutral-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-4 px-4 py-2.5">
          {/* Chọn Thành viên: Số 1 - 4 */}
          <div className="flex items-center gap-1">
            <span className="mr-1 font-mono text-xs font-bold text-neutral-300">
              Thành viên:
            </span>
            {PRESENTATION_DATA.map((member, idx) => {
              const isActive = activeMemberIdx === idx;
              return (
                <button
                  key={member.id}
                  type="button"
                  title={`Thành viên ${member.id}: ${member.topic}`}
                  onClick={() => {
                    setActiveMemberIdx(idx);
                    setActiveSlideIdx(0);
                  }}
                  className={`h-8 w-8 border font-mono text-xs font-bold ${
                    isActive
                      ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                      : "border-neutral-700 bg-neutral-950 text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  {member.id}
                </button>
              );
            })}
          </div>

          {/* Chọn Slide: Số 1 - 5 */}
          <div className="flex items-center gap-1">
            <span className="mr-1 font-mono text-xs font-bold text-neutral-300">Slide:</span>
            {currentMember.slides.map((_, sIdx) => {
              const selected = activeSlideIdx === sIdx;
              return (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => setActiveSlideIdx(sIdx)}
                  className={`h-8 w-8 border font-mono text-xs font-bold ${
                    selected
                      ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                      : "border-neutral-700 bg-neutral-950 text-neutral-300 hover:bg-neutral-800"
                  }`}
                >
                  {sIdx + 1}
                </button>
              );
            })}
          </div>

          {/* Điều hướng & Tiện ích */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-1.5 font-mono text-xs text-neutral-400">
              ({globalSlideNumber}/20)
            </span>

            <SmartButton
              variant="outline"
              size="sm"
              disabled={activeMemberIdx === 0 && activeSlideIdx === 0}
              onClick={goPrevSlide}
            >
              &larr; Trước
            </SmartButton>

            <SmartButton
              variant="outline"
              size="sm"
              disabled={
                activeMemberIdx === PRESENTATION_DATA.length - 1 &&
                activeSlideIdx === currentMember.slides.length - 1
              }
              onClick={goNextSlide}
            >
              Tiếp &rarr;
            </SmartButton>

            <Link
              href="/rsc-demo"
              className="inline-flex h-7 items-center border border-neutral-700 bg-neutral-950 px-2.5 text-xs font-medium text-neutral-200 hover:bg-neutral-800"
            >
              /rsc-demo
            </Link>

            <button
              type="button"
              onClick={() => setShowSpeakerNotes((prev) => !prev)}
              className={`h-7 border px-2.5 text-xs font-medium ${
                showSpeakerNotes
                  ? "border-neutral-100 bg-neutral-100 text-neutral-950"
                  : "border-neutral-700 bg-neutral-950 text-neutral-300 hover:bg-neutral-800"
              }`}
            >
              {showSpeakerNotes ? "Ẩn ghi chú" : "Ghi chú"}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="h-7 border border-neutral-300 bg-neutral-950 px-2.5 font-mono text-xs font-bold text-neutral-100 hover:bg-neutral-800"
              title="Phím tắt: F hoặc Esc"
            >
              {isFullscreen ? "[Thu nhỏ (Esc)]" : "[Toàn màn hình (F)]"}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== KHUNG SLIDE CĂN GIỮA MÀN HÌNH ==================== */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-6xl space-y-4">
          {activeMemberIdx === 0 && <Member1ReactOpt activeSlide={activeSlideIdx} />}
          {activeMemberIdx === 1 && <Member2NextArch activeSlide={activeSlideIdx} />}
          {activeMemberIdx === 2 && <Member3VitalsSeo activeSlide={activeSlideIdx} />}
          {activeMemberIdx === 3 && <Member4TailwindSummary activeSlide={activeSlideIdx} />}

          {showSpeakerNotes && (
            <div className="border border-neutral-700 bg-neutral-900 p-3.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-2 mb-2">
                <span className="font-bold text-neutral-100">
                  Ghi chú thuyết trình — Thành viên {currentMember.id} • Slide{" "}
                  {activeSlideIdx + 1}
                </span>
                <span className="border border-neutral-700 bg-neutral-950 px-2 py-0.5 font-mono text-neutral-300">
                  File code: {currentSlide.codeFile}
                </span>
              </div>
              <p className="text-neutral-300 leading-relaxed">{currentSlide.speakerNotes}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
