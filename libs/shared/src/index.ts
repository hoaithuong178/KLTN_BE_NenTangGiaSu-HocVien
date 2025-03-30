export * from './lib/dtos/auth.dto';
export * from './lib/dtos/blockchain.dto';
export * from './lib/dtos/class.dto';
export * from './lib/dtos/contract.dto';
export * from './lib/dtos/conversation.dto';
export * from './lib/dtos/message.dto';
export * from './lib/dtos/notification.dto';
export * from './lib/dtos/post.dto';
export * from './lib/dtos/rejectPost.dto';
export * from './lib/dtos/request.dto';
export * from './lib/dtos/subject.dto';
export * from './lib/dtos/timeSlot.dto';
export * from './lib/dtos/tutor.dto';
export * from './lib/dtos/user.dto';
export * from './lib/dtos/userProfile.dto';
export * from './lib/error';
export * from './lib/firebase/firebase.util';
export * from './lib/jwt.util';
export * from './lib/shared.module';

export interface BaseResponse<T> {
  statusCode: number;
  data: T;
}

export interface PaginatedResponse<T> extends BaseResponse<T> {
  pagination: {
    totalPages: number;
    totalItems: number;
    page: number;
    pageSize: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
