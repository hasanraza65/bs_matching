import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { Invoice, User } from '../services/api';

/**
 * Builds a standalone HTML document string for the invoice PDF.
 */
const buildInvoiceHtml = (
  invoice: Invoice,
  user: User,
  language: string,
  t: any
): string => {
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
  const dueDate = new Date(invoice.due_date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  const billingMonth = new Date(invoice.due_date).toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const brandTeal = '#38B2AC';

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Helvetica', 'Arial', sans-serif; }
        body { padding: 60px; color: #334155; background: #ffffff; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; border-bottom: 2px solid ${brandTeal}; padding-bottom: 24px; }
        .title { font-size: 32px; font-weight: 800; color: #0f172a; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .meta { color: #64748b; font-size: 13px; }
        .meta div { margin-bottom: 4px; }
        
        .billing-section { display: flex; justify-content: space-between; margin-bottom: 48px; gap: 40px; }
        .billing-box { flex: 1; }
        .billing-label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 1.5px; margin-bottom: 12px; }
        .billing-info { font-size: 14px; color: #1e293b; line-height: 1.6; }
        .billing-info strong { color: #0f172a; display: block; margin-bottom: 4px; font-size: 15px; }

        .invoice-summary { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 32px; margin-bottom: 48px; }
        .summary-amount { font-size: 28px; font-weight: 800; color: ${brandTeal}; margin-bottom: 4px; }
        .summary-note { font-size: 14px; color: #64748b; font-weight: 500; }

        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .table th { text-align: left; padding: 12px 16px; border-bottom: 2px solid #f1f5f9; color: #94a3b8; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .table td { padding: 20px 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #334155; }
        .table .amount { text-align: right; font-weight: 700; color: #0f172a; }
        .table .qty { text-align: center; }
        .table .price { text-align: right; }

        .totals { display: flex; flex-direction: column; align-items: flex-end; }
        .total-row { display: flex; justify-content: space-between; width: 280px; padding: 10px 16px; font-size: 14px; color: #64748b; }
        .total-row.grand-total { background: #f8fafc; border-radius: 12px; margin-top: 12px; padding: 16px; font-weight: 800; font-size: 18px; color: #0f172a; }

        .footer { margin-top: 80px; padding-top: 32px; border-top: 1px solid #f1f5f9; color: #94a3b8; font-size: 11px; }
        .footer strong { color: #64748b; }
        .footer p { margin-bottom: 6px; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1 class="title">Invoice</h1>
            <div class="meta">
                <div>Invoice #: <strong>${invoice.invoice_num}</strong></div>
                <div>Issued on: <strong>${new Date(invoice.created_at).toLocaleDateString(locale)}</strong></div>
                <div>Due date: <strong>${dueDate}</strong></div>
            </div>
        </div>
    </div>

    <div class="billing-section">
        <div class="billing-box">
            <div class="billing-label">Our Details</div>
            <div class="billing-info">
                <strong>NannyMatch SAS</strong><br>
                123 Boulevard Haussmann<br>
                75008 Paris, France<br>
                contact@nannymatch.fr
            </div>
        </div>
        <div class="billing-box" style="text-align: right;">
            <div class="billing-label">Bill to</div>
            <div class="billing-info">
                <strong>${user.first_name} ${user.last_name}</strong><br>
                ${user.user_address || 'No address provided'}<br>
                ${user.email}
            </div>
        </div>
    </div>

    <div class="invoice-summary">
        <div class="summary-amount">€${parseFloat(invoice.amount).toFixed(2)}</div>
        <div class="summary-note">Total amount due by ${dueDate}</div>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th class="qty">Qty</th>
                <th class="price">Unit Price</th>
                <th class="amount">Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="font-weight: 600;">Childcare Services - ${billingMonth}</td>
                <td class="qty">1</td>
                <td class="price">€${parseFloat(invoice.amount).toFixed(2)}</td>
                <td class="amount">€${parseFloat(invoice.amount).toFixed(2)}</td>
            </tr>
        </tbody>
    </table>

    <div class="totals">
        <div class="total-row">
            <span>Subtotal</span>
            <span>€${parseFloat(invoice.amount).toFixed(2)}</span>
        </div>
        <div class="total-row grand-total">
            <span style="color: ${brandTeal}">Total Amount</span>
            <span>€${parseFloat(invoice.amount).toFixed(2)}</span>
        </div>
    </div>

    <div class="footer">
        <p><strong>Payment Information</strong></p>
        <p>Thank you for choosing NannyMatch for your childcare needs.</p>
        <p>This invoice is subject to our standard terms and conditions.</p>
        <p style="margin-top: 24px; font-size: 9px; opacity: 0.7;">${invoice.invoice_num} • Generated on ${new Date().toLocaleDateString(locale)}</p>
    </div>
</body>
</html>`;
};

/**
 * Generates a professional PDF from invoice data.
 */
export const generateInvoicePdf = async (
  invoice: Invoice,
  user: User,
  language: string,
  translations: any
): Promise<void> => {
  const htmlContent = buildInvoiceHtml(invoice, user, language, translations);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.style.top = '0';
  iframe.style.width = '794px'; // A4 width at 96dpi
  iframe.style.height = '1123px';
  iframe.style.border = 'none';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) throw new Error('Could not access iframe doc');

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    await new Promise(resolve => setTimeout(resolve, 500));

    const canvas = await html2canvas(iframeDoc.body, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [794, 1123],
    });

    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, 794, 1123);
    pdf.save(`${invoice.invoice_num}.pdf`);
  } finally {
    document.body.removeChild(iframe);
  }
};
