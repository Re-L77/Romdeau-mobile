import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Mail, Lock, Eye, EyeOff, Wifi, WifiOff } from "lucide-react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { useNetInfo } from "@react-native-community/netinfo";

export default function LoginScreen() {
  const { login } = useAuth();
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState("auditor@romdeau.com");
  const [password, setPassword] = useState("auditor123");
  const [showPassword, setShowPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email inválido";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);

    if (!success) {
      Alert.alert(
        "❌ Credenciales incorrectas",
        "Intenta con:\nEmail: auditor@romdeau.com\nContraseña: auditor123",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Offline Banner */}
        {!isOnline && (
          <View style={styles.offlineBanner}>
            <WifiOff size={20} color="#fff" />
            <Text style={styles.offlineText}>
              Sin Conexión - Conecta a internet
            </Text>
          </View>
        )}

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={["#334155", "#0f172a"]}
            style={styles.logoContainer}
          >
            <Text style={styles.logoEmoji}>📦</Text>
          </LinearGradient>

          <Text style={[styles.title, { color: colors.text }]}>
            Romdeau Audit
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sistema de Auditoría Móvil
          </Text>

          <View
            style={[
              styles.versionBadge,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <View style={styles.statusDot} />
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>
              Versión 1.0.0
            </Text>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Correo Electrónico
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: errors.email ? colors.error : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <Mail size={20} color={colors.textSecondary} />
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={email}
                onChangeText={setEmail}
                placeholder="tu.email@empresa.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.email}
              </Text>
            ) : null}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Contraseña
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: errors.password ? colors.error : colors.border,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <Lock size={20} color={colors.textSecondary} />
              </View>
              <TextInput
                style={[styles.input, { color: colors.text }]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.textSecondary} />
                ) : (
                  <Eye size={20} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.password}
              </Text>
            ) : null}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#334155", "#0f172a"]}
              style={styles.loginButtonGradient}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Demo credentials hint */}
          <View
            style={[
              styles.hintBox,
              { backgroundColor: colors.surfaceSecondary },
            ]}
          >
            <Text style={[styles.hintTitle, { color: colors.text }]}>
              Credenciales de prueba:
            </Text>
            <Text style={[styles.hintText, { color: colors.textSecondary }]}>
              Email: auditor@romdeau.com
            </Text>
            <Text style={[styles.hintText, { color: colors.textSecondary }]}>
              Contraseña: auditor123
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  offlineText: {
    color: "#fff",
    fontWeight: "600",
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  versionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  versionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
  },
  iconBox: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
    marginVertical: 4,
    borderRadius: 12,
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 16,
  },
  errorText: {
    fontSize: 12,
    marginLeft: 4,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonGradient: {
    paddingVertical: 18,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  hintBox: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  hintTitle: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    marginBottom: 2,
  },
});
