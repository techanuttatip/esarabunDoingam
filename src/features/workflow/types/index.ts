export interface WorkflowStep {
  id: string;
  order: number;
  roleCode: string;
  roleTitleTh: string;
  personName?: string;
  positionTh: string;
  isOptional: boolean;
  canApproveAndFinish: boolean;
  description: string;
}

export interface DepartmentWorkflowConfig {
  deptId: string;
  deptName: string;
  deptCode: string;
  governingExecutive: "MAYOR" | "DEPUTY_MAYOR_1" | "DEPUTY_MAYOR_2" | "PALAD";
  governingExecutiveName: string;
  hasDivisionHead: boolean;
  requiresDeputyPalad: boolean;
  finalSigner: "MAYOR" | "DEPUTY_MAYOR_1" | "DEPUTY_MAYOR_2";
  steps: WorkflowStep[];
}
