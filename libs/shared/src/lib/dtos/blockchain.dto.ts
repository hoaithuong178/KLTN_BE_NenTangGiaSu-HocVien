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
  schedules!: string[];
}

export class BenefitPackagePurchasedEvent {
  id!: string;
  userId!: string;
  benefitId!: string;
  amount!: number;
  quantity!: number;
  priceRate!: number;
}
