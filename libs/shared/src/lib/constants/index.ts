export const PRISMA_ERROR_CODE = {
  RECORD_UPDATE_NOT_FOUND: 'P2025',
};

export const REDIS_KEY = {
  coinEthVnd: () => 'coin-eth-vnd',
  userBenefit: (userId: string) => `user-benefit::${userId}`,
  registerOtp: (email: string) => `register-otp::${email}`,
  invalidToken: (id: string) => `invalid-token::${id}`,
  tutorSpecializations: () => 'tutor-specializations',
  user: (id: string) => `user::${id}`,
};
