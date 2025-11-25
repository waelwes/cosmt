'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '../../../contexts/CartContextNew';
import { PageLayout } from '../../../components/layout/PageLayout';
import { useProductDisplay } from '../../../hooks/useProductDisplay';
import { Button } from '../../../components/ui/Button';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface CartPageProps {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function CartPage({ params }: CartPageProps) {
  const { locale } = params;
  const { items, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { convertProductsForDisplay } = useProductDisplay();
  const [displayItems, setDisplayItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Convert cart items for display with translations
  useEffect(() => {
    const convertItems = async () => {
      setIsLoading(true);
      try {
        const converted = await convertProductsForDisplay(items);
        setDisplayItems(converted);
      } catch (error) {
        console.error('Error converting cart items:', error);
        setDisplayItems(items);
      } finally {
        setIsLoading(false);
      }
    };

    convertItems();
  }, [items, convertProductsForDisplay]);

  const translations = {
    en: {
      emptyCartTitle: 'Your Cart is Empty',
      emptyCartSubtitle: "Looks like you haven't added any items to your cart yet.",
      continueShopping: 'Continue Shopping',
      shoppingCart: 'Shopping Cart',
      itemsInCart: 'item in your cart',
      itemsInCartPlural: 'items in your cart',
      orderSummary: 'Order Summary',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      free: 'Free',
      tax: 'Tax',
      total: 'Total',
      proceedToCheckout: 'Proceed to Checkout',
      remove: 'Remove',
      clearCart: 'Clear Cart',
    },
    ar: {
      emptyCartTitle: 'سلة التسوق فارغة',
      emptyCartSubtitle: 'يبدو أنك لم تضيف أي عناصر إلى سلة التسوق بعد.',
      continueShopping: 'متابعة التسوق',
      shoppingCart: 'سلة التسوق',
      itemsInCart: 'عنصر في سلة التسوق',
      itemsInCartPlural: 'عناصر في سلة التسوق',
      orderSummary: 'ملخص الطلب',
      subtotal: 'المجموع الفرعي',
      shipping: 'الشحن',
      free: 'مجاني',
      tax: 'الضريبة',
      total: 'المجموع',
      proceedToCheckout: 'المتابعة إلى الدفع',
      remove: 'إزالة',
      clearCart: 'مسح السلة',
    },
    tr: {
      emptyCartTitle: 'Sepetiniz Boş',
      emptyCartSubtitle: 'Görünüşe göre henüz sepetinize hiç ürün eklemediniz.',
      continueShopping: 'Alışverişe Devam Et',
      shoppingCart: 'Alışveriş Sepeti',
      itemsInCart: 'ürün sepetinizde',
      itemsInCartPlural: 'ürün sepetinizde',
      orderSummary: 'Sipariş Özeti',
      subtotal: 'Ara Toplam',
      shipping: 'Kargo',
      free: 'Ücretsiz',
      tax: 'Vergi',
      total: 'Toplam',
      proceedToCheckout: 'Ödemeye Geç',
      remove: 'Kaldır',
      clearCart: 'Sepeti Temizle',
    },
    de: {
      emptyCartTitle: 'Ihr Warenkorb ist leer',
      emptyCartSubtitle: 'Es scheint, als hätten Sie noch keine Artikel zu Ihrem Warenkorb hinzugefügt.',
      continueShopping: 'Einkaufen fortsetzen',
      shoppingCart: 'Warenkorb',
      itemsInCart: 'Artikel in Ihrem Warenkorb',
      itemsInCartPlural: 'Artikel in Ihrem Warenkorb',
      orderSummary: 'Bestellübersicht',
      subtotal: 'Zwischensumme',
      shipping: 'Versand',
      free: 'Kostenlos',
      tax: 'Steuer',
      total: 'Gesamt',
      proceedToCheckout: 'Zur Kasse gehen',
      remove: 'Entfernen',
      clearCart: 'Warenkorb leeren',
    },
    fr: {
      emptyCartTitle: 'Votre panier est vide',
      emptyCartSubtitle: 'Il semble que vous n\'ayez pas encore ajouté d\'articles à votre panier.',
      continueShopping: 'Continuer les achats',
      shoppingCart: 'Panier d\'achat',
      itemsInCart: 'article dans votre panier',
      itemsInCartPlural: 'articles dans votre panier',
      orderSummary: 'Résumé de la commande',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      free: 'Gratuit',
      tax: 'Taxe',
      total: 'Total',
      proceedToCheckout: 'Procéder au paiement',
      remove: 'Supprimer',
      clearCart: 'Vider le panier',
    },
    es: {
      emptyCartTitle: 'Tu carrito está vacío',
      emptyCartSubtitle: 'Parece que aún no has agregado ningún artículo a tu carrito.',
      continueShopping: 'Continuar comprando',
      shoppingCart: 'Carrito de compras',
      itemsInCart: 'artículo en tu carrito',
      itemsInCartPlural: 'artículos en tu carrito',
      orderSummary: 'Resumen del pedido',
      subtotal: 'Subtotal',
      shipping: 'Envío',
      free: 'Gratis',
      tax: 'Impuesto',
      total: 'Total',
      proceedToCheckout: 'Proceder al pago',
      remove: 'Eliminar',
      clearCart: 'Vaciar carrito',
    },
  };

  const t = translations[locale] || translations.en;

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="cosmt-container py-16">
          <div className="text-center">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-4" />
              <h1 className="text-cosmt-4xl font-bold text-gray-900 mb-4">{t.emptyCartTitle}</h1>
              <p className="text-cosmt-lg text-gray-600 mb-8">
                {t.emptyCartSubtitle}
              </p>
              <Link href={`/${locale}/categories`}>
                <Button variant="primary">
                  {t.continueShopping}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen" style={{ backgroundColor: '#fbfbfb' }}>
        <div className="cosmt-container py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href={`/${locale}`} className="inline-flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.continueShopping}
            </Link>
            <h1 className="text-4xl font-bold text-gray-900">{t.shoppingCart}</h1>
            <p className="text-lg text-gray-600 mt-2">
              {getTotalItems()} {getTotalItems() !== 1 ? t.itemsInCartPlural : t.itemsInCart}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Translating products...</p>
                    </div>
                  </div>
                ) : (
                  displayItems.map((item) => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-start space-x-6">
                        {/* Product Image */}
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>

                          {/* Price */}
                          <div className="flex items-center space-x-2 mt-4">
                            <span className="text-xl font-bold text-green-600">{item.price}</span>
                            {item.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end space-y-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-green-300 transition-colors duration-200"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-16 text-center font-semibold text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 hover:border-green-300 transition-colors duration-200"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="text-sm font-medium">{t.remove}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Clear Cart Button */}
              <div className="mt-6">
                <button
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t.clearCart}</span>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.orderSummary}</h2>

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base text-gray-600">{t.subtotal}</span>
                  <span className="text-lg font-semibold text-gray-900">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>

                {/* Shipping */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base text-gray-600">{t.shipping}</span>
                  <span className="text-base text-gray-900">
                    {getTotalPrice() >= 50 ? t.free : '$9.99'}
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-base text-gray-600">{t.tax}</span>
                  <span className="text-base text-gray-900">
                    ${(getTotalPrice() * 0.08).toFixed(2)}
                  </span>
                </div>

                {/* Total */}
                <div className="border-t border-gray-300 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{t.total}</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${(getTotalPrice() + (getTotalPrice() >= 50 ? 0 : 9.99) + (getTotalPrice() * 0.08)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link href={`/${locale}/checkout`}>
                  <Button className="w-full mb-4 text-white text-lg py-3 rounded-lg font-semibold transition-colors duration-200" style={{ backgroundColor: '#003d38' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#002a25'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#003d38'}>
                    {t.proceedToCheckout}
                  </Button>
                </Link>

                {/* Continue Shopping */}
                <Link href={`/${locale}/categories`} className="block">
                  <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50 text-lg py-3 rounded-lg transition-colors duration-200">
                    {t.continueShopping}
                  </Button>
                </Link>

              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
