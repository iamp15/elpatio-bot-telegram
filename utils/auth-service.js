/**
 * Servicio de Autenticación Automática para el Bot
 * Maneja la renovación automática de tokens JWT cuando expiran
 */

const axios = require("axios");

class AuthService {
  constructor({ baseUrl, botEmail, botPassword, preToken = null }) {
    this.baseUrl = baseUrl;
    this.botEmail = botEmail;
    this.botPassword = botPassword;
    this.token = preToken;
    this.tokenExpiry = null;
    this.isRefreshing = false;
    this.refreshPromise = null;

    // Debug: mostrar la URL base que se está usando
    console.log(`🔍 [AUTH-SERVICE] Configurando cliente con baseURL: ${baseUrl}`);

    // Configurar cliente axios
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      // Para desarrollo local con HTTP, deshabilitar validación SSL si es necesario
      validateStatus: function (status) {
        return status < 500; // Resolver solo si el código de estado es menor que 500
      },
    });

    // Interceptor para manejar errores de autenticación
    this.setupInterceptors();

    // Si hay un token preexistente, configurar headers
    if (this.token) {
      this.setAuthHeader(this.token);
      this.parseTokenExpiry();
    }
  }

  /**
   * Configura interceptores para manejar automáticamente errores 401
   */
  setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Si es un error 401 y no hemos intentado renovar el token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Renovar token automáticamente
            await this.refreshToken();

            // Reintentar la petición original con el nuevo token
            originalRequest.headers["Authorization"] = `Bearer ${this.token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            console.error("❌ Error renovando token:", refreshError.message);
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtiene el token actual o hace login si no existe
   */
  async getToken() {
    if (this.isTokenValid()) {
      return this.token;
    }

    return this.refreshToken();
  }

  /**
   * Verifica si el token actual es válido
   */
  isTokenValid() {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }

    // Considerar el token como expirado 5 minutos antes de su expiración real
    const bufferTime = 5 * 60 * 1000; // 5 minutos en ms
    return Date.now() < this.tokenExpiry - bufferTime;
  }

  /**
   * Renueva el token usando credenciales
   */
  async refreshToken() {
    // Evitar múltiples renovaciones simultáneas
    if (this.isRefreshing) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performLogin();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  /**
   * Realiza el login con las credenciales del bot
   */
  async performLogin() {
    try {
      console.log("🔄 Renovando token de autenticación...");
      console.log(`🔍 [AUTH-SERVICE] Intentando login en: ${this.baseUrl}/api/admin/login`);

      const response = await this.client.post("/api/admin/login", {
        email: this.botEmail,
        password: this.botPassword,
      });

      this.token = response.data.token;
      this.setAuthHeader(this.token);
      this.parseTokenExpiry();

      console.log("✅ Token renovado exitosamente");
      return this.token;
    } catch (error) {
      console.error("❌ Error en login:", error.message);
      if (error.response?.data?.error) {
        throw new Error(`Error de autenticación: ${error.response.data.error}`);
      }
      throw new Error("No se pudo autenticar con el backend");
    }
  }

  /**
   * Configura el header de autorización
   */
  setAuthHeader(token) {
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Parsea la fecha de expiración del token JWT
   */
  parseTokenExpiry() {
    if (!this.token) {
      this.tokenExpiry = null;
      return;
    }

    try {
      const payload = JSON.parse(
        Buffer.from(this.token.split(".")[1], "base64").toString()
      );
      this.tokenExpiry = payload.exp * 1000; // Convertir a milisegundos

      const expiryDate = new Date(this.tokenExpiry);
      console.log(`📅 Token expira: ${expiryDate.toLocaleString("es-ES")}`);
    } catch (error) {
      console.warn(
        "⚠️ No se pudo parsear la expiración del token:",
        error.message
      );
      this.tokenExpiry = null;
    }
  }

  /**
   * Asegura que hay un token válido antes de hacer peticiones
   */
  async ensureValidToken() {
    if (!this.isTokenValid()) {
      await this.refreshToken();
    }
  }

  /**
   * Obtiene información del token actual
   */
  getTokenInfo() {
    if (!this.token) {
      return { valid: false, expiresAt: null, timeUntilExpiry: null };
    }

    const now = Date.now();
    const timeUntilExpiry = this.tokenExpiry ? this.tokenExpiry - now : null;

    return {
      valid: this.isTokenValid(),
      expiresAt: this.tokenExpiry ? new Date(this.tokenExpiry) : null,
      timeUntilExpiry: timeUntilExpiry,
      willExpireSoon: timeUntilExpiry && timeUntilExpiry < 10 * 60 * 1000, // 10 minutos
    };
  }

  /**
   * Invalida el token actual (útil para logout)
   */
  invalidateToken() {
    this.token = null;
    this.tokenExpiry = null;
    delete this.client.defaults.headers.common["Authorization"];
  }

  /**
   * Obtiene el cliente axios configurado
   */
  getClient() {
    return this.client;
  }
}

module.exports = AuthService;
