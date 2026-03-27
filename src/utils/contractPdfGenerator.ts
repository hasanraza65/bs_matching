import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { ContractResponse } from '../services/api';

/**
 * Calculates hours from a time-slot string like "18:30 - 20:30"
 */
const calculateHoursFromSlot = (slot: string): number => {
    try {
        const separator = slot.includes(' : ') ? ' : ' : ' - ';
        const [start, end] = slot.split(separator).map(s => s.trim());
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        return Math.max(0, (endH + endM / 60) - (startH + startM / 60));
    } catch {
        return 0;
    }
};

/**
 * Calculates total hours for a month's schedule data
 */
const getMonthlyHours = (monthDates: Record<string, string[]>): number => {
    let total = 0;
    Object.values(monthDates).forEach(slots => {
        (slots as string[]).forEach(slot => {
            total += calculateHoursFromSlot(slot);
        });
    });
    return total;
};

/**
 * Formats a month string like "January 2026" into localized format
 */
const formatMonthString = (monthStr: string, language: string): string => {
    try {
        const [monthName, year] = monthStr.split(' ');
        const date = new Date(Date.parse(`${monthName} 1, ${year}`));
        if (isNaN(date.getTime())) return monthStr;
        return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' });
    } catch {
        return monthStr;
    }
};

/**
 * Formats a date string into localized format
 */
const formatDate = (dateStr: string, language: string): string => {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    } catch {
        return dateStr;
    }
};

/**
 * Formats a date string for schedule display (e.g., "lundi 3 mars")
 */
const formatScheduleDate = (dateStr: string, language: string): string => {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'long', day: 'numeric', month: 'long'
        });
    } catch {
        return dateStr;
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslationContract = any;

/**
 * Builds a standalone HTML document string for the contract PDF.
 * All styles are inline — no external CSS, no oklch, no Tailwind.
 */
const buildContractHtml = (
    data: ContractResponse,
    language: string,
    t: TranslationContract,
    choiceId: number
): string => {
    const locale = language === 'fr' ? 'fr-FR' : 'en-US';

    // --- Schedule Section (Article 1) ---
    let scheduleHtml = '';
    if (data.format1) {
        const totalAllHours = Object.values(data.format1 as Record<string, Record<string, string[]>>)
            .reduce((acc, monthDates) => acc + getMonthlyHours(monthDates), 0);

        Object.entries(data.format1 as Record<string, Record<string, string[]>>).forEach(([month, dates]) => {
            const formattedMonth = formatMonthString(month, language);
            const monthlyHours = getMonthlyHours(dates);

            let datesHtml = '';
            Object.entries(dates).forEach(([date, slots]) => {
                datesHtml += `
                    <tr>
                        <td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #334155; text-transform: capitalize;">
                            ${formatScheduleDate(date, language)}
                        </td>
                        <td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #1e40af; font-weight: 600; text-align: right;">
                            ${(slots as string[]).join(' — ')}
                        </td>
                    </tr>
                `;
            });

            scheduleHtml += `
                <div style="margin-bottom: 16px;">
                    <p style="font-size: 11px; font-weight: 700; color: #1e40af; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                        ● ${formattedMonth}
                    </p>
                    <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                        ${datesHtml}
                    </table>
                    <p style="text-align: right; font-size: 11px; color: #64748b; margin-top: 4px;">
                        ${t.article1.totalMonth.replace('{month}', formattedMonth)} <strong style="color: #1e40af;">${monthlyHours.toFixed(2)} h</strong>
                    </p>
                </div>
            `;
        });

        scheduleHtml += `
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                <span style="font-weight: 700; font-size: 13px; color: #334155;">${t.article1.totalPeriod}</span>
                <span style="font-weight: 800; font-size: 16px; color: #1e40af;">${totalAllHours.toFixed(2)} h</span>
            </div>
        `;
    }

    // --- Payment Table (Article 4) ---
    let paymentRowsHtml = '';
    if (data.format2) {
        Object.entries(data.format2 as Record<string, number>).forEach(([month, total]) => {
            const hrs = data.format1[month] ? getMonthlyHours(data.format1[month]).toFixed(2) : '0.00';
            paymentRowsHtml += `
                <tr>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #334155; text-transform: capitalize;">${formatMonthString(month, language)}</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">${hrs}h</td>
                    <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #1e40af; font-weight: 700;">${total.toFixed(2)} €</td>
                </tr>
            `;
        });
    }

    const paymentTableHtml = `
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; margin-bottom: 8px;">
            <thead>
                <tr style="background: #f8fafc;">
                    <th style="padding: 8px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700;">${t.article4.period}</th>
                    <th style="padding: 8px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700;">${t.article4.hrTotal}</th>
                    <th style="padding: 8px 12px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 700;">${t.article4.amountTtc}</th>
                </tr>
            </thead>
            <tbody>
                ${paymentRowsHtml}
            </tbody>
            <tfoot>
                <tr style="background: #eff6ff; border-top: 1px solid #bfdbfe;">
                    <td style="padding: 8px 12px; font-weight: 700; font-size: 12px; color: #0f172a;">${t.article4.hourlyRate}</td>
                    <td colspan="2" style="padding: 8px 12px; text-align: right; font-weight: 800; font-size: 14px; color: #1e40af; font-style: italic;">
                        ${data.hourly_rate ? `${data.hourly_rate} €/h` : '-- €/h'}
                    </td>
                </tr>
            </tfoot>
        </table>
        <p style="font-size: 10px; color: #94a3b8; font-style: italic;">${t.article4.taxNote}</p>
    `;

    // --- User info ---
    const userParts: string[] = [];
    userParts.push(`<strong>${data.user.first_name} ${data.user.last_name}</strong>`);
    if (data.user.user_address) {
        userParts.push(`${t.domiciledAt} ${data.user.user_address}`);
    }
    if (data.user.user_phone) {
        userParts.push(`${t.reachableAt} ${data.user.user_phone}`);
    }
    if (data.user.email) {
        userParts.push(`${language === 'fr' ? 'et' : 'and'} ${data.user.email}`);
    }

    // --- Article helper for simple articles ---
    const articleBlock = (num: number, title: string, bodyHtml: string): string => `
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
            <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background: #eff6ff; color: #1e40af; border-radius: 6px; font-size: 12px; font-weight: 700;">${num}</span>
                ${title}
            </h3>
            <div style="font-size: 12px; color: #475569; line-height: 1.7;">
                ${bodyHtml}
            </div>
        </div>
    `;

    // --- Date formatting for signature ---
    const todayFormatted = new Date().toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

    // --- Build complete HTML ---
    return `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Pacifico&family=Great+Vibes&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #334155;
            background: #ffffff;
            padding: 40px 48px;
            line-height: 1.6;
            font-size: 12px;
        }
        p { margin-bottom: 8px; }
    </style>
</head>
<body>
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #1e40af;">
        <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">
            ${t.title}
        </h1>
        <p style="font-size: 11px; color: #94a3b8;">ID: #CTR-${choiceId}-${data.contract_id}</p>
    </div>

    <!-- Parties -->
    <div style="margin-bottom: 24px;">
        <h2 style="font-size: 14px; font-weight: 700; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
            ${t.between}
        </h2>
        <p style="font-size: 12px; margin-bottom: 10px;">${t.agency}</p>
        <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 4px;">${t.part1}</p>
        <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; margin-bottom: 4px;">${t.part2}</p>
        <p style="font-size: 12px; margin-bottom: 6px;">${userParts.join(' ')}</p>
        <p style="font-size: 12px; font-style: italic; color: #64748b; margin-bottom: 4px;">${t.clientDesignation}</p>
        <p style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0f172a;">${t.partOther}</p>
    </div>

    <p style="text-align: center; font-style: italic; color: #64748b; padding: 10px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; margin-bottom: 24px; font-size: 12px;">
        ${t.agreedFollowing}
    </p>

    <!-- Article 1 - Schedule -->
    ${articleBlock(1, t.article1.title, `
        <p>${t.article1.content}</p>
        ${scheduleHtml}
    `)}

    <!-- Article 2 -->
    ${articleBlock(2, t.article2.title, `<p>${t.article2.content}</p>`)}

    <!-- Article 3 -->
    ${articleBlock(3, t.article3.title, `
        <p>${t.article3.content.replace('{start}', data.start_date ? formatDate(data.start_date, language) : '[Date]').replace('{end}', data.end_date ? formatDate(data.end_date, language) : '[Date]')}</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-top: 8px;">
            <p style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 4px;">${t.article3.subTitle}</p>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">${t.article3.subContent}</p>
        </div>
    `)}

    <!-- Article 4 - Payment -->
    ${articleBlock(4, t.article4.title, `
        <p style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 4px;">${t.article4.subTitle41}</p>
        <p>${t.article4.content}</p>
        ${paymentTableHtml}
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-top: 12px;">
            <p style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 4px;">${t.article4.subTitle42}</p>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">${t.article4.content42}</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-top: 8px;">
            <p style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 4px;">${t.article4.subTitle43}</p>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">${t.article4.content43}</p>
        </div>
    `)}

    <!-- Article 5 -->
    ${articleBlock(5, t.article5.title, `<p>${t.article5.content}</p>`)}

    <!-- Article 6 -->
    ${articleBlock(6, t.article6.title, `
        <p>${t.article6.content1}</p>
        <p>${t.article6.content2}</p>
        <p>${t.article6.content3}</p>
    `)}

    <!-- Article 7 -->
    ${articleBlock(7, t.article7.title, `<p>${t.article7.content}</p>`)}

    <!-- Article 8 -->
    ${articleBlock(8, t.article8.title, `<p>${t.article8.content}</p>`)}

    <!-- Article 9 -->
    ${articleBlock(9, t.article9.title, `
        <p>${t.article9.content1}</p>
        <p>${t.article9.content2}</p>
        <p>${t.article9.content3}</p>
        <p>${t.article9.content4}</p>
    `)}

    <!-- Article 10 -->
    ${articleBlock(10, t.article10.title, `<p>${t.article10.content}</p>`)}

    <!-- Article 11 -->
    ${articleBlock(11, t.article11.title, `
        <p>${t.article11.content}</p>
        <ul style="padding-left: 20px; margin-top: 6px;">
            <li style="margin-bottom: 4px;">${t.article11.item1}</li>
            <li style="margin-bottom: 4px;">${t.article11.item2}</li>
            <li style="margin-bottom: 4px;">${t.article11.item3}</li>
        </ul>
    `)}

    <!-- Article 12 -->
    ${articleBlock(12, t.article12.title, `<p>${t.article12.content}</p>`)}

    <!-- Article 13 -->
    ${articleBlock(13, t.article13.title, `
        <p>${t.article13.content1}</p>
        <p>${t.article13.content2}</p>
        <p>${t.article13.content3}</p>
    `)}

    <!-- Article 14 -->
    ${articleBlock(14, t.article14.title, `
        <p>${t.article14.content1}</p>
        <p>${t.article14.content2}</p>
        <p>${t.article14.content3}</p>
        <p>${t.article14.content4}</p>
        <p>${t.article14.content5}</p>
        <p style="font-style: italic; font-weight: 500;">${t.article14.content6}</p>
    `)}

    <!-- Article 15 -->
    ${articleBlock(15, t.article15.title, `
        <div style="margin-bottom: 8px;">
            <p style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 2px;">${t.article15.subTitle151}</p>
            <p>${t.article15.content151}</p>
        </div>
        <div style="margin-bottom: 8px;">
            <p style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 2px;">${t.article15.subTitle152}</p>
            <p>${t.article15.content152}</p>
        </div>
        <div>
            <p style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 2px;">${t.article15.subTitle153}</p>
            <p>${t.article15.content153}</p>
        </div>
    `)}

    <!-- Article 16 -->
    ${articleBlock(16, t.article16.title, `
        <p>${t.article16.content1}</p>
        <p>${t.article16.content2}</p>
        <p>${t.article16.content3}</p>
        <p>${t.article16.content4}</p>
        <p>${t.article16.content5}</p>
        <p style="font-style: italic; font-weight: 500;">${t.article16.content6}</p>
    `)}

    <!-- Article 17 -->
    ${articleBlock(17, t.article17.title, `
        <p>${t.article17.content1}</p>
        <div style="padding-left: 16px; margin: 6px 0;">
            <p>${t.article17.itemA}</p>
            <p>${t.article17.itemB}</p>
        </div>
        <p>${t.article17.content2}</p>
        <p>${t.article17.content3}</p>
        <p>${t.article17.content4}</p>
        <p style="font-style: italic; font-weight: 500;">${t.article17.content5}</p>
    `)}

    <!-- Article 18 -->
    ${articleBlock(18, t.article18.title, `
        <p>${t.article18.content1}</p>
        <p>${t.article18.content2}</p>
        <p>${t.article18.content3}</p>
        <p>${t.article18.content4}</p>
    `)}

    <!-- Article 19 -->
    ${articleBlock(19, t.article19.title, `
        <p>${t.article19.contentA}</p>
        <p>${t.article19.contentB}</p>
        <p>${t.article19.contentC}</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-top: 10px;">
            <p style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 4px;">${t.article19.subTitle1}</p>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">${t.article19.subContent1A}</p>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">${t.article19.subContent1B}</p>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">${t.article19.subContent1C}</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px 14px; margin-top: 8px;">
            <p style="font-weight: 700; font-size: 12px; color: #0f172a; margin-bottom: 4px;">${t.article19.subTitle2}</p>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">${t.article19.subContent2A}</p>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">${t.article19.subContent2B}</p>
            <p style="font-size: 11px; color: #64748b; font-style: italic;">${t.article19.subContent2C}</p>
        </div>
    `)}

    <!-- Annexe -->
    <div style="margin-top: 28px; padding-top: 20px; border-top: 2px solid #1e40af;">
        <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 12px;">${t.annexe.title}</h3>
        <div style="font-size: 12px; color: #475569; line-height: 1.7;">
            <p>${t.annexe.content1}</p>
            <p>${t.annexe.content2}</p>
            <ul style="padding-left: 20px; margin: 6px 0;">
                <li style="margin-bottom: 4px;">${t.annexe.item1}</li>
                <li style="margin-bottom: 4px;">${t.annexe.item2}</li>
                <li style="margin-bottom: 4px;">${t.annexe.item3}</li>
                <li style="margin-bottom: 4px;">${t.annexe.item4}</li>
                <li style="margin-bottom: 4px;">${t.annexe.item5}</li>
            </ul>
            <p style="font-style: italic; color: #64748b;">${t.annexe.content3}</p>
            <p>${t.annexe.content4}</p>
        </div>
    </div>

    <!-- Signature -->
    <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: right;">
        <p style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            ${t.signatureLocationDate.replace('{date}', todayFormatted)}
        </p>
        <p style="font-size: 13px; font-weight: 700; color: #1e40af; font-style: italic; text-decoration: underline; text-underline-offset: 6px;">
            ${t.electronicSignature}
        </p>
        ${data.user && (data.user.first_name || data.user.last_name) ? `
            <p style="font-size:18px; font-weight:700; color:#0f172a; font-family: 'French Script MT', 'Great Vibes', 'Pacifico', cursive; margin-top:6px;">${data.user.first_name} ${data.user.last_name}</p>
        ` : ''}
    </div>
</body>
</html>`;
};


/**
 * Generates a multi-page A4 PDF from the contract data.
 * Creates a hidden iframe, renders clean HTML in it, captures with html2canvas,
 * and slices into A4 pages.
 */
export const generateContractPdf = async (
    data: ContractResponse,
    language: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    translations: any,
    choiceId: number
): Promise<void> => {
    const t = translations.contract;
    const htmlContent = buildContractHtml(data, language, t, choiceId);

    // Create hidden iframe for clean rendering
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '794px'; // A4 width at 96dpi (~210mm)
    iframe.style.height = '1123px';
    iframe.style.border = 'none';
    iframe.style.visibility = 'hidden';
    document.body.appendChild(iframe);

    try {
        // Write HTML to iframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) {
            throw new Error('Could not access iframe document');
        }

        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        // Wait for content to render
        await new Promise(resolve => setTimeout(resolve, 500));

        const body = iframeDoc.body;

        // Capture the full height of the content
        const canvas = await html2canvas(body, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: 794,
            windowWidth: 794,
            windowHeight: body.scrollHeight,
        });

        // A4 dimensions in px at scale=2 (96 DPI)
        const A4_WIDTH_PX = 794;
        const A4_HEIGHT_PX = 1123;
        const SCALE = 2;

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [A4_WIDTH_PX, A4_HEIGHT_PX],
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // How many pages we need
        const pageCanvasHeight = A4_HEIGHT_PX * SCALE; // height per page in canvas pixels
        const totalPages = Math.ceil(canvasHeight / pageCanvasHeight);

        for (let page = 0; page < totalPages; page++) {
            if (page > 0) {
                pdf.addPage();
            }

            // Create a temporary canvas for this page slice
            const pageCanvas = document.createElement('canvas');
            pageCanvas.width = canvasWidth;
            pageCanvas.height = pageCanvasHeight;

            const ctx = pageCanvas.getContext('2d');
            if (!ctx) continue;

            // Fill white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

            // Draw the slice from the full canvas
            const sourceY = page * pageCanvasHeight;
            const sourceHeight = Math.min(pageCanvasHeight, canvasHeight - sourceY);

            ctx.drawImage(
                canvas,
                0, sourceY,           // source x, y
                canvasWidth, sourceHeight, // source width, height
                0, 0,                 // dest x, y
                canvasWidth, sourceHeight  // dest width, height
            );

            const pageImgData = pageCanvas.toDataURL('image/png');
            pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        }

        pdf.save(`Contract-${choiceId}-${data.contract_id || 'draft'}.pdf`);
    } finally {
        // Clean up
        document.body.removeChild(iframe);
    }
};
