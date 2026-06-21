export function createSupabaseAuth(config) {
  const configured = Boolean(config.supabaseUrl && config.supabaseAnonKey);

  async function authRequest(path, body) {
    if (!configured) {
      const error = new Error("Supabase email authentication is not configured");
      error.statusCode = 503;
      throw error;
    }

    const response = await fetch(`${config.supabaseUrl}/auth/v1${path}`, {
      method: "POST",
      headers: {
        apikey: config.supabaseAnonKey,
        Authorization: `Bearer ${config.supabaseAnonKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.msg ?? payload.message ?? payload.error_description ?? "Email authentication failed");
      error.statusCode = response.status === 429 ? 429 : 401;
      throw error;
    }
    return payload;
  }

  return {
    configured,
    requestOtp(email) {
      return authRequest("/otp", { email, create_user: true });
    },
    async verifyOtp(email, token) {
      const result = await authRequest("/verify", { email, token, type: "email" });
      if (!result.user?.email || result.user.email.toLowerCase() !== email.toLowerCase()) {
        const error = new Error("Email verification failed");
        error.statusCode = 401;
        throw error;
      }
      return result;
    },
  };
}
