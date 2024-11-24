export const config = {
    port: process.env.OIU_PORT || 3000,
    uploadFolder: process.env.OIU_UPLOADS_FOLDER || 'uploads',
    uploadSecretValue: process.env.OIU_UPLOAD_SECRET || 'aaaaCVPOaaasdfsdfUUUUiodsfkndf@11111',
    rl_window_minutes: process.env.OIU_RL_WINDOW_MINUTES || 3,
    rl_requests_in_window: process.env.OIU_RL_REQUESTS_IN_WINDOW || 20,
    rl_number_of_proxies: process.env.OIU_RL_NUMBER_OF_PROXIES || 2
}