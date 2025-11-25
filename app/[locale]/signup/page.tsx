'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { PageLayout } from '../../../components/layout/PageLayout';
import { useAuth } from '../../../contexts/AuthContextBypass';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SignUpPageProps {
  params: Promise<{ locale: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = React.use(params);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { signUp, loading } = useAuth();
  const router = useRouter();

  const translations = {
    en: {
      createAccount: 'Create Account',
      joinCosmt: 'Join COSMT and start shopping',
      firstName: 'First Name',
      lastName: 'Last Name',
      firstNamePlaceholder: 'First name',
      lastNamePlaceholder: 'Last name',
      emailAddress: 'Email Address',
      enterEmail: 'Enter your email',
      phoneNumber: 'Phone Number',
      enterPhone: 'Enter your phone number',
      password: 'Password',
      createPassword: 'Create a password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Confirm your password',
      creatingAccount: 'Creating Account...',
      createAccountButton: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      signInHere: 'Sign in here',
      fillRequiredFields: 'Please fill in all required fields',
      passwordsDoNotMatch: 'Passwords do not match',
      passwordMinLength: 'Password must be at least 6 characters',
      registrationFailed: 'Registration failed. Please try again.',
    },
    ar: {
      createAccount: 'إنشاء حساب',
      joinCosmt: 'انضم إلى كوزمت وابدأ التسوق',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      firstNamePlaceholder: 'الاسم الأول',
      lastNamePlaceholder: 'الاسم الأخير',
      emailAddress: 'عنوان البريد الإلكتروني',
      enterEmail: 'أدخل بريدك الإلكتروني',
      phoneNumber: 'رقم الهاتف',
      enterPhone: 'أدخل رقم هاتفك',
      password: 'كلمة المرور',
      createPassword: 'أنشئ كلمة مرور',
      confirmPassword: 'تأكيد كلمة المرور',
      confirmPasswordPlaceholder: 'أكد كلمة المرور',
      creatingAccount: 'جاري إنشاء الحساب...',
      createAccountButton: 'إنشاء حساب',
      alreadyHaveAccount: 'هل لديك حساب بالفعل؟',
      signInHere: 'سجل الدخول هنا',
      fillRequiredFields: 'يرجى ملء جميع الحقول المطلوبة',
      passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
      passwordMinLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      registrationFailed: 'فشل التسجيل. يرجى المحاولة مرة أخرى.',
    },
    tr: {
      createAccount: 'Hesap Oluştur',
      joinCosmt: 'COSMT\'ye katılın ve alışverişe başlayın',
      firstName: 'Ad',
      lastName: 'Soyad',
      firstNamePlaceholder: 'Ad',
      lastNamePlaceholder: 'Soyad',
      emailAddress: 'E-posta Adresi',
      enterEmail: 'E-postanızı girin',
      phoneNumber: 'Telefon Numarası',
      enterPhone: 'Telefon numaranızı girin',
      password: 'Şifre',
      createPassword: 'Şifre oluşturun',
      confirmPassword: 'Şifreyi Onayla',
      confirmPasswordPlaceholder: 'Şifrenizi onaylayın',
      creatingAccount: 'Hesap Oluşturuluyor...',
      createAccountButton: 'Hesap Oluştur',
      alreadyHaveAccount: 'Zaten hesabınız var mı?',
      signInHere: 'Buradan giriş yapın',
      fillRequiredFields: 'Lütfen tüm gerekli alanları doldurun',
      passwordsDoNotMatch: 'Şifreler eşleşmiyor',
      passwordMinLength: 'Şifre en az 6 karakter olmalı',
      registrationFailed: 'Kayıt başarısız. Lütfen tekrar deneyin.',
    },
    de: {
      createAccount: 'Konto erstellen',
      joinCosmt: 'Treten Sie COSMT bei und beginnen Sie mit dem Einkaufen',
      firstName: 'Vorname',
      lastName: 'Nachname',
      firstNamePlaceholder: 'Vorname',
      lastNamePlaceholder: 'Nachname',
      emailAddress: 'E-Mail-Adresse',
      enterEmail: 'Geben Sie Ihre E-Mail ein',
      phoneNumber: 'Telefonnummer',
      enterPhone: 'Geben Sie Ihre Telefonnummer ein',
      password: 'Passwort',
      createPassword: 'Passwort erstellen',
      confirmPassword: 'Passwort bestätigen',
      confirmPasswordPlaceholder: 'Bestätigen Sie Ihr Passwort',
      creatingAccount: 'Konto wird erstellt...',
      createAccountButton: 'Konto erstellen',
      alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
      signInHere: 'Hier anmelden',
      fillRequiredFields: 'Bitte füllen Sie alle erforderlichen Felder aus',
      passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
      passwordMinLength: 'Passwort muss mindestens 6 Zeichen haben',
      registrationFailed: 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    },
    fr: {
      createAccount: 'Créer un compte',
      joinCosmt: 'Rejoignez COSMT et commencez à faire du shopping',
      firstName: 'Prénom',
      lastName: 'Nom de famille',
      firstNamePlaceholder: 'Prénom',
      lastNamePlaceholder: 'Nom de famille',
      emailAddress: 'Adresse e-mail',
      enterEmail: 'Entrez votre e-mail',
      phoneNumber: 'Numéro de téléphone',
      enterPhone: 'Entrez votre numéro de téléphone',
      password: 'Mot de passe',
      createPassword: 'Créer un mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Confirmez votre mot de passe',
      creatingAccount: 'Création du compte...',
      createAccountButton: 'Créer un compte',
      alreadyHaveAccount: 'Vous avez déjà un compte ?',
      signInHere: 'Connectez-vous ici',
      fillRequiredFields: 'Veuillez remplir tous les champs requis',
      passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
      passwordMinLength: 'Le mot de passe doit contenir au moins 6 caractères',
      registrationFailed: 'Échec de l\'inscription. Veuillez réessayer.',
    },
    es: {
      createAccount: 'Crear cuenta',
      joinCosmt: 'Únete a COSMT y comienza a comprar',
      firstName: 'Nombre',
      lastName: 'Apellido',
      firstNamePlaceholder: 'Nombre',
      lastNamePlaceholder: 'Apellido',
      emailAddress: 'Correo electrónico',
      enterEmail: 'Ingresa tu correo',
      phoneNumber: 'Número de teléfono',
      enterPhone: 'Ingresa tu número de teléfono',
      password: 'Contraseña',
      createPassword: 'Crear una contraseña',
      confirmPassword: 'Confirmar contraseña',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
      creatingAccount: 'Creando cuenta...',
      createAccountButton: 'Crear cuenta',
      alreadyHaveAccount: '¿Ya tienes una cuenta?',
      signInHere: 'Inicia sesión aquí',
      fillRequiredFields: 'Por favor completa todos los campos requeridos',
      passwordsDoNotMatch: 'Las contraseñas no coinciden',
      passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
      registrationFailed: 'Error en el registro. Por favor intenta de nuevo.',
    },
  };

  const t = translations[locale] || translations.en;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError(t.fillRequiredFields);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.passwordsDoNotMatch);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.passwordMinLength);
      return;
    }

    try {
      const { error } = await signUp(
        formData.email, 
        formData.password, 
        `${formData.firstName} ${formData.lastName}`
      );
      
      if (error) {
        setError(error.message || t.registrationFailed);
      } else {
        router.push(`/${locale}`);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(t.registrationFailed);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-sm mx-auto px-4">

          {/* Sign Up Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-cosmt-2xl font-bold text-gray-900 mb-2">{t.createAccount}</h1>
              <p className="text-cosmt-sm text-gray-600">{t.joinCosmt}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-cosmt-sm">
                  {error}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                    {t.firstName} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder={t.firstNamePlaceholder}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                    {t.lastName} *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder={t.lastNamePlaceholder}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  {t.emailAddress} *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.enterEmail}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  {t.phoneNumber}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.enterPhone}
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  {t.password} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t.createPassword}
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  {t.confirmPassword} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t.confirmPasswordPlaceholder}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                {loading ? t.creatingAccount : t.createAccountButton}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <p className="text-cosmt-sm text-gray-600">
                {t.alreadyHaveAccount}{' '}
                <Link
                  href={`/${locale}/signin`}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  {t.signInHere}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
