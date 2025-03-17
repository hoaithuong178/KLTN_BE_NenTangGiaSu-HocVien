export const generateConversationId = (
  senderId: string,
  receiverId: string
) => {
  const sortedIds = [senderId, receiverId].sort((a, b) => a.localeCompare(b));

  return `${sortedIds[0]}_${sortedIds[1]}`;
};

export const getReceiverId = (conversationId: string, senderId: string) => {
  const userIds = conversationId.split('_');

  return userIds.find((id) => id !== senderId);
};
