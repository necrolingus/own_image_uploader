export const config = {
    port: process.env.OIU_PORT || 3000,
    uploadFolder: 'uploads',
    uploadSecretValue: process.env.OIU_UPLOAD_SECRET,
    deleteAfterDays: process.env.OIU_DELETE_AFTER_DAYS || 30,
    rl_window_minutes: process.env.OIU_RL_WINDOW_MINUTES || 3,
    rl_requests_in_window: process.env.OIU_RL_REQUESTS_IN_WINDOW || 20,
    rl_number_of_proxies: process.env.OIU_RL_NUMBER_OF_PROXIES || 2
}