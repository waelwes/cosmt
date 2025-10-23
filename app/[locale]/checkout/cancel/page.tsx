'use client';

import React from 'react';
import { PageLayout } from '../../../../components/layout/PageLayout';
import { Button } from '../../../../components/ui/Button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface CheckoutCancelPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CheckoutCancel({ params }: CheckoutCancelPageProps) {
  const { locale } = params;

  const translations = {
    en: {
      paymentCancelled: 'Payment Cancelled',
      paymentCancelledMessage: 'The payment process was cancelled. Your order was not saved.',
      whatHappened: 'What Happened?',
      whatHappenedMessage: 'A problem occurred during the payment process or you cancelled the transaction. Your order has not been completed and you have not been charged.',
      note: 'Note:',
      noteMessage: 'The items in your cart have been preserved. You can try the payment again at any time.',
      possibleReasons: 'Possible Reasons',
      reasons: [
        'Closing the payment page',
        'Internet connection problem',
        'Error in credit card information',
        'Transaction rejected by the bank',
        'Page timeout'
      ],
      tryAgain: 'Try Again',
      viewCart: 'View Cart',
      homePage: 'Homepage',
      contactMessage: 'If the problem persists, please contact us',
      email: 'Email: info@cosmt.com',
      phone: 'Phone: +1 (555) 123-4567',
    },
    ar: {
      paymentCancelled: 'تم إلغاء الدفع',
      paymentCancelledMessage: 'تم إلغاء عملية الدفع. لم يتم حفظ طلبك.',
      whatHappened: 'ماذا حدث؟',
      whatHappenedMessage: 'حدثت مشكلة أثناء عملية الدفع أو قمت بإلغاء المعاملة. لم يكتمل طلبك ولم يتم تحصيل رسوم منك.',
      note: 'ملاحظة:',
      noteMessage: 'تم الحفاظ على العناصر في سلة التسوق. يمكنك المحاولة مرة أخرى في أي وقت.',
      possibleReasons: 'الأسباب المحتملة',
      reasons: [
        'إغلاق صفحة الدفع',
        'مشكلة في الاتصال بالإنترنت',
        'خطأ في معلومات بطاقة الائتمان',
        'رفض البنك للمعاملة',
        'انتهاء مهلة الصفحة'
      ],
      tryAgain: 'حاول مرة أخرى',
      viewCart: 'عرض السلة',
      homePage: 'الصفحة الرئيسية',
      contactMessage: 'إذا استمرت المشكلة، يرجى الاتصال بنا',
      email: 'البريد الإلكتروني: info@cosmt.com',
      phone: 'الهاتف: +1 (555) 123-4567',
    },
    tr: {
      paymentCancelled: 'Ödeme İptal Edildi',
      paymentCancelledMessage: 'Ödeme işlemi iptal edildi. Siparişiniz kaydedilmedi.',
      whatHappened: 'Ne Oldu?',
      whatHappenedMessage: 'Ödeme işlemi sırasında bir sorun oluştu veya işlemi iptal ettiniz. Siparişiniz henüz tamamlanmadı ve ücretlendirilmediniz.',
      note: 'Not:',
      noteMessage: 'Sepetinizdeki ürünler korunmuştur. İstediğiniz zaman tekrar ödeme yapabilirsiniz.',
      possibleReasons: 'Olası Nedenler',
      reasons: [
        'Ödeme sayfasını kapatmanız',
        'İnternet bağlantısı sorunu',
        'Kredi kartı bilgilerinde hata',
        'Banka tarafından işlem reddedilmesi',
        'Sayfa zaman aşımı'
      ],
      tryAgain: 'Tekrar Dene',
      viewCart: 'Sepeti Görüntüle',
      homePage: 'Ana Sayfa',
      contactMessage: 'Sorun devam ederse bizimle iletişime geçin',
      email: 'E-posta: info@cosmt.com',
      phone: 'Telefon: +1 (555) 123-4567',
    },
    de: {
      paymentCancelled: 'Zahlung storniert',
      paymentCancelledMessage: 'Der Zahlungsvorgang wurde storniert. Ihre Bestellung wurde nicht gespeichert.',
      whatHappened: 'Was ist passiert?',
      whatHappenedMessage: 'Während des Zahlungsvorgangs ist ein Problem aufgetreten oder Sie haben die Transaktion storniert. Ihre Bestellung wurde nicht abgeschlossen und Ihnen wurden keine Gebühren berechnet.',
      note: 'Hinweis:',
      noteMessage: 'Die Artikel in Ihrem Warenkorb wurden beibehalten. Sie können die Zahlung jederzeit erneut versuchen.',
      possibleReasons: 'Mögliche Gründe',
      reasons: [
        'Schließen der Zahlungsseite',
        'Internetverbindungsproblem',
        'Fehler in den Kreditkarteninformationen',
        'Transaktion von der Bank abgelehnt',
        'Seiten-Timeout'
      ],
      tryAgain: 'Erneut versuchen',
      viewCart: 'Warenkorb anzeigen',
      homePage: 'Startseite',
      contactMessage: 'Wenn das Problem weiterhin besteht, kontaktieren Sie uns bitte',
      email: 'E-Mail: info@cosmt.com',
      phone: 'Telefon: +1 (555) 123-4567',
    },
    fr: {
      paymentCancelled: 'Paiement annulé',
      paymentCancelledMessage: 'Le processus de paiement a été annulé. Votre commande n\'a pas été sauvegardée.',
      whatHappened: 'Que s\'est-il passé ?',
      whatHappenedMessage: 'Un problème s\'est produit pendant le processus de paiement ou vous avez annulé la transaction. Votre commande n\'a pas été finalisée et vous n\'avez pas été facturé.',
      note: 'Note :',
      noteMessage: 'Les articles de votre panier ont été préservés. Vous pouvez réessayer le paiement à tout moment.',
      possibleReasons: 'Raisons possibles',
      reasons: [
        'Fermeture de la page de paiement',
        'Problème de connexion Internet',
        'Erreur dans les informations de carte de crédit',
        'Transaction rejetée par la banque',
        'Délai d\'attente de la page'
      ],
      tryAgain: 'Réessayer',
      viewCart: 'Voir le panier',
      homePage: 'Page d\'accueil',
      contactMessage: 'Si le problème persiste, veuillez nous contacter',
      email: 'E-mail : info@cosmt.com',
      phone: 'Téléphone : +1 (555) 123-4567',
    },
    es: {
      paymentCancelled: 'Pago cancelado',
      paymentCancelledMessage: 'El proceso de pago fue cancelado. Tu pedido no fue guardado.',
      whatHappened: '¿Qué pasó?',
      whatHappenedMessage: 'Ocurrió un problema durante el proceso de pago o cancelaste la transacción. Tu pedido no se completó y no se te cobró.',
      note: 'Nota:',
      noteMessage: 'Los artículos en tu carrito han sido preservados. Puedes intentar el pago nuevamente en cualquier momento.',
      possibleReasons: 'Razones posibles',
      reasons: [
        'Cerrar la página de pago',
        'Problema de conexión a Internet',
        'Error en la información de la tarjeta de crédito',
        'Transacción rechazada por el banco',
        'Tiempo de espera de la página agotado'
      ],
      tryAgain: 'Intentar de nuevo',
      viewCart: 'Ver carrito',
      homePage: 'Página principal',
      contactMessage: 'Si el problema persiste, por favor contáctanos',
      email: 'Correo: info@cosmt.com',
      phone: 'Teléfono: +1 (555) 123-4567',
    },
  };

  const t = translations[locale] || translations.en;

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cancel Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t.paymentCancelled}
            </h1>
            <p className="text-lg text-gray-600">
              {t.paymentCancelledMessage}
            </p>
          </div>

          {/* Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t.whatHappened}
            </h2>
            <p className="text-gray-600 mb-4">
              {t.whatHappenedMessage}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>{t.note}</strong> {t.noteMessage}
              </p>
            </div>
          </div>

          {/* Possible Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t.possibleReasons}
            </h3>
            <ul className="space-y-2 text-gray-600">
              {t.reasons.map((reason, index) => (
                <li key={index}>• {reason}</li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={`/${locale}/checkout`} className="flex-1">
              <Button className="w-full flex items-center justify-center">
                <RefreshCw className="h-4 w-4 mr-2" />
                {t.tryAgain}
              </Button>
            </Link>
            <Link href={`/${locale}/cart`} className="flex-1">
              <Button variant="outline" className="w-full">
                {t.viewCart}
              </Button>
            </Link>
            <Link href={`/${locale}`} className="flex-1">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.homePage}
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-2">
              {t.contactMessage}
            </p>
            <div className="text-sm text-gray-400">
              <p>{t.email}</p>
              <p>{t.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
