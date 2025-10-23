'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageLayout } from '../../../../components/layout/PageLayout';
import { Button } from '../../../../components/ui/Button';
import { CheckCircle, ArrowLeft, Package, Mail } from 'lucide-react';
import Link from 'next/link';

interface CheckoutSuccessPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

function CheckoutSuccessContent({ locale }: { locale: string }) {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const translations = {
    en: {
      orderProcessing: 'Order Processing',
      orderProcessingMessage: 'Your order is being processed',
      orderSuccessful: 'Order Successful! 🎉',
      orderSuccessfulMessage: 'Your order has been placed successfully and payment has been processed.',
      orderDetails: 'Order Details',
      orderNumber: 'Order Number:',
      paymentId: 'Payment ID:',
      date: 'Date:',
      whatsNext: 'What\'s Next?',
      confirmationEmail: 'Order confirmation email sent',
      orderPrepared: 'Your order is being prepared',
      shippingDetails: 'Shipping details will be sent via email',
      contactUs: 'Contact Us',
      contactMessage: 'If you have any questions about your order, please don\'t hesitate to contact us.',
      email: 'Email: info@cosmt.com',
      phone: 'Phone: +1 (555) 123-4567',
      backToHomepage: 'Back to Homepage',
      viewMyOrders: 'View My Orders',
    },
    ar: {
      orderProcessing: 'معالجة الطلب',
      orderProcessingMessage: 'طلبك قيد المعالجة',
      orderSuccessful: 'تم الطلب بنجاح! 🎉',
      orderSuccessfulMessage: 'تم وضع طلبك بنجاح وتم معالجة الدفع.',
      orderDetails: 'تفاصيل الطلب',
      orderNumber: 'رقم الطلب:',
      paymentId: 'معرف الدفع:',
      date: 'التاريخ:',
      whatsNext: 'ما التالي؟',
      confirmationEmail: 'تم إرسال رسالة تأكيد الطلب',
      orderPrepared: 'طلبك قيد التحضير',
      shippingDetails: 'سيتم إرسال تفاصيل الشحن عبر البريد الإلكتروني',
      contactUs: 'اتصل بنا',
      contactMessage: 'إذا كان لديك أي أسئلة حول طلبك، فلا تتردد في الاتصال بنا.',
      email: 'البريد الإلكتروني: info@cosmt.com',
      phone: 'الهاتف: +1 (555) 123-4567',
      backToHomepage: 'العودة إلى الصفحة الرئيسية',
      viewMyOrders: 'عرض طلباتي',
    },
    tr: {
      orderProcessing: 'Sipariş İşleniyor',
      orderProcessingMessage: 'Siparişiniz işleniyor',
      orderSuccessful: 'Sipariş Başarılı! 🎉',
      orderSuccessfulMessage: 'Siparişiniz başarıyla verildi ve ödeme işlendi.',
      orderDetails: 'Sipariş Detayları',
      orderNumber: 'Sipariş Numarası:',
      paymentId: 'Ödeme ID:',
      date: 'Tarih:',
      whatsNext: 'Sırada Ne Var?',
      confirmationEmail: 'Sipariş onay e-postası gönderildi',
      orderPrepared: 'Siparişiniz hazırlanıyor',
      shippingDetails: 'Kargo detayları e-posta ile gönderilecek',
      contactUs: 'İletişim',
      contactMessage: 'Siparişiniz hakkında herhangi bir sorunuz varsa, lütfen bizimle iletişime geçmekten çekinmeyin.',
      email: 'E-posta: info@cosmt.com',
      phone: 'Telefon: +1 (555) 123-4567',
      backToHomepage: 'Ana Sayfaya Dön',
      viewMyOrders: 'Siparişlerimi Görüntüle',
    },
    de: {
      orderProcessing: 'Bestellung wird verarbeitet',
      orderProcessingMessage: 'Ihre Bestellung wird verarbeitet',
      orderSuccessful: 'Bestellung erfolgreich! 🎉',
      orderSuccessfulMessage: 'Ihre Bestellung wurde erfolgreich aufgegeben und die Zahlung wurde verarbeitet.',
      orderDetails: 'Bestelldetails',
      orderNumber: 'Bestellnummer:',
      paymentId: 'Zahlungs-ID:',
      date: 'Datum:',
      whatsNext: 'Was kommt als nächstes?',
      confirmationEmail: 'Bestellbestätigungs-E-Mail gesendet',
      orderPrepared: 'Ihre Bestellung wird vorbereitet',
      shippingDetails: 'Versanddetails werden per E-Mail gesendet',
      contactUs: 'Kontaktieren Sie uns',
      contactMessage: 'Wenn Sie Fragen zu Ihrer Bestellung haben, zögern Sie nicht, uns zu kontaktieren.',
      email: 'E-Mail: info@cosmt.com',
      phone: 'Telefon: +1 (555) 123-4567',
      backToHomepage: 'Zurück zur Startseite',
      viewMyOrders: 'Meine Bestellungen anzeigen',
    },
    fr: {
      orderProcessing: 'Traitement de la commande',
      orderProcessingMessage: 'Votre commande est en cours de traitement',
      orderSuccessful: 'Commande réussie ! 🎉',
      orderSuccessfulMessage: 'Votre commande a été passée avec succès et le paiement a été traité.',
      orderDetails: 'Détails de la commande',
      orderNumber: 'Numéro de commande :',
      paymentId: 'ID de paiement :',
      date: 'Date :',
      whatsNext: 'Et maintenant ?',
      confirmationEmail: 'E-mail de confirmation de commande envoyé',
      orderPrepared: 'Votre commande est en cours de préparation',
      shippingDetails: 'Les détails d\'expédition seront envoyés par e-mail',
      contactUs: 'Contactez-nous',
      contactMessage: 'Si vous avez des questions sur votre commande, n\'hésitez pas à nous contacter.',
      email: 'E-mail : info@cosmt.com',
      phone: 'Téléphone : +1 (555) 123-4567',
      backToHomepage: 'Retour à la page d\'accueil',
      viewMyOrders: 'Voir mes commandes',
    },
    es: {
      orderProcessing: 'Procesando pedido',
      orderProcessingMessage: 'Tu pedido está siendo procesado',
      orderSuccessful: '¡Pedido exitoso! 🎉',
      orderSuccessfulMessage: 'Tu pedido ha sido realizado con éxito y el pago ha sido procesado.',
      orderDetails: 'Detalles del pedido',
      orderNumber: 'Número de pedido:',
      paymentId: 'ID de pago:',
      date: 'Fecha:',
      whatsNext: '¿Qué sigue?',
      confirmationEmail: 'E-mail de confirmación de pedido enviado',
      orderPrepared: 'Tu pedido está siendo preparado',
      shippingDetails: 'Los detalles de envío se enviarán por correo electrónico',
      contactUs: 'Contáctanos',
      contactMessage: 'Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.',
      email: 'Correo: info@cosmt.com',
      phone: 'Teléfono: +1 (555) 123-4567',
      backToHomepage: 'Volver a la página principal',
      viewMyOrders: 'Ver mis pedidos',
    },
  };

  const t = translations[locale] || translations.en;

  useEffect(() => {
    // Get payment details from URL parameters
    const paymentId = searchParams.get('paymentId');
    const orderId = searchParams.get('orderId');
    
    if (paymentId && orderId) {
      setOrderDetails({
        paymentId,
        orderId,
        timestamp: new Date().toISOString()
      });
    }
    
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.orderProcessing}</h1>
            <p className="text-gray-600">{t.orderProcessingMessage}</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen py-12" style={{backgroundColor: '#fbfbfb'}}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t.orderSuccessful}
            </h1>
            <p className="text-lg text-gray-600">
              {t.orderSuccessfulMessage}
            </p>
          </div>

          {/* Order Details */}
          {orderDetails && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-green-600" />
                {t.orderDetails}
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.orderNumber}</span>
                  <span className="font-medium text-gray-900">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.paymentId}</span>
                  <span className="font-medium text-gray-900">{orderDetails.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.date}</span>
                  <span className="font-medium text-gray-900">
                    {new Date(orderDetails.timestamp).toLocaleDateString('en-US')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              {t.whatsNext}
            </h3>
            <ul className="space-y-2 text-green-800">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                {t.confirmationEmail}
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                {t.orderPrepared}
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                {t.shippingDetails}
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-gray-600" />
              {t.contactUs}
            </h3>
            <p className="text-gray-600 mb-2">
              {t.contactMessage}
            </p>
            <div className="text-sm text-gray-500">
              <p>{t.email}</p>
              <p>{t.phone}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}`} className="flex-1">
              <Button className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-lg py-3 rounded-lg font-semibold transition-colors duration-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.backToHomepage}
              </Button>
            </Link>
            <Link href={`/${locale}/orders`} className="flex-1">
              <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-lg py-3 rounded-lg transition-colors duration-200">
                {t.viewMyOrders}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

export default function CheckoutSuccess({ params }: CheckoutSuccessPageProps) {
  const { locale } = params;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutSuccessContent locale={locale} />
    </Suspense>
  );
}
