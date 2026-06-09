import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Loader2, AlertCircle, CheckCircle2, ShieldCheck, Check, Landmark, FileText, Upload } from 'lucide-react';
import { loadStripe, StripeCardNumberElement } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { api, Invoice, PaymentMethod } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';
import { SlideToAccept } from './SlideToAccept';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

interface InvoicePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  onSuccess: () => void;
  savedCards?: PaymentMethod[];
  defaultPaymentMethod?: string;
}

const InvoicePaymentModalInner: React.FC<InvoicePaymentModalProps> = ({ isOpen, onClose, invoice, onSuccess, savedCards, defaultPaymentMethod }) => {
  const { trans, language, formatCurrency } = useLanguage() as any;
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Payment mode: 'saved' or 'new'
  const hasSavedCards = savedCards && savedCards.length > 0;
  const [paymentMode, setPaymentMode] = useState<'saved' | 'new'>(hasSavedCards ? 'saved' : 'new');
  const [selectedCardId, setSelectedCardId] = useState<string>(
    defaultPaymentMethod || (hasSavedCards ? savedCards[0].id : '')
  );

  // Payment method (mirrors the contract pop-up): card / bank transfer / CESU.
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'cesu'>('card');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);

  // Company payment details shown for manual (non-card) methods.
  const RIB = {
    iban: 'FR76 2823 3000 0150 9805 3550 539',
    bic: 'REVOFRP2',
    accountName: 'ENQAVON SERVICE',
  };
  const CESU_NAN = '1761420';

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProofFile(e.target.files?.[0] || null);
    setError(null);
  };

  /** Pay the invoice by bank transfer / CESU — upload a proof of payment. */
  const handleSubmitProof = async (): Promise<void> => {
    if (!proofFile) {
      setError(language === 'fr' ? "Veuillez d'abord téléverser votre preuve de paiement." : 'Please upload your proof of payment first.');
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const method = paymentMethod === 'bank' ? 'Bank Transfer' : 'CESU';
      const res = await api.submitInvoiceProof(invoice.id, method, proofFile);
      if (res.status) {
        setIsSuccess(true);
        setTimeout(() => { onSuccess(); onClose(); }, 2000);
      } else {
        throw new Error(res.message || (language === 'fr' ? "Erreur lors de l'envoi" : 'Submission error'));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || (err instanceof Error ? err.message : 'Failed'));
    } finally {
      setIsProcessing(false);
    }
  };

  const t = trans?.payment || {
    cardNumber: "Card Number",
    expiry: "Expiry",
    cvc: "CVC",
    securityNote: "Your payment data is encrypted and secure",
    processing: "Processing...",
    payButton: "Pay {amount}",
    checkout: "Pay Now",
    success: "Payment Successful",
    backToDashboard: "Back to Dashboard"
  };

  /** Pay with a saved (existing) payment method */
  const handlePayWithSavedCard = async (): Promise<void> => {
    if (!stripe || !selectedCardId) return;

    setIsProcessing(true);
    setError(null);

    try {
      const amount = Math.round(parseFloat(invoice.amount));

      // 1. Create Payment Intent
      const intentResponse = await api.createPaymentIntent(amount, invoice.user_id);
      const clientSecret = intentResponse.client_secret || intentResponse.clientSecret;

      if (!clientSecret) {
        throw new Error(language === 'fr' ? "Erreur d'initialisation du paiement" : "Payment initialization error");
      }

      // 2. Confirm with saved payment method
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: selectedCardId }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 3. Confirm on Backend
        const confirmResponse = await api.confirmInvoicePayment(paymentIntent.id, invoice.id);

        if (confirmResponse.status) {
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        } else {
          throw new Error(language === 'fr' ? "Erreur lors de la confirmation de la facture" : "Invoice confirmation error");
        }
      } else {
        throw new Error(language === 'fr' ? "Le paiement n'a pas été finalisé" : "Payment was not finalized");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  /** Pay with a new card via Stripe Elements */
  const handlePayWithNewCard = async (): Promise<void> => {
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      const amount = Math.round(parseFloat(invoice.amount));
      
      // 1. Create Payment Intent
      const intentResponse = await api.createPaymentIntent(amount, invoice.user_id);
      const clientSecret = intentResponse.client_secret || intentResponse.clientSecret;
      
      if (!clientSecret) {
        throw new Error(language === 'fr' ? "Erreur d'initialisation du paiement" : "Payment initialization error");
      }

      // 2. Confirm Card Payment
      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) throw new Error("Card element not found");

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardNumberElement as unknown as StripeCardNumberElement, 
          }
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // 3. Confirm on Backend
        const confirmResponse = await api.confirmInvoicePayment(paymentIntent.id, invoice.id);
        
        if (confirmResponse.status) {
          setIsSuccess(true);
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        } else {
          throw new Error(language === 'fr' ? "Erreur lors de la confirmation de la facture" : "Invoice confirmation error");
        }
      } else {
        throw new Error(language === 'fr' ? "Le paiement n'a pas été finalisé" : "Payment was not finalized");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Payment failed";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async (): Promise<void> => {
    if (paymentMode === 'saved') {
      return handlePayWithSavedCard();
    }
    return handlePayWithNewCard();
  };

  /** Capitalize first letter of brand */
  const brandLabel = (brand: string): string => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => !isProcessing && !isSuccess && onClose()}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-[40px] p-6 sm:p-8 w-full shadow-2xl relative z-10 overflow-x-hidden overflow-y-auto max-h-[92vh] no-scrollbar"
        style={{ maxWidth: '620px' }}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 blur-2xl" />

        {!isSuccess ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue shadow-inner">
                {isProcessing ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <ShieldCheck size={24} />
                )}
              </div>
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center mb-4">
              <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 uppercase tracking-tight">
                {isProcessing ? t.processing : (language === 'fr' ? 'Payer la Facture' : 'Pay Invoice')}
              </h3>
              <p className="text-slate-500 text-sm">
                {language === 'fr' ? 'Facture' : 'Invoice'} <span className="font-bold text-slate-700">{invoice.invoice_num}</span>
              </p>
            </div>

            {/* Payment body: amount + method on the left, inputs on the right */}
            <div className="grid sm:grid-cols-2 gap-5 mb-5 relative z-10 items-start">
              {/* LEFT: amount + payment method */}
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500 font-medium text-sm">{language === 'fr' ? 'Montant à payer' : 'Amount to pay'}</span>
                  <span className="text-xl font-display font-bold text-brand-blue">
                    {formatCurrency(parseFloat(invoice.amount))}
                  </span>
                </div>

                {/* Payment method selector (Card / Bank transfer / CESU) */}
                <div className={`space-y-2 transition-opacity duration-300 ${isProcessing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                  {([
                    { key: 'card', label: language === 'fr' ? 'Carte de crédit' : 'Credit card', icon: <CreditCard size={16} /> },
                    { key: 'bank', label: language === 'fr' ? 'Virement bancaire' : 'Bank transfer', icon: <Landmark size={16} /> },
                    { key: 'cesu', label: 'CESU', icon: <FileText size={16} /> },
                  ] as const).map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => { setPaymentMethod(opt.key); setError(null); }}
                      disabled={isProcessing}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-xs font-bold transition-all ${paymentMethod === opt.key ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-sm' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* RIGHT: method-specific inputs */}
              <div className="min-w-0">
            {/* Payment Mode Toggle (only if saved cards exist) */}
            {hasSavedCards && paymentMethod === 'card' && (
              <div className="flex p-1 bg-slate-100/50 rounded-2xl mb-6 border border-slate-200/50">
                <button
                  onClick={() => setPaymentMode('saved')}
                  disabled={isProcessing}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    paymentMode === 'saved'
                      ? 'bg-white text-brand-blue shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <CreditCard size={14} />
                  {language === 'fr' ? 'Cartes sauvées' : 'Saved Cards'}
                </button>
                <button
                  onClick={() => setPaymentMode('new')}
                  disabled={isProcessing}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    paymentMode === 'new'
                      ? 'bg-white text-brand-blue shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {language === 'fr' ? 'Nouvelle carte' : 'New Card'}
                </button>
              </div>
            )}

            {paymentMethod === 'card' && (
            <div className={`transition-opacity duration-300 relative z-10 ${isProcessing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {/* Saved Cards List */}
              {paymentMode === 'saved' && hasSavedCards && (
                <div className="space-y-3 mb-6">
                  {savedCards.map((card) => {
                    const isSelected = selectedCardId === card.id;
                    const isDefault = defaultPaymentMethod === card.id;
                    return (
                      <button
                        key={card.id}
                        onClick={() => setSelectedCardId(card.id)}
                        disabled={isProcessing}
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left group ${
                          isSelected
                            ? 'border-brand-blue bg-brand-blue/5 shadow-sm'
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {/* Radio indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'border-brand-blue bg-brand-blue' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>

                        {/* Card icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? 'bg-brand-blue/10 text-brand-blue' : 'bg-slate-100 text-slate-400'
                        }`}>
                          <CreditCard size={20} />
                        </div>

                        {/* Card details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-800">
                              {brandLabel(card.card.brand)} •••• {card.card.last4}
                            </p>
                            {isDefault && (
                              <span className="text-[9px] font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {language === 'fr' ? 'Défaut' : 'Default'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {language === 'fr' ? 'Expire' : 'Exp'} {String(card.card.exp_month).padStart(2, '0')}/{card.card.exp_year}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* New Card Entry (Stripe Elements) */}
              {paymentMode === 'new' && (
                <div className="space-y-4 mb-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400 px-1">{t.cardNumber}</label>
                    <div className="relative">
                      <div className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 bg-white transition-all">
                        <CardNumberElement options={{ style: { base: { fontSize: '14px', color: '#334155', '::placeholder': { color: '#94a3b8' } }, invalid: { color: '#ef4444' } }, disabled: isProcessing }} />
                      </div>
                      <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 px-1">{t.expiry}</label>
                      <div className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 bg-white transition-all">
                        <CardExpiryElement options={{ style: { base: { fontSize: '14px', color: '#334155', '::placeholder': { color: '#94a3b8' } }, invalid: { color: '#ef4444' } }, disabled: isProcessing }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400 px-1">{t.cvc}</label>
                      <div className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 bg-white transition-all">
                        <CardCvcElement options={{ style: { base: { fontSize: '14px', color: '#334155', '::placeholder': { color: '#94a3b8' } }, invalid: { color: '#ef4444' } }, disabled: isProcessing }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security note & errors */}
              <div className="flex flex-col items-center gap-2 mb-6">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <Lock size={12} />
                  {t.securityNote}
                </div>
                {error && (
                  <div className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 flex items-center gap-2 mt-2 w-full justify-center">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </div>
            )}

            {/* Bank transfer / CESU details + proof of payment upload */}
            {paymentMethod !== 'card' && (
              <div className={`space-y-3 mb-6 relative z-10 transition-opacity duration-300 ${isProcessing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                {paymentMethod === 'bank' ? (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5">
                    <p className="text-[10px] uppercase font-bold text-slate-400">{language === 'fr' ? 'Coordonnées bancaires' : 'Bank details'}</p>
                    {[
                      { label: 'IBAN', value: RIB.iban },
                      { label: 'BIC', value: RIB.bic },
                      { label: language === 'fr' ? 'Titulaire' : 'Account', value: RIB.accountName },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between items-center gap-3">
                        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">{row.label}</span>
                        <span className="text-xs font-bold text-slate-700 text-right break-all">{row.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5">
                    <p className="text-[10px] uppercase font-bold text-slate-400">{language === 'fr' ? "Numéro d'affiliation national (CESU)" : 'CESU affiliation number'}</p>
                    <div className="flex justify-between items-center gap-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">NAN</span>
                      <span className="text-xs font-bold text-slate-700 text-right break-all">{CESU_NAN}</span>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-slate-500 leading-relaxed px-1">
                  {language === 'fr'
                    ? 'Effectuez votre paiement, puis téléversez votre preuve de paiement.'
                    : 'Make your payment, then upload your proof of payment.'}
                </p>

                <input ref={proofInputRef} type="file" accept="image/*,application/pdf" onChange={handleProofChange} className="hidden" disabled={isProcessing} />
                <button
                  type="button"
                  onClick={() => proofInputRef.current?.click()}
                  disabled={isProcessing}
                  className={`w-full rounded-xl border-2 border-dashed px-4 py-4 flex flex-col items-center justify-center gap-1.5 transition-colors ${proofFile ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:border-brand-blue/40 bg-white'}`}
                >
                  {proofFile ? (
                    <>
                      <CheckCircle2 size={20} className="text-green-500" />
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[220px]">{proofFile.name}</span>
                      <span className="text-[10px] text-slate-400">{language === 'fr' ? 'Cliquer pour changer' : 'Click to change'}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-500">{language === 'fr' ? 'Téléverser la preuve de paiement' : 'Upload proof of payment'}</span>
                      <span className="text-[10px] text-slate-400">{language === 'fr' ? 'Image ou PDF' : 'Image or PDF'}</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="text-xs text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}
              </div>
            </div>

            <div className={`px-2 relative z-10 transition-opacity duration-300 ${isProcessing ? 'opacity-0' : 'opacity-100'}`}>
              <SlideToAccept
                onAccept={paymentMethod === 'card' ? handlePayment : handleSubmitProof}
                text={paymentMethod === 'card'
                  ? t.payButton.replace('{amount}', formatCurrency(parseFloat(invoice.amount)))
                  : (language === 'fr' ? 'Glisser pour soumettre' : 'Slide to submit')}
                reset={!!error && !isProcessing}
              />
            </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 relative z-10"
          >
            <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center text-green-500 mx-auto mb-8 shadow-[0_10px_40px_-10px_rgba(34,197,94,0.3)]">
              <CheckCircle2 size={48} />
            </div>
            <h3 className="text-3xl font-display font-bold text-slate-900 mb-3">
              {paymentMethod === 'card'
                ? t.success
                : (language === 'fr' ? 'Preuve reçue' : 'Proof received')}
            </h3>
            <p className="text-slate-500 mb-10 font-medium text-sm leading-relaxed px-4">
              {paymentMethod === 'card'
                ? (language === 'fr'
                    ? "Votre paiement a été traité avec succès. Merci !"
                    : "Your payment has been successfully processed. Thank you!")
                : (language === 'fr'
                    ? "Votre preuve de paiement a bien été reçue et sera vérifiée par notre équipe."
                    : "Your proof of payment has been received and will be verified by our team.")
              }
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export const InvoicePaymentModal: React.FC<InvoicePaymentModalProps> = (props) => {
  return (
    <AnimatePresence>
      {props.isOpen && (
        <Elements stripe={stripePromise}>
          <InvoicePaymentModalInner {...props} />
        </Elements>
      )}
    </AnimatePresence>
  );
};
