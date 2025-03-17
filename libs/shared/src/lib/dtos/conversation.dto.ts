export class CreateConversationDto {
  id!: string;
}

export class ConversationDto extends CreateConversationDto {
  tutorId!: string;
  studentId!: string;
}
