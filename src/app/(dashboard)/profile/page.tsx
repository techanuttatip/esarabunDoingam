"use client";

import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Lock,
  ShieldCheck,
  CheckCircle2,
  PenTool,
  KeyRound,
  Save,
  Upload,
  RotateCcw,
  Check,
  Trash2,
  Stamp,
  Award,
  Sparkles,
  Download,
} from "lucide-react";
import { useSession } from "@/components/providers/session-provider";
import { getActiveDepartments, DepartmentOption } from "@/lib/departments";

export default function ProfileAndSignaturePage() {
  const { data: session, updateProfile } = useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState<"signature" | "profile" | "certificate">("signature");

  // Dynamic Departments from Organization Setup
  const [availableDepartments, setAvailableDepartments] = useState<DepartmentOption[]>([]);

  // Profile Form State
  const [title, setTitle] = useState(
    user?.name?.startsWith("นางสาว")
      ? "นางสาว"
      : user?.name?.startsWith("นาง")
      ? "นาง"
      : user?.name?.startsWith("ว่าที่")
      ? "ว่าที่ ร.ต."
      : "นาย"
  );
  const [firstName, setFirstName] = useState(
    user?.firstName || user?.name?.replace(/^(นาย|นางสาว|นาง|ว่าที่ ร\.ต\.)\s*/, "").split(" ")[0] || "สมศักดิ์"
  );
  const [lastName, setLastName] = useState(
    user?.lastName || user?.name?.replace(/^(นาย|นางสาว|นาง|ว่าที่ ร\.ต\.)\s*/, "").split(" ")[1] || "สุขใจ"
  );
  const [position, setPosition] = useState(user?.position || "ปลัด อบต.ดอยงาม (Super Admin)");
  const [department, setDepartment] = useState(user?.department || "");
  const [email, setEmail] = useState(user?.email || "somsak.s@doigam.go.th");
  const [phone, setPhone] = useState(user?.phone || "081-999-8877");
  const [isProfileSaved, setIsProfileSaved] = useState(false);

  // Load available departments
  useEffect(() => {
    const depts = getActiveDepartments();
    setAvailableDepartments(depts);
    if (!department && depts.length > 0) {
      setDepartment(depts[0].name);
    }
  }, []);

  // Signature Studio State
  const [signatureMode, setSignatureMode] = useState<"draw" | "upload" | "font">("draw");
  const [penColor, setPenColor] = useState("#003399"); // Royal Thai Blue
  const [penWidth, setPenWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);
  const [isSignatureSaved, setIsSignatureSaved] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load existing signature on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSig = localStorage.getItem("smartsarabun_user_signature");
      if (savedSig) {
        setSignatureDataUrl(savedSig);
      }
    }
  }, []);

  // Canvas Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureDataUrl(canvas.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setSignatureDataUrl(null);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSignatureDataUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSignature = () => {
    if (signatureDataUrl && typeof window !== "undefined") {
      localStorage.setItem("smartsarabun_user_signature", signatureDataUrl);
    }
    setIsSignatureSaved(true);
    setTimeout(() => setIsSignatureSaved(false), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${title}${firstName} ${lastName}`.trim();
    updateProfile({
      name: fullName,
      firstName,
      lastName,
      position,
      department,
      email,
      phone,
    });
    setIsProfileSaved(true);
    setTimeout(() => setIsProfileSaved(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="ข้อมูลส่วนตัว & ลายมือชื่อดิจิทัล (Profile & Electronic Signature Studio)"
          description="จัดการข้อมูลประจำตัว ชื่อ-สกุล ตำแหน่ง สังกัดกองงาน และวาด/อัปโหลดลายมือชื่ออิเล็กทรอนิกส์สำหรับลงนาม"
        />

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("signature")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "signature"
                ? "bg-[#0052FF] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>✍️ ลายมือชื่อดิจิทัล (e-Signature)</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "profile"
                ? "bg-[#0052FF] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>👤 ข้อมูลส่วนตัว (Profile)</span>
          </button>

          <button
            onClick={() => setActiveTab("certificate")}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "certificate"
                ? "bg-[#0052FF] text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>🔏 ใบรับรองดิจิทัล</span>
          </button>
        </div>
      </div>

      {/* Success Alerts */}
      {isSignatureSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 flex items-center gap-3 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-extrabold text-xs">บันทึกลายมือชื่ออิเล็กทรอนิกส์เรียบร้อยแล้ว!</p>
            <p className="text-[11px] text-emerald-700">
              ลายเซ็นนี้จะถูกนำไปใช้ประทับลงในเอกสาร PDF และบันทึกเกษียนหนังสือราชการของท่านโดยอัตโนมัติ
            </p>
          </div>
        </div>
      )}

      {isProfileSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 flex items-center gap-3 animate-in fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-extrabold text-xs">บันทึกข้อมูลส่วนตัวสำเร็จ!</p>
            <p className="text-[11px] text-emerald-700">
              ชื่อ-สกุล และตำแหน่งใหม่ถูกอัปเดตที่มุมขวาบนของระบบ และในบันทึกเกษียนหนังสือเรียบร้อยแล้ว
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 1: ELECTRONIC SIGNATURE CANVAS STUDIO
      ========================================================================= */}
      {activeTab === "signature" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Cols: Drawing Canvas & Upload Studio */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="shadow-xs border-slate-200 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-[#0052FF]" />
                      กระดานวาดลายมือชื่ออิเล็กทรอนิกส์ (Digital Signature Pad)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      รองรับการวาดด้วยเมาส์, หน้าจอสัมผัส (Touchscreen) หรือปากกาสไตลัส
                    </CardDescription>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs">
                    <button
                      type="button"
                      onClick={() => setSignatureMode("draw")}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        signatureMode === "draw"
                          ? "bg-[#0052FF] text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      วาดลายเซ็น
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignatureMode("upload")}
                      className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                        signatureMode === "upload"
                          ? "bg-[#0052FF] text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      อัปโหลด PNG
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  {signatureMode === "draw" ? (
                    <div className="space-y-3">
                      {/* Pen Controls Toolbar */}
                      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-600 text-[11px]">สีหมึก:</span>
                          <button
                            type="button"
                            onClick={() => setPenColor("#003399")}
                            className={`w-6 h-6 rounded-full bg-[#003399] border-2 cursor-pointer transition-transform ${
                              penColor === "#003399" ? "scale-125 border-white ring-2 ring-[#003399]" : "border-transparent"
                            }`}
                            title="น้ำเงินราชการ"
                          />
                          <button
                            type="button"
                            onClick={() => setPenColor("#0052FF")}
                            className={`w-6 h-6 rounded-full bg-[#0052FF] border-2 cursor-pointer transition-transform ${
                              penColor === "#0052FF" ? "scale-125 border-white ring-2 ring-[#0052FF]" : "border-transparent"
                            }`}
                            title="น้ำเงินฟ้า"
                          />
                          <button
                            type="button"
                            onClick={() => setPenColor("#111827")}
                            className={`w-6 h-6 rounded-full bg-slate-900 border-2 cursor-pointer transition-transform ${
                              penColor === "#111827" ? "scale-125 border-white ring-2 ring-slate-900" : "border-transparent"
                            }`}
                            title="ดำหมึกเข้ม"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-600 text-[11px]">ขนาดเส้น:</span>
                          {[2, 3, 4].map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => setPenWidth(w)}
                              className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${
                                penWidth === w
                                  ? "bg-slate-900 text-white"
                                  : "bg-white text-slate-700 border border-slate-200"
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="px-2.5 py-1 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ล้างกระดาน</span>
                        </button>
                      </div>

                      {/* Interactive Canvas */}
                      <div className="border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/50 relative overflow-hidden shadow-inner flex items-center justify-center h-60 touch-none">
                        <canvas
                          ref={canvasRef}
                          width={480}
                          height={240}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="w-full h-full cursor-crosshair bg-transparent"
                        />
                        {!signatureDataUrl && (
                          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 space-y-1 select-none">
                            <PenTool className="w-8 h-8 opacity-40 animate-pulse" />
                            <span className="text-xs font-bold">จรดปลายปากกา หรือลากเมาส์เพื่อเซ็นชื่อที่นี่</span>
                            <span className="text-[10px] text-slate-400">(ระบบจะบันทึกเส้นลายมือชื่อแบบเวกเตอร์คมชัด)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Mode 2: Upload Transparent PNG */
                    <div className="border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-3 bg-slate-50/50">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center mx-auto shadow-2xs">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-slate-800">
                          อัปโหลดไฟล์รูปลายเซ็น (แนะนำพื้นหลังโปร่งใส Transparent PNG)
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          ไฟล์ภาพ PNG, JPG ขนาดไม่เกิน 5 MB
                        </p>
                      </div>
                      <label className="inline-block px-4 py-2 rounded-xl bg-[#0052FF] hover:bg-blue-600 text-white font-bold text-xs cursor-pointer shadow-md transition-all">
                        <span>เลือกไฟล์ภาพลายเซ็น</span>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={handleUploadImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}

                  {/* Save Signature Button */}
                  <Button
                    onClick={handleSaveSignature}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0052FF] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-black text-xs sm:text-sm gap-2 shadow-accent cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>บันทึกลายมือชื่อดิจิทัลนี้ลงในระบบ</span>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right 5 Cols: Real Official Document Signature Block Preview */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="shadow-xs border-slate-200 rounded-3xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                  <CardTitle className="text-xs font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                    <Stamp className="w-4 h-4 text-emerald-600" />
                    ตัวอย่างบล็อกลงนามจริงบนเอกสาร (Document Stamping Preview)
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className="p-6 rounded-2xl border-2 border-slate-200 bg-white shadow-md text-slate-900 font-serif space-y-3 relative overflow-hidden select-none">
                    <div className="text-right text-xs space-y-2">
                      <p className="font-sans text-slate-600 text-[11px]">ขอแสดงความนับถือ</p>

                      {/* Rendered Signature Area */}
                      <div className="h-16 flex items-center justify-end pr-4">
                        {signatureDataUrl ? (
                          <img
                            src={signatureDataUrl}
                            alt="ลายเซ็นดิจิทัล"
                            className="max-h-16 object-contain filter drop-shadow-xs"
                          />
                        ) : (
                          <div className="italic text-3xl font-bold text-blue-900 font-serif">
                            {title}{firstName} {lastName}
                          </div>
                        )}
                      </div>

                      {/* Official Name & Position */}
                      <div className="space-y-0.5 font-sans">
                        <p className="font-bold text-xs text-slate-900">
                          ({title}{firstName} {lastName})
                        </p>
                        <p className="text-[11px] text-slate-600">{position}</p>
                        <p className="text-[10px] text-slate-400">{department}</p>
                      </div>
                    </div>

                    {/* Digital Seal Watermark Badge */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[9px] font-mono text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        PAdES Certified
                      </span>
                      <span>SmartSarabun B.E. 2569</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 space-y-1">
                    <span className="font-bold block">💡 ข้อมูลการใช้งาน:</span>
                    <p className="leading-relaxed">
                      เมื่อท่านเปิดเอกสารตรวจเกษียนในหน้า <strong>Workspace</strong> ระบบจะดึงลายเซ็นนี้มาประทับลงในบันทึกเกษียนและการลงนามโดยอัตโนมัติ
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: USER PROFILE DETAILS FORM
      ========================================================================= */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-6 animate-in fade-in">
          {/* Identity Preview Card */}
          <div className="glass-card rounded-3xl p-6 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-sm flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0052FF] to-cyan-500 text-white flex items-center justify-center font-black text-2xl shadow-accent ring-4 ring-blue-100 shrink-0">
              {firstName.charAt(0)}
            </div>
            <div className="text-center sm:text-left flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg font-black text-slate-900">
                  {title}{firstName} {lastName}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-[#0052FF] px-2.5 py-0.5 rounded-full border border-blue-200">
                  {user?.roles?.[0] || "SUPER_ADMIN"}
                </span>
              </div>
              <p className="text-xs font-bold text-blue-700">{position}</p>
              <p className="text-[11px] text-slate-500">{department}</p>
            </div>
          </div>

          <Card className="shadow-xs border-slate-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#0052FF]" />
                แก้ไขข้อมูลส่วนตัวเจ้าหน้าที่ (Officer Profile Details)
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-5 text-xs">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700 block mb-1">คำนำหน้า :</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  >
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                    <option value="นาง">นาง</option>
                    <option value="ว่าที่ ร.ต.">ว่าที่ ร.ต.</option>
                    <option value="ดร.">ดร.</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <label className="font-bold text-slate-700 block mb-1">ชื่อจริง :</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>

                <div className="sm:col-span-5">
                  <label className="font-bold text-slate-700 block mb-1">นามสกุล :</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>
              </div>

              {/* Position & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">ตำแหน่งราชการ :</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 block">สังกัดสำนัก/กองงาน :</label>
                    <a
                      href="/organization"
                      className="text-[11px] text-[#0052FF] hover:underline font-bold"
                    >
                      + จัดการโครงสร้างกองงาน
                    </a>
                  </div>
                  {availableDepartments.length > 0 ? (
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-bold bg-white text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                    >
                      {availableDepartments.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name} {d.code ? `(${d.code})` : ""}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-1">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-slate-700 text-xs font-medium"
                      >
                        <option value="">(ยังไม่ได้สร้างกองงานในระบบ — กรุณาสร้างที่เมนูโครงสร้างองค์กร)</option>
                        {department && <option value={department}>{department}</option>}
                      </select>
                      <p className="text-[11px] text-amber-700">
                        * ยังไม่มีกองงาน กรุณาไปที่เมนู{" "}
                        <a href="/organization" className="underline font-bold text-[#0052FF]">
                          โครงสร้างองค์กร
                        </a>{" "}
                        เพื่อเพิ่มกอง/สำนัก
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">อีเมลราชการ :</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">เบอร์โทรศัพท์ติดต่อ :</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-slate-900 focus:ring-2 focus:ring-[#0052FF]"
                  />
                </div>
              </div>

              {/* Submit Save Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#0052FF] hover:bg-blue-600 text-white font-black text-xs gap-1.5 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกการเปลี่ยนแปลงข้อมูลส่วนตัว</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      )}

      {/* =========================================================================
          TAB 3: PERSONAL DIGITAL CERTIFICATE & E-SEAL
      ========================================================================= */}
      {activeTab === "certificate" && (
        <div className="space-y-6 animate-in fade-in">
          <Card className="shadow-xs border-slate-200 rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <CardTitle className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                ใบรับรองดิจิทัลส่วนบุคคล (Personal CA Digital Certificate)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                ใบรับรองอิเล็กทรอนิกส์มาตรฐาน ETSI PAdES สำหรับลงนามกำกับเอกสารราชการ
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950">สถานะใบรับรอง :</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-mono text-[10px] font-black">
                      ACTIVE & VALID
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-emerald-900 font-mono">
                    <p>ผู้ออกใบรับรอง: <strong>Thai National CA (สพธอ. ETDA)</strong></p>
                    <p>อัลกอริทึม: <strong>RSA 4096-bit (SHA-256)</strong></p>
                    <p>วันที่หมดอายุ: <strong>31 ธันวาคม พ.ศ. 2570</strong></p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <span className="font-bold text-blue-950 block">ตราประทับอิเล็กทรอนิกส์ (e-Seal) :</span>
                  <div className="space-y-1 text-[11px] text-blue-900">
                    <p>หน่วยงาน: <strong>องค์การบริหารส่วนตำบลดอยงาม</strong></p>
                    <p>รหัสหน่วยงาน: <strong>DOIGAM-SAO (ชร 52001)</strong></p>
                    <p>การใช้งาน: <strong>ผูกกับลายมือชื่อดิจิทัลอัตโนมัติ</strong></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
