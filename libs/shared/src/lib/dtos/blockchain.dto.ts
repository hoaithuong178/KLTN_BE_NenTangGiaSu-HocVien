import { Grade } from '.prisma/education-service';

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
  grade!: Grade;
  subject!: string;
  mode!: boolean;
}
