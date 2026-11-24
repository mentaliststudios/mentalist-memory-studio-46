/** Query keys for user-owned data. Every key starts with its resource and the owner's id. */
export const queryKeys = {
  profile: (userId: string) => ["profile", userId] as const,
  palaces: (userId: string) => ["palaces", userId] as const,
  activity: (userId: string) => ["activity", userId] as const,
};
