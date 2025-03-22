export class CreateContractEvent {
  contractId!: string;
  studentId!: string;
  tutorId!: string;
  classId!: string;
  startDate!: number;
  endDate!: number;
  depositAmount!: number;
  totalAmount!: number;
  feePerSession!: number;
  feePerHour!: number;
  totalFee!: number;
  grade!: string;
  subject!: string;
  mode!: boolean;
}
