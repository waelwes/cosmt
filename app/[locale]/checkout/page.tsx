'use client';

import React, { useState } from 'react';
import { CreditCard, MapPin, Package, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContextBypass';
import { useCreateOrder } from '../../../hooks/useOrderManagement';
import { PageLayout } from '../../../components/layout/PageLayout';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CheckoutPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CheckoutPage({ params }: CheckoutPageProps) {
  const { locale } = params;
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder, loading, error } = useCreateOrder();
  const router = useRouter();

  const [formData, setFormData] = useState({
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const translations = {
    en: {
      signInRequired: 'Sign In Required',
      signInMessage: 'Please sign in to proceed with checkout.',
      goToHomepage: 'Go to Homepage',
      cartEmpty: 'Your Cart is Empty',
      cartEmptyMessage: 'Add some items to your cart before checking out.',
      continueShopping: 'Continue Shopping',
      orderPlaced: 'Order Placed Successfully!',
      orderPlacedMessage: 'Thank you for your order. We\'ll send you a confirmation email shortly.',
      viewOrderDetails: 'View Order Details',
      viewAllOrders: 'View All Orders',
      backToCart: 'Back to Cart',
      checkout: 'Checkout',
      completeOrder: 'Complete your order securely',
      shippingInformation: 'Shipping Information',
      shippingAddress: 'Shipping Address',
      shippingAddressPlaceholder: 'Enter your complete shipping address',
      billingAddress: 'Billing Address',
      billingAddressPlaceholder: 'Enter your billing address (optional)',
      paymentInformation: 'Payment Information',
      paymentMethod: 'Payment Method',
      creditCard: 'Credit Card',
      debitCard: 'Debit Card',
      paypal: 'PayPal',
      cardNumber: 'Card Number',
      cardNumberPlaceholder: '1234 5678 9012 3456',
      expiryDate: 'Expiry Date',
      expiryDatePlaceholder: 'MM/YY',
      cvv: 'CVV',
      cvvPlaceholder: '123',
      cardholderName: 'Cardholder Name',
      cardholderNamePlaceholder: 'John Doe',
      processing: 'Processing...',
      placeOrder: 'Place Order',
      orderSummary: 'Order Summary',
      qty: 'Qty',
      total: 'Total',
      secureCheckout: 'Secure Checkout',
      secureMessage: 'Your payment information is encrypted and secure. We never store your card details.',
    },
    ar: {
      signInRequired: 'تسجيل الدخول مطلوب',
      signInMessage: 'يرجى تسجيل الدخول للمتابعة مع الدفع.',
      goToHomepage: 'الذهاب إلى الصفحة الرئيسية',
      cartEmpty: 'سلة التسوق فارغة',
      cartEmptyMessage: 'أضف بعض العناصر إلى سلة التسوق قبل الدفع.',
      continueShopping: 'متابعة التسوق',
      orderPlaced: 'تم وضع الطلب بنجاح!',
      orderPlacedMessage: 'شكراً لطلبك. سنرسل لك رسالة تأكيد قريباً.',
      viewOrderDetails: 'عرض تفاصيل الطلب',
      viewAllOrders: 'عرض جميع الطلبات',
      backToCart: 'العودة إلى السلة',
      checkout: 'الدفع',
      completeOrder: 'أكمل طلبك بأمان',
      shippingInformation: 'معلومات الشحن',
      shippingAddress: 'عنوان الشحن',
      shippingAddressPlaceholder: 'أدخل عنوان الشحن الكامل',
      billingAddress: 'عنوان الفواتير',
      billingAddressPlaceholder: 'أدخل عنوان الفواتير (اختياري)',
      paymentInformation: 'معلومات الدفع',
      paymentMethod: 'طريقة الدفع',
      creditCard: 'بطاقة ائتمان',
      debitCard: 'بطاقة خصم',
      paypal: 'باي بال',
      cardNumber: 'رقم البطاقة',
      cardNumberPlaceholder: '1234 5678 9012 3456',
      expiryDate: 'تاريخ الانتهاء',
      expiryDatePlaceholder: 'شهر/سنة',
      cvv: 'رمز الأمان',
      cvvPlaceholder: '123',
      cardholderName: 'اسم حامل البطاقة',
      cardholderNamePlaceholder: 'أحمد محمد',
      processing: 'جاري المعالجة...',
      placeOrder: 'وضع الطلب',
      orderSummary: 'ملخص الطلب',
      qty: 'الكمية',
      total: 'المجموع',
      secureCheckout: 'دفع آمن',
      secureMessage: 'معلومات الدفع الخاصة بك مشفرة وآمنة. نحن لا نحفظ تفاصيل بطاقتك.',
    },
    tr: {
      signInRequired: 'Giriş Gerekli',
      signInMessage: 'Ödeme işlemini tamamlamak için lütfen giriş yapın.',
      goToHomepage: 'Ana Sayfaya Git',
      cartEmpty: 'Sepetiniz Boş',
      cartEmptyMessage: 'Ödeme yapmadan önce sepetinize bazı ürünler ekleyin.',
      continueShopping: 'Alışverişe Devam Et',
      orderPlaced: 'Sipariş Başarıyla Verildi!',
      orderPlacedMessage: 'Siparişiniz için teşekkürler. Kısa süre içinde onay e-postası göndereceğiz.',
      viewOrderDetails: 'Sipariş Detaylarını Görüntüle',
      viewAllOrders: 'Tüm Siparişleri Görüntüle',
      backToCart: 'Sepete Dön',
      checkout: 'Ödeme',
      completeOrder: 'Siparişinizi güvenle tamamlayın',
      shippingInformation: 'Kargo Bilgileri',
      shippingAddress: 'Kargo Adresi',
      shippingAddressPlaceholder: 'Tam kargo adresinizi girin',
      billingAddress: 'Fatura Adresi',
      billingAddressPlaceholder: 'Fatura adresinizi girin (isteğe bağlı)',
      paymentInformation: 'Ödeme Bilgileri',
      paymentMethod: 'Ödeme Yöntemi',
      creditCard: 'Kredi Kartı',
      debitCard: 'Banka Kartı',
      paypal: 'PayPal',
      cardNumber: 'Kart Numarası',
      cardNumberPlaceholder: '1234 5678 9012 3456',
      expiryDate: 'Son Kullanma Tarihi',
      expiryDatePlaceholder: 'AA/YY',
      cvv: 'CVV',
      cvvPlaceholder: '123',
      cardholderName: 'Kart Sahibinin Adı',
      cardholderNamePlaceholder: 'Ahmet Yılmaz',
      processing: 'İşleniyor...',
      placeOrder: 'Sipariş Ver',
      orderSummary: 'Sipariş Özeti',
      qty: 'Adet',
      total: 'Toplam',
      secureCheckout: 'Güvenli Ödeme',
      secureMessage: 'Ödeme bilgileriniz şifrelenmiş ve güvenlidir. Kart detaylarınızı asla saklamayız.',
    },
    de: {
      signInRequired: 'Anmeldung erforderlich',
      signInMessage: 'Bitte melden Sie sich an, um mit dem Checkout fortzufahren.',
      goToHomepage: 'Zur Startseite',
      cartEmpty: 'Ihr Warenkorb ist leer',
      cartEmptyMessage: 'Fügen Sie einige Artikel zu Ihrem Warenkorb hinzu, bevor Sie zur Kasse gehen.',
      continueShopping: 'Einkaufen fortsetzen',
      orderPlaced: 'Bestellung erfolgreich aufgegeben!',
      orderPlacedMessage: 'Vielen Dank für Ihre Bestellung. Wir senden Ihnen in Kürze eine Bestätigungs-E-Mail.',
      viewOrderDetails: 'Bestelldetails anzeigen',
      viewAllOrders: 'Alle Bestellungen anzeigen',
      backToCart: 'Zurück zum Warenkorb',
      checkout: 'Zur Kasse',
      completeOrder: 'Schließen Sie Ihre Bestellung sicher ab',
      shippingInformation: 'Versandinformationen',
      shippingAddress: 'Lieferadresse',
      shippingAddressPlaceholder: 'Geben Sie Ihre vollständige Lieferadresse ein',
      billingAddress: 'Rechnungsadresse',
      billingAddressPlaceholder: 'Geben Sie Ihre Rechnungsadresse ein (optional)',
      paymentInformation: 'Zahlungsinformationen',
      paymentMethod: 'Zahlungsmethode',
      creditCard: 'Kreditkarte',
      debitCard: 'Debitkarte',
      paypal: 'PayPal',
      cardNumber: 'Kartennummer',
      cardNumberPlaceholder: '1234 5678 9012 3456',
      expiryDate: 'Ablaufdatum',
      expiryDatePlaceholder: 'MM/JJ',
      cvv: 'CVV',
      cvvPlaceholder: '123',
      cardholderName: 'Karteninhaber',
      cardholderNamePlaceholder: 'Max Mustermann',
      processing: 'Wird verarbeitet...',
      placeOrder: 'Bestellung aufgeben',
      orderSummary: 'Bestellübersicht',
      qty: 'Anzahl',
      total: 'Gesamt',
      secureCheckout: 'Sicherer Checkout',
      secureMessage: 'Ihre Zahlungsinformationen sind verschlüsselt und sicher. Wir speichern niemals Ihre Kartendetails.',
    },
    fr: {
      signInRequired: 'Connexion requise',
      signInMessage: 'Veuillez vous connecter pour procéder au paiement.',
      goToHomepage: 'Aller à la page d\'accueil',
      cartEmpty: 'Votre panier est vide',
      cartEmptyMessage: 'Ajoutez quelques articles à votre panier avant de passer à la caisse.',
      continueShopping: 'Continuer les achats',
      orderPlaced: 'Commande passée avec succès !',
      orderPlacedMessage: 'Merci pour votre commande. Nous vous enverrons un e-mail de confirmation sous peu.',
      viewOrderDetails: 'Voir les détails de la commande',
      viewAllOrders: 'Voir toutes les commandes',
      backToCart: 'Retour au panier',
      checkout: 'Paiement',
      completeOrder: 'Finalisez votre commande en toute sécurité',
      shippingInformation: 'Informations de livraison',
      shippingAddress: 'Adresse de livraison',
      shippingAddressPlaceholder: 'Entrez votre adresse de livraison complète',
      billingAddress: 'Adresse de facturation',
      billingAddressPlaceholder: 'Entrez votre adresse de facturation (optionnel)',
      paymentInformation: 'Informations de paiement',
      paymentMethod: 'Méthode de paiement',
      creditCard: 'Carte de crédit',
      debitCard: 'Carte de débit',
      paypal: 'PayPal',
      cardNumber: 'Numéro de carte',
      cardNumberPlaceholder: '1234 5678 9012 3456',
      expiryDate: 'Date d\'expiration',
      expiryDatePlaceholder: 'MM/AA',
      cvv: 'CVV',
      cvvPlaceholder: '123',
      cardholderName: 'Nom du titulaire',
      cardholderNamePlaceholder: 'Jean Dupont',
      processing: 'Traitement en cours...',
      placeOrder: 'Passer la commande',
      orderSummary: 'Résumé de la commande',
      qty: 'Qté',
      total: 'Total',
      secureCheckout: 'Paiement sécurisé',
      secureMessage: 'Vos informations de paiement sont chiffrées et sécurisées. Nous ne stockons jamais vos détails de carte.',
    },
    es: {
      signInRequired: 'Inicio de sesión requerido',
      signInMessage: 'Por favor, inicia sesión para proceder con el pago.',
      goToHomepage: 'Ir a la página principal',
      cartEmpty: 'Tu carrito está vacío',
      cartEmptyMessage: 'Agrega algunos artículos a tu carrito antes de pagar.',
      continueShopping: 'Continuar comprando',
      orderPlaced: '¡Pedido realizado con éxito!',
      orderPlacedMessage: 'Gracias por tu pedido. Te enviaremos un correo de confirmación en breve.',
      viewOrderDetails: 'Ver detalles del pedido',
      viewAllOrders: 'Ver todos los pedidos',
      backToCart: 'Volver al carrito',
      checkout: 'Pago',
      completeOrder: 'Completa tu pedido de forma segura',
      shippingInformation: 'Información de envío',
      shippingAddress: 'Dirección de envío',
      shippingAddressPlaceholder: 'Ingresa tu dirección de envío completa',
      billingAddress: 'Dirección de facturación',
      billingAddressPlaceholder: 'Ingresa tu dirección de facturación (opcional)',
      paymentInformation: 'Información de pago',
      paymentMethod: 'Método de pago',
      creditCard: 'Tarjeta de crédito',
      debitCard: 'Tarjeta de débito',
      paypal: 'PayPal',
      cardNumber: 'Número de tarjeta',
      cardNumberPlaceholder: '1234 5678 9012 3456',
      expiryDate: 'Fecha de vencimiento',
      expiryDatePlaceholder: 'MM/AA',
      cvv: 'CVV',
      cvvPlaceholder: '123',
      cardholderName: 'Nombre del titular',
      cardholderNamePlaceholder: 'Juan Pérez',
      processing: 'Procesando...',
      placeOrder: 'Realizar pedido',
      orderSummary: 'Resumen del pedido',
      qty: 'Cant',
      total: 'Total',
      secureCheckout: 'Pago seguro',
      secureMessage: 'Tu información de pago está encriptada y segura. Nunca almacenamos los detalles de tu tarjeta.',
    },
  };

  const t = translations[locale] || translations.en;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please sign in to place an order');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      const orderItems = items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_image: item.image,
        quantity: item.quantity,
        price: item.price
      }));

      const order = await createOrder({
        items: orderItems,
        shipping_address: formData.shippingAddress,
        billing_address: formData.billingAddress || formData.shippingAddress
      });

      setOrderId(order.id);
      setOrderComplete(true);
      clearCart();
      
      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push(`/${locale}/checkout/success?orderId=${order.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  if (!user) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.signInRequired}</h1>
            <p className="text-gray-600 mb-6">{t.signInMessage}</p>
            <Link href={`/${locale}`}>
              <Button variant="primary">{t.goToHomepage}</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.cartEmpty}</h1>
            <p className="text-gray-600 mb-6">{t.cartEmptyMessage}</p>
            <Link href={`/${locale}`}>
              <Button variant="primary">{t.continueShopping}</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (orderComplete) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.orderPlaced}</h1>
            <p className="text-gray-600 mb-6">
              {t.orderPlacedMessage}
            </p>
            <div className="space-x-4">
              <Link href={`/${locale}/orders/${orderId}`}>
                <Button variant="primary">{t.viewOrderDetails}</Button>
              </Link>
              <Link href={`/${locale}/orders`}>
                <Button variant="secondary">{t.viewAllOrders}</Button>
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen" style={{backgroundColor: '#fbfbfb'}}>
        <div className="cosmt-container py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/${locale}/cart`}>
              <Button variant="secondary" className="mb-4 hover:text-green-600 transition-colors duration-200">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToCart}
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">{t.checkout}</h1>
            <p className="text-lg text-gray-600 mt-2">{t.completeOrder}</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {t.shippingInformation}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.shippingAddress} *
                  </label>
                  <textarea
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleInputChange}
                    placeholder={t.shippingAddressPlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.billingAddress}
                  </label>
                  <textarea
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                    placeholder={t.billingAddressPlaceholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                    rows={3}
                  />
                </div>

                {/* Payment Information */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    {t.paymentInformation}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.paymentMethod}
                      </label>
                      <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cosmt-primary focus:border-transparent"
                      >
                        <option value="credit_card">{t.creditCard}</option>
                        <option value="debit_card">{t.debitCard}</option>
                        <option value="paypal">{t.paypal}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.cardNumber} *
                      </label>
                      <Input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder={t.cardNumberPlaceholder}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.expiryDate} *
                        </label>
                        <Input
                          type="text"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder={t.expiryDatePlaceholder}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t.cvv} *
                        </label>
                        <Input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder={t.cvvPlaceholder}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.cardholderName} *
                      </label>
                      <Input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder={t.cardholderNamePlaceholder}
                        required
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-white text-lg py-3 rounded-lg font-semibold transition-colors duration-200"
                  style={{ backgroundColor: '#003d38' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}
                  disabled={loading}
                >
                  {loading ? t.processing : t.placeOrder}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.orderSummary}</h2>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{t.qty}: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>{t.total}</span>
                  <span className="text-green-600">${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">{t.secureCheckout}</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    {t.secureMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </PageLayout>
  );
}
