'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { PageLayout } from '../../../components/layout/PageLayout';
import { useAuth } from '../../../contexts/AuthContextBypass';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SignInPageProps {
  params: Promise<{ locale: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SignInPage({ params }: SignInPageProps) {
  const { locale } = React.use(params);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { signIn, loading, user, isAdmin } = useAuth();
  const router = useRouter();

  const translations = {
    en: {
      welcomeBack: 'Welcome Back',
      signInToAccount: 'Sign in to your account',
      emailAddress: 'Email Address',
      enterEmail: 'Enter your email',
      password: 'Password',
      enterPassword: 'Enter your password',
      signingIn: 'Signing In...',
      signIn: 'Sign In',
      forgotPassword: 'Forgot your password?',
      noAccount: 'Don\'t have an account?',
      createAccount: 'Create one here',
      fillAllFields: 'Please fill in all fields',
      invalidCredentials: 'Invalid email or password',
      loginFailed: 'Login failed. Please try again.',
    },
    ar: {
      welcomeBack: 'مرحباً بعودتك',
      signInToAccount: 'سجل الدخول إلى حسابك',
      emailAddress: 'عنوان البريد الإلكتروني',
      enterEmail: 'أدخل بريدك الإلكتروني',
      password: 'كلمة المرور',
      enterPassword: 'أدخل كلمة المرور',
      signingIn: 'جاري تسجيل الدخول...',
      signIn: 'تسجيل الدخول',
      forgotPassword: 'نسيت كلمة المرور؟',
      noAccount: 'ليس لديك حساب؟',
      createAccount: 'أنشئ واحداً هنا',
      fillAllFields: 'يرجى ملء جميع الحقول',
      invalidCredentials: 'بريد إلكتروني أو كلمة مرور غير صحيحة',
      loginFailed: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    },
    tr: {
      welcomeBack: 'Tekrar Hoş Geldiniz',
      signInToAccount: 'Hesabınıza giriş yapın',
      emailAddress: 'E-posta Adresi',
      enterEmail: 'E-postanızı girin',
      password: 'Şifre',
      enterPassword: 'Şifrenizi girin',
      signingIn: 'Giriş Yapılıyor...',
      signIn: 'Giriş Yap',
      forgotPassword: 'Şifrenizi mi unuttunuz?',
      noAccount: 'Hesabınız yok mu?',
      createAccount: 'Buradan oluşturun',
      fillAllFields: 'Lütfen tüm alanları doldurun',
      invalidCredentials: 'Geçersiz e-posta veya şifre',
      loginFailed: 'Giriş başarısız. Lütfen tekrar deneyin.',
    },
    de: {
      welcomeBack: 'Willkommen zurück',
      signInToAccount: 'Melden Sie sich in Ihrem Konto an',
      emailAddress: 'E-Mail-Adresse',
      enterEmail: 'Geben Sie Ihre E-Mail ein',
      password: 'Passwort',
      enterPassword: 'Geben Sie Ihr Passwort ein',
      signingIn: 'Anmeldung läuft...',
      signIn: 'Anmelden',
      forgotPassword: 'Passwort vergessen?',
      noAccount: 'Haben Sie kein Konto?',
      createAccount: 'Hier erstellen',
      fillAllFields: 'Bitte füllen Sie alle Felder aus',
      invalidCredentials: 'Ungültige E-Mail oder Passwort',
      loginFailed: 'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    },
    fr: {
      welcomeBack: 'Bon retour',
      signInToAccount: 'Connectez-vous à votre compte',
      emailAddress: 'Adresse e-mail',
      enterEmail: 'Entrez votre e-mail',
      password: 'Mot de passe',
      enterPassword: 'Entrez votre mot de passe',
      signingIn: 'Connexion en cours...',
      signIn: 'Se connecter',
      forgotPassword: 'Mot de passe oublié ?',
      noAccount: 'Vous n\'avez pas de compte ?',
      createAccount: 'Créez-en un ici',
      fillAllFields: 'Veuillez remplir tous les champs',
      invalidCredentials: 'E-mail ou mot de passe invalide',
      loginFailed: 'Échec de la connexion. Veuillez réessayer.',
    },
    es: {
      welcomeBack: 'Bienvenido de nuevo',
      signInToAccount: 'Inicia sesión en tu cuenta',
      emailAddress: 'Correo electrónico',
      enterEmail: 'Ingresa tu correo',
      password: 'Contraseña',
      enterPassword: 'Ingresa tu contraseña',
      signingIn: 'Iniciando sesión...',
      signIn: 'Iniciar sesión',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta?',
      createAccount: 'Crea una aquí',
      fillAllFields: 'Por favor completa todos los campos',
      invalidCredentials: 'Correo o contraseña inválidos',
      loginFailed: 'Error al iniciar sesión. Por favor intenta de nuevo.',
    },
  };

  const t = translations[locale] || translations.en;

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push(`/${locale}`);
      }
    }
  }, [user, loading, isAdmin, router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(t.fillAllFields);
      return;
    }

    try {
      console.log('Attempting to sign in with:', email);
      const { error } = await signIn(email, password);
      console.log('Sign in result:', { error });
      
      if (error) {
        console.error('Sign in error:', error);
        setError(error.message || t.invalidCredentials);
      } else {
        console.log('Sign in successful, redirecting...');
        // The useEffect will handle the redirect based on user role
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(t.loginFailed);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-sm mx-auto px-4">
          {/* Sign In Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-cosmt-2xl font-bold text-gray-900 mb-2">{t.welcomeBack}</h1>
              <p className="text-cosmt-sm text-gray-600">{t.signInToAccount}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-cosmt-sm">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  {t.emailAddress}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.enterEmail}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  {t.password}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.enterPassword}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? t.signingIn : t.signIn}
              </Button>

              {/* Forgot Password */}
              <div className="text-center">
                <button
                  type="button"
                  className="text-cosmt-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {t.forgotPassword}
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-cosmt-sm text-gray-600">
                {t.noAccount}{' '}
                <Link
                  href={`/${locale}/signup`}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {t.createAccount}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
