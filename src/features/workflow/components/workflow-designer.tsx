"use client";

import { useState } from "react";
import {
  GitBranch,
  Building,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  Plus,
  Trash2,
  Save,
  Shield,
  Clock,
  Sparkles,
  Sliders,
  ChevronDown,
  User,
  Users,
  Award,
  Layers,
  HelpCircle,
  Edit2,
  ArrowUp,
  ArrowDown,
  X,
  PlusCircle,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepartmentWorkflowConfig, WorkflowStep } from "../types";

export const initialDepartmentWorkflows: DepartmentWorkflowConfig[] = [
  {
    deptId: "dept-eng",
    deptName: "กองช่าง",
    deptCode: "ชร 52003",
    governingExecutive: "DEPUTY_MAYOR_2",
    governingExecutiveName: "นายสมเกียรติ พัฒนา (รองนายก อบต. คนที่ ๒ - กำกับกองช่าง)",
    hasDivisionHead: true,
    requiresDeputyPalad: true,
    finalSigner: "DEPUTY_MAYOR_2",
    steps: [
      {
        id: "step-1",
        order: 1,
        roleCode: "STAFF",
        roleTitleTh: "๑. เจ้าหน้าที่ผู้ปฏิบัติงาน (นายช่าง)",
        personName: "นายวุฒิไกร หน่อแก้ว",
        positionTh: "เจ้าพนักงานป้องกันและบรรเทาสาธารณภัย",
        isOptional: false,
        canApproveAndFinish: false,
        description: "สำรวจพื้นที่ จัดทำแผนเผชิญเหตุ และเสนอความเห็นเริ่มต้น",
      },
      {
        id: "step-2",
        order: 2,
        roleCode: "DIV_HEAD",
        roleTitleTh: "๒. หัวหน้าฝ่ายแบบแผนและก่อสร้าง",
        personName: "นายสมศักดิ์ หน่อคำ",
        positionTh: "หัวหน้าฝ่ายแบบแผนและก่อสร้าง",
        isOptional: false,
        canApproveAndFinish: false,
        description: "ตรวจสอบแบบแปลน รายการประมาณราคา และความถูกต้องตามหลักวิศวกรรม",
      },
      {
        id: "step-3",
        order: 3,
        roleCode: "DEPT_HEAD",
        roleTitleTh: "๓. ผู้อำนวยการกองช่าง",
        personName: "นายประเสริฐ ยิ่งยง",
        positionTh: "ผู้อำนวยการกองช่าง (นักบริหารงานช่าง ระดับกลาง)",
        isOptional: false,
        canApproveAndFinish: false,
        description: "พิจารณาเห็นชอบในฐานะหัวหน้าส่วนราชการ",
      },
      {
        id: "step-4",
        order: 4,
        roleCode: "DEPUTY_PALAD",
        roleTitleTh: "๔. รองปลัด อบต.",
        personName: "นางสาวศิริพร ใจบุญ",
        positionTh: "รองปลัดองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: true,
        canApproveAndFinish: false,
        description: "กลั่นกรองงานด้านโครงสร้างพื้นฐานและสาธารณูปโภค",
      },
      {
        id: "step-5",
        order: 5,
        roleCode: "PALAD",
        roleTitleTh: "๕. ปลัด อบต.",
        personName: "นายธีระยุทธ มงคลชัย",
        positionTh: "ปลัดองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: false,
        canApproveAndFinish: false,
        description: "กลั่นกรองและเสนอความเห็นต่อฝ่ายบริหาร",
      },
      {
        id: "step-6",
        order: 6,
        roleCode: "DEPUTY_MAYOR",
        roleTitleTh: "๖. รองนายก อบต. (คนที่ ๒ กำกับกองช่าง)",
        personName: "นายสมเกียรติ พัฒนา",
        positionTh: "รองนายกองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: false,
        canApproveAndFinish: true,
        description: "อนุมัติสั่งการตามอำนาจที่นายก อบต. มอบหมาย (จบที่ขั้นตอนนี้ในงานประจำ)",
      },
      {
        id: "step-7",
        order: 7,
        roleCode: "MAYOR",
        roleTitleTh: "๗. นายก อบต.",
        personName: "นายประสิทธิ์ มั่นคง",
        positionTh: "นายกองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: true,
        canApproveAndFinish: true,
        description: "ลงนามเฉพาะเรื่องงบประมาณเกิน ๑๐๐,๐๐๐ บาท หรือเรื่องตามนโยบายสำคัญ",
      },
    ],
  },
  {
    deptId: "dept-fin",
    deptName: "กองคลัง",
    deptCode: "ชร 52002",
    governingExecutive: "MAYOR",
    governingExecutiveName: "นายประสิทธิ์ มั่นคง (นายก อบต. กำกับดูแลโดยตรง)",
    hasDivisionHead: true,
    requiresDeputyPalad: false,
    finalSigner: "MAYOR",
    steps: [
      {
        id: "fin-1",
        order: 1,
        roleCode: "STAFF",
        roleTitleTh: "๑. เจ้าหน้าที่การเงินและบัญชี",
        personName: "นางสาวสมร กองเงิน",
        positionTh: "นักวิชาการเงินและบัญชีปฏิบัติการ",
        isOptional: false,
        canApproveAndFinish: false,
        description: "ตรวจสอบฎีกา งบประมาณ และระเบียบการเบิกจ่าย",
      },
      {
        id: "fin-2",
        order: 2,
        roleCode: "DIV_HEAD",
        roleTitleTh: "๒. หัวหน้าฝ่ายการเงินและงบประมาณ",
        personName: "นางนวลฉวี ทองคำ",
        positionTh: "หัวหน้าฝ่ายการเงินและบัญชี",
        isOptional: false,
        canApproveAndFinish: false,
        description: "ตรวจสอบยอดเงินคงเหลือและข้อบัญญัติงบประมาณ",
      },
      {
        id: "fin-3",
        order: 3,
        roleCode: "DEPT_HEAD",
        roleTitleTh: "๓. ผู้อำนวยการกองคลัง",
        personName: "นางวรรณา นามเงิน",
        positionTh: "ผู้อำนวยการกองคลัง (นักบริหารงานการคลัง)",
        isOptional: false,
        canApproveAndFinish: false,
        description: "เห็นชอบการเบิกจ่ายและรับรองความถูกต้อง",
      },
      {
        id: "fin-4",
        order: 4,
        roleCode: "PALAD",
        roleTitleTh: "๔. ปลัด อบต.",
        personName: "นายธีระยุทธ มงคลชัย",
        positionTh: "ปลัดองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: false,
        canApproveAndFinish: false,
        description: "กลั่นกรองและเสนออนุมัติสั่งจ่ายต่อนายก อบต.",
      },
      {
        id: "fin-5",
        order: 5,
        roleCode: "MAYOR",
        roleTitleTh: "๕. นายก อบต. (เข้าตรง ไม่ผ่านรองนายก)",
        personName: "นายประสิทธิ์ มั่นคง",
        positionTh: "นายกองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: false,
        canApproveAndFinish: true,
        description: "อนุมัติสั่งจ่ายเงินงบประมาณ (ผู้อนุมัติคนสุดท้าย)",
      },
    ],
  },
  {
    deptId: "dept-sec",
    deptName: "สำนักปลัด",
    deptCode: "ชร 52001",
    governingExecutive: "MAYOR",
    governingExecutiveName: "นายประสิทธิ์ มั่นคง (นายก อบต. กำกับดูแลโดยตรง)",
    hasDivisionHead: false,
    requiresDeputyPalad: false,
    finalSigner: "MAYOR",
    steps: [
      {
        id: "sec-1",
        order: 1,
        roleCode: "STAFF",
        roleTitleTh: "๑. นิติกร / เจ้าหน้าที่สารบรรณ",
        personName: "นายวิชาญ รักธรรม",
        positionTh: "นิติกรปฏิบัติการ",
        isOptional: false,
        canApproveAndFinish: false,
        description: "ตรวจทานข้อกฎหมายและระเบียบสารบรรณ",
      },
      {
        id: "sec-2",
        order: 2,
        roleCode: "DEPT_HEAD",
        roleTitleTh: "๒. หัวหน้าสำนักปลัด",
        personName: "นายสมศักดิ์ สุขใจ",
        positionTh: "หัวหน้าสำนักปลัด (นักบริหารงานทั่วไป)",
        isOptional: false,
        canApproveAndFinish: false,
        description: "พิจารณาความเห็นในฐานะหัวหน้าสำนักปลัด",
      },
      {
        id: "sec-3",
        order: 3,
        roleCode: "PALAD",
        roleTitleTh: "๓. ปลัด อบต.",
        personName: "นายธีระยุทธ มงคลชัย",
        positionTh: "ปลัดองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: false,
        canApproveAndFinish: false,
        description: "กลั่นกรองและนำเสนอต่อนายก อบต.",
      },
      {
        id: "sec-4",
        order: 4,
        roleCode: "MAYOR",
        roleTitleTh: "๔. นายก อบต.",
        personName: "นายประสิทธิ์ มั่นคง",
        positionTh: "นายกองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: false,
        canApproveAndFinish: true,
        description: "ลงนามอนุมัติ / ประกาศคำสั่ง อบต.",
      },
    ],
  },
  {
    deptId: "dept-edu",
    deptName: "กองการศึกษา ศาสนาและวัฒนธรรม",
    deptCode: "ชร 52004",
    governingExecutive: "DEPUTY_MAYOR_1",
    governingExecutiveName: "นางพิมพา ใจสว่าง (รองนายก อบต. คนที่ ๑ - กำกับกองการศึกษาฯ)",
    hasDivisionHead: false,
    requiresDeputyPalad: false,
    finalSigner: "DEPUTY_MAYOR_1",
    steps: [
      {
        id: "edu-1",
        order: 1,
        roleCode: "STAFF",
        roleTitleTh: "๑. นักวิชาการศึกษา",
        personName: "นางสาวสมหญิง นามครู",
        positionTh: "นักวิชาการศึกษาชำนาญการ",
        isOptional: false,
        canApproveAndFinish: false,
        description: "จัดทำโครงการสนับสนุนโรงเรียนและ ศพด.",
      },
      {
        id: "edu-2",
        order: 2,
        roleCode: "DEPT_HEAD",
        roleTitleTh: "๒. ผู้อำนวยการกองการศึกษาฯ",
        personName: "นายชูชีพ บัวงาม",
        positionTh: "ผู้อำนวยการกองการศึกษาฯ",
        isOptional: false,
        canApproveAndFinish: false,
        description: "เห็นชอบโครงการและแผนพัฒนาการศึกษา",
      },
      {
        id: "edu-3",
        order: 3,
        roleCode: "PALAD",
        roleTitleTh: "๓. ปลัด อบต.",
        personName: "นายธีระยุทธ มงคลชัย",
        positionTh: "ปลัดองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: false,
        canApproveAndFinish: false,
        description: "กลั่นกรองและเสนอรองนายกฯ ผู้กำกับ",
      },
      {
        id: "edu-4",
        order: 4,
        roleCode: "DEPUTY_MAYOR",
        roleTitleTh: "๔. รองนายก อบต. (คนที่ ๑ กำกับกองการศึกษา)",
        personName: "นางพิมพา ใจสว่าง",
        positionTh: "รองนายกองค์การบริหารส่วนตำบลดอยงาม",
        isOptional: false,
        canApproveAndFinish: true,
        description: "อนุมัติสั่งการตามที่นายกฯ มอบอำนาจ",
      },
    ],
  },
];

export function WorkflowDesigner() {
  const [workflows, setWorkflows] = useState<DepartmentWorkflowConfig[]>(initialDepartmentWorkflows);
  const [selectedDeptId, setSelectedDeptId] = useState<string>("dept-eng");
  const [isSaved, setIsSaved] = useState(false);

  // Edit Step Modal State
  const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);

  // Add Department Modal State
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");

  // New Step Form State
  const [newStepForm, setNewStepForm] = useState<Partial<WorkflowStep>>({
    roleTitleTh: "",
    personName: "",
    positionTh: "",
    description: "",
    isOptional: false,
    canApproveAndFinish: false,
  });

  const currentConfig = workflows.find((w) => w.deptId === selectedDeptId) || workflows[0];

  const handleUpdateGoverningExec = (execType: "MAYOR" | "DEPUTY_MAYOR_1" | "DEPUTY_MAYOR_2") => {
    let name = "";
    if (execType === "MAYOR") name = "นายประสิทธิ์ มั่นคง (นายก อบต. กำกับดูแลโดยตรง)";
    if (execType === "DEPUTY_MAYOR_1") name = "นางพิมพา ใจสว่าง (รองนายก อบต. คนที่ ๑)";
    if (execType === "DEPUTY_MAYOR_2") name = "นายสมเกียรติ พัฒนา (รองนายก อบต. คนที่ ๒)";

    setWorkflows((prev) =>
      prev.map((w) =>
        w.deptId === selectedDeptId
          ? {
              ...w,
              governingExecutive: execType,
              governingExecutiveName: name,
              finalSigner: execType === "MAYOR" ? "MAYOR" : execType,
            }
          : w
      )
    );
  };

  const handleToggleOptional = (stepId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.deptId !== selectedDeptId) return w;
        return {
          ...w,
          steps: w.steps.map((s) => (s.id === stepId ? { ...s, isOptional: !s.isOptional } : s)),
        };
      })
    );
  };

  const handleMoveStep = (stepIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? stepIndex - 1 : stepIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentConfig.steps.length) return;

    const updatedSteps = [...currentConfig.steps];
    const temp = updatedSteps[stepIndex];
    updatedSteps[stepIndex] = updatedSteps[targetIndex];
    updatedSteps[targetIndex] = temp;

    // Recalculate order numbers
    const reordered = updatedSteps.map((s, idx) => ({ ...s, order: idx + 1 }));

    setWorkflows((prev) =>
      prev.map((w) => (w.deptId === selectedDeptId ? { ...w, steps: reordered } : w))
    );
  };

  const handleDeleteStep = (stepId: string) => {
    if (!confirm("คุณต้องการลบขั้นตอนการเกษียนนี้ออกจากสายงานใช่หรือไม่?")) return;

    const updatedSteps = currentConfig.steps
      .filter((s) => s.id !== stepId)
      .map((s, idx) => ({ ...s, order: idx + 1 }));

    setWorkflows((prev) =>
      prev.map((w) => (w.deptId === selectedDeptId ? { ...w, steps: updatedSteps } : w))
    );
  };

  const handleSaveEditedStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStep) return;

    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.deptId !== selectedDeptId) return w;
        return {
          ...w,
          steps: w.steps.map((s) => (s.id === editingStep.id ? editingStep : s)),
        };
      })
    );

    setEditingStep(null);
  };

  const handleAddNewStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepForm.roleTitleTh) return;

    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      order: currentConfig.steps.length + 1,
      roleCode: "CUSTOM_ROLE",
      roleTitleTh: newStepForm.roleTitleTh || "ขั้นตอนใหม่",
      personName: newStepForm.personName || "",
      positionTh: newStepForm.positionTh || "",
      description: newStepForm.description || "ความเห็นและการพิจารณา",
      isOptional: !!newStepForm.isOptional,
      canApproveAndFinish: !!newStepForm.canApproveAndFinish,
    };

    setWorkflows((prev) =>
      prev.map((w) =>
        w.deptId === selectedDeptId ? { ...w, steps: [...w.steps, newStep] } : w
      )
    );

    setIsAddStepModalOpen(false);
    setNewStepForm({
      roleTitleTh: "",
      personName: "",
      positionTh: "",
      description: "",
      isOptional: false,
      canApproveAndFinish: false,
    });
  };

  const handleAddNewDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    const newDept: DepartmentWorkflowConfig = {
      deptId: `dept-${Date.now()}`,
      deptName: newDeptName.trim(),
      deptCode: newDeptCode.trim() || "ชร 52099",
      governingExecutive: "MAYOR",
      governingExecutiveName: "นายประสิทธิ์ มั่นคง (นายก อบต. กำกับดูแลโดยตรง)",
      hasDivisionHead: false,
      requiresDeputyPalad: false,
      finalSigner: "MAYOR",
      steps: [
        {
          id: `step-new-1`,
          order: 1,
          roleCode: "STAFF",
          roleTitleTh: "๑. เจ้าหน้าที่ผู้ปฏิบัติงาน",
          personName: "เจ้าหน้าที่ประจำกอง",
          positionTh: "นักวิชาการ/เจ้าพนักงาน",
          isOptional: false,
          canApproveAndFinish: false,
          description: "ตรวจสอบและจัดทำข้อเสนอความเห็น",
        },
        {
          id: `step-new-2`,
          order: 2,
          roleCode: "DEPT_HEAD",
          roleTitleTh: "๒. ผู้อำนวยการกอง",
          personName: "ผอ.กอง",
          positionTh: "ผู้อำนวยการกอง",
          isOptional: false,
          canApproveAndFinish: false,
          description: "พิจารณาเห็นชอบตามเสนอ",
        },
        {
          id: `step-new-3`,
          order: 3,
          roleCode: "PALAD",
          roleTitleTh: "๓. ปลัด อบต.",
          personName: "นายธีระยุทธ มงคลชัย",
          positionTh: "ปลัดองค์การบริหารส่วนตำบลดอยงาม",
          isOptional: false,
          canApproveAndFinish: false,
          description: "กลั่นกรองและนำเสนอนายก อบต.",
        },
        {
          id: `step-new-4`,
          order: 4,
          roleCode: "MAYOR",
          roleTitleTh: "๔. นายก อบต.",
          personName: "นายประสิทธิ์ มั่นคง",
          positionTh: "นายกองค์การบริหารส่วนตำบลดอยงาม",
          isOptional: false,
          canApproveAndFinish: true,
          description: "อนุมัติสั่งการ (ผู้อนุมัติคนสุดท้าย)",
        },
      ],
    };

    setWorkflows([...workflows, newDept]);
    setSelectedDeptId(newDept.deptId);
    setIsAddDeptModalOpen(false);
    setNewDeptName("");
    setNewDeptCode("");
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 bg-white/85 backdrop-blur-2xl border border-white/90 shadow-sm space-y-6">
      {/* Header & Save Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center border border-blue-200 shadow-2xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900">
                ระบบตั้งค่าและแก้ไขสายการเกษียนหนังสือรายกอง (Workflow Routing Studio)
              </h3>
              <p className="text-xs text-slate-500">
                Admin สามารถแก้ไข เพิ่ม ลบ หรือสลับตำแหน่งสายงานการเดินหนังสือของแต่ละกองได้อย่างอิสระ ๑๐๐%
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddDeptModalOpen(true)}
            className="h-10 text-xs rounded-2xl border-slate-300 text-slate-700 hover:bg-slate-100 gap-1.5 cursor-pointer font-bold"
          >
            <FolderPlus className="w-4 h-4 text-blue-600" />
            <span>+ เพิ่มกองงานใหม่</span>
          </Button>

          <Button
            size="lg"
            variant="signature"
            onClick={handleSave}
            className="gap-2 rounded-2xl shadow-accent hover:shadow-accent-lg cursor-pointer font-bold"
          >
            <Save className="w-4 h-4 text-amber-300" />
            <span>บันทึกการแก้ไขทั้งหมด</span>
          </Button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold text-xs">บันทึกผังสายการเกษียนของ {currentConfig.deptName} เรียบร้อยแล้ว</p>
            <p className="text-[11px] text-emerald-700">
              การเปลี่ยนแปลงนี้มีผลต่อหน้าเกษียนหนังสือและระบบแจ้งเตือนการส่งต่อทันที
            </p>
          </div>
        </div>
      )}

      {/* 1. Department Selector Tabs */}
      <div className="space-y-2">
        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
          เลือกสำนัก/กอง ที่ต้องการจัดการสายงาน :
        </span>
        <div className="flex flex-wrap gap-2">
          {workflows.map((dept) => (
            <button
              key={dept.deptId}
              onClick={() => setSelectedDeptId(dept.deptId)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedDeptId === dept.deptId
                  ? "bg-gradient-to-r from-[#0052FF] to-[#0284c7] text-white shadow-md font-black scale-[1.02]"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{dept.deptName}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                selectedDeptId === dept.deptId ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {dept.steps.length} ขั้น
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Executive Authority Assignment Card */}
      <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              ผู้บริหารที่ได้รับมอบหมายกำกับดูแลกองนี้ (Governing Executive) :
            </span>
            <p className="text-[11px] text-slate-500">
              ตามคำสั่ง อบต.ดอยงาม เรื่องการมอบหมายและมอบอำนาจให้รองนายก อบต. ปฏิบัติราชการแทน
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "MAYOR", label: "นายก อบต. กำกับเอง" },
              { id: "DEPUTY_MAYOR_1", label: "รองนายกฯ (คนที่ ๑)" },
              { id: "DEPUTY_MAYOR_2", label: "รองนายกฯ (คนที่ ๒)" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleUpdateGoverningExec(opt.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentConfig.governingExecutive === opt.id
                    ? "bg-slate-900 text-white shadow-xs font-black"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {currentConfig.governingExecutive === opt.id ? "✓ " : ""}{opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white border border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">คำสั่งปัจจุบัน:</span>
          <span className="font-bold text-blue-700">{currentConfig.governingExecutiveName}</span>
        </div>
      </div>

      {/* 3. Visual Workflow Timeline Sequence & Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              ลำดับสายการเกษียนหนังสือ (Sequential Routing Steps) :
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({currentConfig.steps.length} ลำดับชั้น)
            </span>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddStepModalOpen(true)}
            className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white gap-1.5 rounded-xl shadow-xs cursor-pointer font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ แทรกขั้นตอนใหม่</span>
          </Button>
        </div>

        <div className="space-y-3">
          {currentConfig.steps.map((step, idx) => (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                step.canApproveAndFinish
                  ? "bg-emerald-50/60 border-emerald-300 shadow-xs"
                  : step.isOptional
                  ? "bg-slate-50/50 border-dashed border-slate-300 opacity-80"
                  : "bg-white border-slate-200 hover:border-blue-300"
              }`}
            >
              {/* Step Info */}
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  step.canApproveAndFinish
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-blue-100 text-[#0052FF]"
                }`}>
                  {idx + 1}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{step.roleTitleTh}</span>
                    {step.personName && (
                      <span className="text-xs text-slate-600 font-medium">({step.personName})</span>
                    )}
                    {step.canApproveAndFinish && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ⭐ สิ้นสุดสายเกษียน / อนุมัติสั่งการ
                      </span>
                    )}
                    {step.isOptional && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                        (ขั้นตอนเสริม / ข้ามได้)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{step.description}</p>
                </div>
              </div>

              {/* Step Action Buttons (Edit, Up, Down, Delete) */}
              <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                <button
                  type="button"
                  title="เลื่อนขึ้น"
                  disabled={idx === 0}
                  onClick={() => handleMoveStep(idx, "up")}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  title="เลื่อนลง"
                  disabled={idx === currentConfig.steps.length - 1}
                  onClick={() => handleMoveStep(idx, "down")}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setEditingStep(step)}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>แก้ไข</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteStep(step.id)}
                  className="w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center cursor-pointer"
                  title="ลบขั้นตอนนี้"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: EDIT STEP MODAL
      ========================================================================= */}
      {editingStep && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-300" />
                <h3 className="font-extrabold text-sm">แก้ไขขั้นตอนการเกษียน</h3>
              </div>
              <button onClick={() => setEditingStep(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedStep} className="p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">ชื่อขั้นตอน / บทบาท :</label>
                <input
                  type="text"
                  value={editingStep.roleTitleTh}
                  onChange={(e) => setEditingStep({ ...editingStep, roleTitleTh: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ชื่อผู้ดำรงตำแหน่ง :</label>
                  <input
                    type="text"
                    value={editingStep.personName || ""}
                    onChange={(e) => setEditingStep({ ...editingStep, personName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ตำแหน่งทางราชการ :</label>
                  <input
                    type="text"
                    value={editingStep.positionTh}
                    onChange={(e) => setEditingStep({ ...editingStep, positionTh: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">หน้าที่ความรับผิดชอบ :</label>
                <textarea
                  rows={2}
                  value={editingStep.description}
                  onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStep.canApproveAndFinish}
                    onChange={(e) => setEditingStep({ ...editingStep, canApproveAndFinish: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-800">เป็นจุดสิ้นสุดสายงาน / มีอำนาจอนุมัติสั่งการจบเรื่อง</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStep.isOptional}
                    onChange={(e) => setEditingStep({ ...editingStep, isOptional: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className="font-medium text-slate-700">เป็นขั้นตอนเสริม (สามารถข้ามได้กรณีเรื่องด่วน)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingStep(null)} className="rounded-xl">
                  ยกเลิก
                </Button>
                <Button type="submit" variant="signature" className="rounded-xl font-bold">
                  บันทึกการแก้ไข
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ADD NEW STEP MODAL
      ========================================================================= */}
      {isAddStepModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-300" />
                <h3 className="font-extrabold text-sm">เพิ่มขั้นตอนการเกษียนใหม่</h3>
              </div>
              <button onClick={() => setIsAddStepModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewStep} className="p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">ชื่อขั้นตอน / บทบาท :</label>
                <input
                  type="text"
                  placeholder="เช่น หัวหน้าฝ่ายพัสดุ หรือ ที่ปรึกษานายก อบต."
                  value={newStepForm.roleTitleTh}
                  onChange={(e) => setNewStepForm({ ...newStepForm, roleTitleTh: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ชื่อผู้ดำรงตำแหน่ง :</label>
                  <input
                    type="text"
                    placeholder="เช่น นายชูศักดิ์ มั่นใจ"
                    value={newStepForm.personName}
                    onChange={(e) => setNewStepForm({ ...newStepForm, personName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">ตำแหน่งทางราชการ :</label>
                  <input
                    type="text"
                    placeholder="เช่น นักบริหารงานช่าง ระดับต้น"
                    value={newStepForm.positionTh}
                    onChange={(e) => setNewStepForm({ ...newStepForm, positionTh: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">หน้าที่ความรับผิดชอบ :</label>
                <textarea
                  rows={2}
                  placeholder="เช่น ตรวจสอบความถูกต้องของสัญญาและรายการจัดซื้อจัดจ้าง"
                  value={newStepForm.description}
                  onChange={(e) => setNewStepForm({ ...newStepForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newStepForm.canApproveAndFinish}
                    onChange={(e) => setNewStepForm({ ...newStepForm, canApproveAndFinish: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-800">เป็นจุดสิ้นสุดสายงาน / มีอำนาจอนุมัติสั่งการจบเรื่อง</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newStepForm.isOptional}
                    onChange={(e) => setNewStepForm({ ...newStepForm, isOptional: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span className="font-medium text-slate-700">เป็นขั้นตอนเสริม (สามารถข้ามได้)</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddStepModalOpen(false)} className="rounded-xl">
                  ยกเลิก
                </Button>
                <Button type="submit" variant="signature" className="rounded-xl font-bold">
                  + เพิ่มเข้าสู่สายงาน
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ADD NEW DEPARTMENT MODAL
      ========================================================================= */}
      {isAddDeptModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-navy-950 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-300" />
                <h3 className="font-extrabold text-sm">เพิ่มสำนัก/กองงานใหม่</h3>
              </div>
              <button onClick={() => setIsAddDeptModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewDept} className="p-6 space-y-4 text-xs font-sans">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">ชื่อสำนัก/กอง :</label>
                <input
                  type="text"
                  placeholder="เช่น กองสวัสดิการสังคม หรือ กองยุทธศาสตร์"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">รหัสหนังสือ (ถ้ามี) :</label>
                <input
                  type="text"
                  placeholder="เช่น ชร 52007"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDeptModalOpen(false)} className="rounded-xl">
                  ยกเลิก
                </Button>
                <Button type="submit" variant="signature" className="rounded-xl font-bold">
                  + บันทึกกองใหม่
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
