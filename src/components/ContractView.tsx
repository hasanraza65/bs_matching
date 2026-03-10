import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ArrowLeft, ShieldCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api, ContractResponse } from '../services/api';
import { SlideToAccept } from './SlideToAccept';
import { useLanguage } from '../i18n/LanguageContext';

interface ContractViewProps {
    userName: string;
    onBack: () => void;
    onAccept: () => void;
    onRefuse: () => void;
    choiceId: number;
}

export const ContractView: React.FC<ContractViewProps> = ({ userName, onBack, onAccept, onRefuse, choiceId }) => {
    const { t: trans, language } = useLanguage();
    const t = trans.contract;

    const [contractData, setContractData] = useState<ContractResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoading(true);
                const data = await api.getContract(choiceId);
                if (data.status) {
                    setContractData(data);
                } else {
                    setError(language === 'fr' ? "Impossible de charger les détails du contrat" : "Could not load contract specifics");
                }
            } catch (err) {
                setError(language === 'fr' ? "Erreur lors de la récupération des données" : "Failed to fetch contract data");
            } finally {
                setLoading(false);
            }
        };

        fetchContract();
    }, [choiceId, language]);

    const calculateHoursFromSlot = (slot: string): number => {
        try {
            const separator = slot.includes(' : ') ? ' : ' : ' - ';
            const [start, end] = slot.split(separator).map(s => s.trim());
            const [startH, startM] = start.split(':').map(Number);
            const [endH, endM] = end.split(':').map(Number);

            const startDecimal = startH + (startM / 60);
            const endDecimal = endH + (endM / 60);

            return Math.max(0, endDecimal - startDecimal);
        } catch (e) {
            return 0;
        }
    };

    const getMonthlyHours = (monthDates: Record<string, string[]>): number => {
        let total = 0;
        Object.values(monthDates).forEach(slots => {
            (slots as string[]).forEach(slot => {
                total += calculateHoursFromSlot(slot);
            });
        });
        return total;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-brand-beige flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-brand-blue animate-spin mx-auto mb-4" />
                    <p className="text-slate-600 font-bold">{t.actions.loading}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-brand-beige flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">Oops!</h2>
                    <p className="text-slate-500 mb-8">{error}</p>
                    <button onClick={onBack} className="w-full py-4 bg-brand-blue text-white font-bold rounded-2xl">
                        {t.actions.back}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-beige py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors mb-8 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold">{t.actions.back}</span>
                </button>

                {/* Contract Paper */}
                <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 p-8 sm:p-12 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/5 rounded-full -mr-32 -mt-32 blur-3xl" />

                    <div className="relative z-10">
                        {/* Header Section */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue">
                                    <FileText size={28} />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
                                    {t.title}
                                </h1>
                            </div>
                            <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">ID</p>
                                <p className="text-sm font-display font-bold text-slate-700">#CTR-{choiceId}-{contractData?.contract_id}</p>
                            </div>
                        </div>

                        {/* Contract Content */}
                        <div className="space-y-10 max-h-[70vh] overflow-y-auto pr-4 no-scrollbar custom-scroll font-sans text-slate-700 leading-relaxed">

                            {/* Parties */}
                            <section>
                                <h2 className="text-xl font-display font-bold text-slate-900 mb-6 uppercase tracking-wide">
                                    {t.between}
                                </h2>
                                <p className="mb-6 text-sm sm:text-base">
                                    {t.agency}
                                </p>
                                <p className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-wider">{t.part1}</p>
                                <p className="font-bold text-slate-900 mb-2 uppercase text-[10px] tracking-wider">{t.part2}</p>
                                <div className="mb-4 text-sm sm:text-base">
                                    {contractData ? (
                                        <p>
                                            <strong className="text-slate-900">{contractData.user.first_name} {contractData.user.last_name}</strong>
                                            {contractData.user.user_address && (
                                                <span className="mx-1">{t.domiciledAt} {contractData.user.user_address}</span>
                                            )}
                                            {contractData.user.user_phone && (
                                                <span className="mx-1">{t.reachableAt} {contractData.user.user_phone}</span>
                                            )}
                                            {contractData.user.email && (
                                                <span className="mx-1">{language === 'fr' ? 'et' : 'and'} {contractData.user.email}</span>
                                            )}
                                        </p>
                                    ) : (
                                        <strong className="text-slate-900">{userName}</strong>
                                    )}
                                </div>
                                <p className="mb-4 italic text-slate-500 text-sm">{t.clientDesignation}</p>
                                <p className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">{t.partOther}</p>
                            </section>

                            <p className="py-4 border-y border-slate-50 text-center font-medium text-slate-500 italic text-sm">
                                {t.agreedFollowing}
                            </p>

                            {/* Article 1 - Schedule */}
                            <section>
                                <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">1</span>
                                    {t.article1.title}
                                </h3>
                                <p className="mb-6 text-sm sm:text-base">{t.article1.content}</p>

                                <div className="space-y-6 mb-8">
                                    {contractData && contractData.format1 ? (
                                        Object.entries(contractData.format1 as Record<string, Record<string, string[]>>).map(([month, dates]) => {
                                            const monthlyHours = getMonthlyHours(dates);
                                            return (
                                                <div key={month} className="bg-slate-50/50 rounded-[24px] p-6 border border-slate-100">
                                                    <h4 className="text-brand-blue font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                                                        <div className="w-1.5 h-1.5 bg-brand-blue rounded-full" />
                                                        {month}
                                                    </h4>
                                                    <div className="space-y-3 mb-4">
                                                        {Object.entries(dates).map(([date, slots]) => (
                                                            <div key={date} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2.5 border-b border-slate-100 last:border-0 gap-1 sm:gap-0">
                                                                <span className="text-sm font-medium text-slate-600 capitalize">
                                                                    {new Date(date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                                                                </span>
                                                                <span className="text-xs sm:text-sm font-bold text-brand-blue bg-white px-4 py-1.5 rounded-full border border-brand-blue/10 shadow-sm self-start sm:self-auto">
                                                                    {(slots as string[]).join(' - ')}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-right text-xs font-bold text-slate-400 border-t border-slate-100 pt-4">
                                                        {t.article1.totalMonth.replace('{month}', month)} <span className="text-brand-blue ml-1 font-display text-sm">{monthlyHours.toFixed(2)} h</span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-slate-400 italic text-sm">{t.actions.loading}</p>
                                    )}
                                </div>
                                <div className="p-5 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 flex justify-between items-center shadow-inner">
                                    <span className="text-slate-700 font-bold text-sm">{t.article1.totalPeriod}</span>
                                    <span className="text-xl font-display font-bold text-brand-blue">
                                        {contractData ?
                                            Object.values(contractData.format1 as Record<string, Record<string, string[]>>).reduce((total: number, monthDates) => total + getMonthlyHours(monthDates as Record<string, string[]>), 0).toFixed(2)
                                            : '0.00'} h
                                    </span>
                                </div>
                            </section>

                            {/* Article 2 - Location */}
                            <section>
                                <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">2</span>
                                    {t.article2.title}
                                </h3>
                                <p className="text-sm sm:text-base leading-relaxed">{t.article2.content}</p>
                            </section>

                            {/* Article 3 - Duration */}
                            <section>
                                <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">3</span>
                                    {t.article3.title}
                                </h3>
                                <p className="mb-6 text-sm sm:text-base leading-relaxed">
                                    {t.article3.content
                                        .replace('{start}', contractData?.start_date ? new Date(contractData.start_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Date]')
                                        .replace('{end}', contractData?.end_date ? new Date(contractData.end_date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '[Date]')
                                    }
                                </p>
                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                    <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase tracking-wide">{t.article3.subTitle}</h4>
                                    <p className="text-xs sm:text-sm text-slate-500 italic">{t.article3.subContent}</p>
                                </div>
                            </section>

                            {/* Article 4 - Payment Table */}
                            <section>
                                <h3 className="text-lg font-display font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue text-sm">4</span>
                                    {t.article4.title}
                                </h3>
                                <p className="mb-6 text-sm sm:text-base">{t.article4.content}</p>

                                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm mb-6 bg-white">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50">
                                                <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">{t.article4.period}</th>
                                                <th className="px-5 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">{t.article4.hrTotal}</th>
                                                <th className="px-5 py-4 text-[10px] font-bold text-brand-blue uppercase tracking-widest border-b border-slate-200">{t.article4.amountTtc}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {contractData && Object.keys(contractData.format2).map((month) => {
                                                const monthData = (contractData.format1 as Record<string, Record<string, string[]>>)[month];
                                                const monthlyHours = monthData ? getMonthlyHours(monthData) : 0;
                                                return (
                                                    <tr key={month} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-5 py-5 text-sm font-bold text-slate-700">{month}</td>
                                                        <td className="px-5 py-5 text-sm font-medium text-slate-500">{monthlyHours.toFixed(2)} h</td>
                                                        <td className="px-5 py-5 text-sm font-bold text-slate-900 font-display">
                                                            {contractData.format2[month]?.toFixed(2) || "0.00"} €
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            <tr className="bg-brand-blue/[0.03]">
                                                <td colSpan={2} className="px-5 py-4 text-xs font-bold text-slate-400 text-right uppercase tracking-[0.25em]">{t.article4.hourlyRate}</td>
                                                <td className="px-5 py-4 text-sm font-bold text-brand-blue font-display">{contractData?.hourly_rate || "0.00"} € / h</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <p className="text-[10px] text-slate-400 italic mb-4">{t.article4.taxNote}</p>
                            </section>

                            {/* Additional Articles */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-slate-100 mb-10">
                                <section>
                                    <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-widest">{t.article5.title}</h4>
                                    <p className="text-[11px] leading-relaxed text-slate-500 italic">{t.article5.content}</p>
                                </section>
                                <section>
                                    <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-widest">{t.article18.title}</h4>
                                    <p className="text-[11px] leading-relaxed text-slate-500 italic">{t.article18.content}</p>
                                </section>
                            </div>

                            {/* Signature Line */}
                            <div className="pt-10 border-t border-slate-100 flex flex-col items-end gap-2 text-slate-500">
                                <p className="text-xs">
                                    {t.signatureLocationDate.replace('{date}', new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' }))}
                                </p>
                                <div className="flex flex-col items-end">
                                    <p className="font-display font-bold text-brand-blue text-sm italic underline underline-offset-8 decoration-brand-blue/20">
                                        {t.electronicSignature}
                                    </p>
                                    <div className="w-32 h-0.5 bg-brand-blue/10 mt-2 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onRefuse} // Use onRefuse here
                        className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                        {t.actions.refuse}
                    </button>
                    <button
                        onClick={() => setShowAcceptModal(true)}
                        className="flex-1 py-4 bg-brand-blue text-white font-bold rounded-2xl hover:bg-brand-blue-dark transition-all shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {t.actions.accept}
                    </button>
                </div>
            </div>

            {/* Slide to Accept Modal */}
            <AnimatePresence>
                {showAcceptModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isAccepted && setShowAcceptModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-white rounded-[40px] p-10 w-full max-m-md shadow-2xl relative z-10 overflow-hidden"
                            style={{ maxWidth: '448px' }}
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 rounded-full -mr-16 -mt-16 blur-2xl" />

                            {!isAccepted ? (
                                <>
                                    <div className="text-center mb-10">
                                        <div className="w-20 h-20 bg-brand-blue/10 rounded-[32px] flex items-center justify-center text-brand-blue mx-auto mb-6 shadow-inner">
                                            <ShieldCheck size={42} />
                                        </div>
                                        <h3 className="text-2xl font-display font-bold text-slate-900 mb-3 uppercase tracking-tight">
                                            {t.actions.slide}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed px-4">
                                            {language === 'fr'
                                                ? "En glissant, vous acceptez les termes et conditions énoncés dans le contrat de service."
                                                : "By sliding, you agree to the terms and conditions outlined in the service contract."
                                            }
                                        </p>
                                    </div>

                                    <div className="px-2">
                                        <SlideToAccept
                                            onAccept={() => setIsAccepted(true)}
                                            label={t.actions.slide}
                                        />
                                    </div>

                                    <button
                                        onClick={() => setShowAcceptModal(false)}
                                        className="w-full mt-6 text-slate-400 font-bold text-sm tracking-wide hover:text-slate-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-4"
                                >
                                    <div className="w-24 h-24 bg-green-50 rounded-[40px] flex items-center justify-center text-green-500 mx-auto mb-8 shadow-[0_10px_40px_-10px_rgba(34,197,94,0.3)]">
                                        <CheckCircle2 size={48} />
                                    </div>
                                    <h3 className="text-3xl font-display font-bold text-slate-900 mb-3">
                                        {t.actions.success}
                                    </h3>
                                    <p className="text-slate-500 mb-10 font-medium">
                                        {language === 'fr'
                                            ? "Votre contrat a été signé électroniquement avec succès."
                                            : "Your contract has been successfully signed electronically."
                                        }
                                    </p>
                                    <button
                                        onClick={onAccept}
                                        className="w-full py-4 bg-brand-blue text-white font-bold rounded-2xl hover:bg-brand-blue-dark transition-all shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)]"
                                    >
                                        Back to Dashboard
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style>{`
                .custom-scroll::-webkit-scrollbar {
                  width: 5px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                  background: #f8fafc;
                  border-radius: 10px;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                  background: #e2e8f0;
                  border-radius: 10px;
                }
                .custom-scroll::-webkit-scrollbar-thumb:hover {
                  background: #cbd5e1;
                }
            `}</style>
        </div>
    );
};
