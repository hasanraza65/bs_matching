import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Loader2, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { loadStripe, StripeCardNumberElement } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { api } from '../services/api';
import { useLanguage } from '../i18n/LanguageContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY as string);

interface AddCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddCardModalInner: React.FC<AddCardModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { trans, language } = useLanguage() as any;
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    // Fetch client secret when modal opens
    useEffect(() => {
        if (isOpen) {
            const getSetupIntent = async () => {
                try {
                    const response = await api.addCard();
                    if (response.status && response.clientSecret) {
                        setClientSecret(response.clientSecret);
                    } else {
                        setError(language === 'fr' ? "Erreur lors de l'initialisation de l'ajout de carte" : "Error initializing card addition");
                    }
                } catch (err) {
                    setError(language === 'fr' ? "Erreur réseau" : "Network error");
                }
            };
            getSetupIntent();
        }
    }, [isOpen, language]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) return;

        setIsProcessing(true);
        setError(null);

        const cardNumberElement = elements.getElement(CardNumberElement);
        if (!cardNumberElement) return;

        try {
            const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(
                clientSecret,
                {
                    payment_method: {
                        card: cardNumberElement as unknown as StripeCardNumberElement,
                    },
                }
            );

            if (stripeError) {
                setError(stripeError.message || "Something went wrong");
            } else if (setupIntent && setupIntent.status === 'succeeded') {
                setIsSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 2000);
            }
        } catch (err) {
            setError(language === 'fr' ? "Échec de l'ajout de la carte" : "Failed to add card");
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
        success: "Card Added Successfully"
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
                className="bg-white rounded-[40px] p-10 w-full max-w-md shadow-2xl relative z-10 overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                {!isSuccess ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue shadow-inner">
                                {isProcessing ? (
                                    <Loader2 size={24} className="animate-spin" />
                                ) : (
                                    <CreditCard size={24} />
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

                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-display font-bold text-slate-900 mb-2 uppercase tracking-tight">
                                {language === 'fr' ? 'Ajouter une carte' : 'Add New Card'}
                            </h3>
                            <p className="text-slate-500 text-sm">
                                {language === 'fr' ? 'Sécurisez vos paiements futurs' : 'Secure your future payments'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="relative z-10">
                            <div className="space-y-4 mb-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 px-1">{t.cardNumber}</label>
                                    <div className="relative">
                                        <div className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 bg-white transition-all">
                                            <CardNumberElement options={{ style: { base: { fontSize: '14px', color: '#334155', '::placeholder': { color: '#94a3b8' } }, invalid: { color: '#ef4444' } }, disabled: isProcessing || !clientSecret }} />
                                        </div>
                                        <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 px-1">{t.expiry}</label>
                                        <div className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 bg-white transition-all">
                                            <CardExpiryElement options={{ style: { base: { fontSize: '14px', color: '#334155', '::placeholder': { color: '#94a3b8' } }, invalid: { color: '#ef4444' } }, disabled: isProcessing || !clientSecret }} />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-400 px-1">{t.cvc}</label>
                                        <div className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus-within:border-brand-blue focus-within:ring-2 focus-within:ring-brand-blue/20 bg-white transition-all">
                                            <CardCvcElement options={{ style: { base: { fontSize: '14px', color: '#334155', '::placeholder': { color: '#94a3b8' } }, invalid: { color: '#ef4444' } }, disabled: isProcessing || !clientSecret }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

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

                            <button
                                type="submit"
                                disabled={isProcessing || !stripe || !clientSecret}
                                className="w-full py-4 bg-brand-accent text-white font-bold rounded-2xl hover:bg-brand-accent/90 transition-all shadow-lg shadow-brand-accent/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        {t.processing}
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck size={20} />
                                        {language === 'fr' ? 'Enregistrer la carte' : 'Save Card'}
                                    </>
                                )}
                            </button>
                        </form>
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
                            {t.success}
                        </h3>
                        <p className="text-slate-500 mb-4 font-medium text-sm leading-relaxed px-4">
                            {language === 'fr'
                                ? "Votre carte a été enregistrée avec succès."
                                : "Your card has been successfully saved."
                            }
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export const AddCardModal: React.FC<AddCardModalProps> = (props) => {
    return (
        <AnimatePresence>
            {props.isOpen && (
                <Elements stripe={stripePromise}>
                    <AddCardModalInner {...props} />
                </Elements>
            )}
        </AnimatePresence>
    );
};
