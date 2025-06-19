import jsPDF from 'jspdf';
import QRCode from 'qrcode';

export const generateCertificatePDF = async (certificateData) => {
  const localT = (certificateData && typeof certificateData.t === 'function') 
                  ? certificateData.t 
                  : (key, options) => { 
                      let replacedKey = key;
                      if (options && typeof options === 'object') {
                        Object.entries(options).forEach(([optKey, optVal]) => {
                          if (optKey !== 'lng') { // ignore lng for simple fallback
                            replacedKey = replacedKey.replace(`{{${optKey}}}`, String(optVal));
                          }
                        });
                      }
                      return replacedKey; 
                    };
  const localLang = (certificateData && certificateData.lang) ? certificateData.lang.split('-')[0] : 'es';

  const getTranslationForPdf = (key, options = {}) => {
    let translation = localT(key, { lng: localLang, ...options });

    if (key.startsWith('pdf')) {
      let secondaryLang = 'en';
      if (localLang === 'es') secondaryLang = 'en';
      else if (localLang === 'en') secondaryLang = 'es';
      else if (localLang === 'fr') secondaryLang = 'en';
      else if (localLang === 'pt') secondaryLang = 'en';
      
      if (localLang !== secondaryLang) {
        const secondaryTranslation = localT(key, { lng: secondaryLang, ...options });
        if (translation !== secondaryTranslation && secondaryTranslation !== key) {
          translation = `${translation} / ${secondaryTranslation}`;
        }
      }
    }
    return translation;
  };

  try {
    if (!certificateData) {
      throw new Error(getTranslationForPdf('errorGeneratingCertificateDesc'));
    }
    const { patientName, documentId, birthDate, country, vaccines, issueDate, qrCode } = certificateData;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const MARGIN = 15;
    const PAGE_WIDTH = pdf.internal.pageSize.getWidth();
    const PAGE_HEIGHT = pdf.internal.pageSize.getHeight();
    const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;

    const primaryColor = [17, 24, 39]; 
    const secondaryColor = [75, 85, 99]; 
    const accentColor = [37, 99, 235]; 
    const borderColor = [209, 213, 219]; 

    pdf.setDrawColor(...borderColor);
    pdf.setTextColor(...primaryColor);

    let yPos = MARGIN;

    const addHeader = () => {
      pdf.setFillColor(...accentColor);
      pdf.rect(0, 0, PAGE_WIDTH, 30, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      const titleMain = localLang === 'es' ? localT('pdfTitle', {lng: 'es'}) : localT('pdfTitle', {lng: localLang});
      const titleSubKey = localLang === 'es' ? 'en' : (localLang === 'en' ? 'es' : 'en');
      const titleSub = localT('pdfTitle', {lng: titleSubKey });
      
      pdf.text(titleMain, PAGE_WIDTH / 2, MARGIN + 3, { align: 'center' });
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      if(titleMain !== titleSub && titleSub !== 'pdfTitle') {
        pdf.text(titleSub, PAGE_WIDTH / 2, MARGIN + 10, { align: 'center' });
      }
      
      yPos = 30 + MARGIN;
    };
    
    addHeader();

    const addSectionTitle = (titleKey, subtitleKey = null) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.setTextColor(...primaryColor);
      pdf.text(getTranslationForPdf(titleKey).toUpperCase(), MARGIN, yPos);
      if (subtitleKey) {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...secondaryColor);
        pdf.text(getTranslationForPdf(subtitleKey).toUpperCase(), MARGIN, yPos + 4);
        yPos += 2;
      }
      yPos += 6;
      pdf.setLineWidth(0.3);
      pdf.line(MARGIN, yPos, PAGE_WIDTH - MARGIN, yPos);
      yPos += 8;
    };

    addSectionTitle('pdfSubtitle');

    const patientInfo = [
      { labelKey: 'pdfPatientName', value: patientName },
      { labelKey: 'pdfDocumentId', value: documentId },
      { labelKey: 'pdfBirthDate', value: new Date(birthDate).toLocaleDateString(localLang, { year: 'numeric', month: 'long', day: 'numeric' }) },
      { labelKey: 'pdfCountry', value: country || getTranslationForPdf('pdfCountryNotSpecified') },
    ];

    pdf.setFontSize(10);
    patientInfo.forEach(info => {
      if (yPos > PAGE_HEIGHT - MARGIN - 20) { 
        pdf.addPage();
        addHeader();
        addSectionTitle('pdfHoldersInfoCont');
      }
      const label = getTranslationForPdf(info.labelKey);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...primaryColor);
      pdf.text(label, MARGIN, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...secondaryColor);
      const valueText = String(info.value || getTranslationForPdf('pdfNotApplicable'));
      const lines = pdf.splitTextToSize(valueText, CONTENT_WIDTH - (pdf.getStringUnitWidth(label) * pdf.getFontSize() / pdf.internal.scaleFactor) - 5);
      pdf.text(lines, MARGIN + (pdf.getStringUnitWidth(label) * pdf.getFontSize() / pdf.internal.scaleFactor) + 3 , yPos);
      yPos += (lines.length * 4.5) + 4;
    });
    yPos += 5;

    addSectionTitle('pdfVaccinationHistory');

    if (vaccines && vaccines.length > 0) {
      const tableHeaders = [
        getTranslationForPdf('pdfVaccine'), 
        getTranslationForPdf('pdfDose'), 
        getTranslationForPdf('pdfLot'), 
        getTranslationForPdf('pdfDate'), 
        getTranslationForPdf('pdfPlace'), 
        getTranslationForPdf('pdfProfessional')
      ];
      const colWidthsRatio = [0.25, 0.12, 0.13, 0.15, 0.20, 0.15]; 
      const colWidths = colWidthsRatio.map(r => r * CONTENT_WIDTH);
      
      let currentX = MARGIN;

      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...primaryColor);
      tableHeaders.forEach((header, i) => {
        pdf.rect(currentX, yPos, colWidths[i], 10, 'S');
        const headerLines = pdf.splitTextToSize(header, colWidths[i] - 4);
        pdf.text(headerLines, currentX + colWidths[i]/2, yPos + 5, {align: 'center', baseline: 'middle'});
        currentX += colWidths[i];
      });
      yPos += 10;
      pdf.setTextColor(...secondaryColor);

      vaccines.forEach(vaccine => {
        currentX = MARGIN;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        
        const rowData = [
          vaccine.vaccineName,
          vaccine.dose,
          vaccine.vaccineLot || getTranslationForPdf('pdfNotApplicable'),
          new Date(vaccine.vaccinationDate).toLocaleDateString(localLang),
          vaccine.vaccinationPlace,
          vaccine.healthProfessional
        ];

        let maxLines = 1;
        rowData.forEach((text, i) => {
          const lines = pdf.splitTextToSize(String(text || getTranslationForPdf('pdfNotApplicable')), colWidths[i] - 4);
          if (lines.length > maxLines) maxLines = lines.length;
        });
        const rowHeight = Math.max(maxLines * 3.5 + 4, 8); 

        if (yPos + rowHeight > PAGE_HEIGHT - MARGIN - 30) { 
          pdf.addPage();
          addHeader();
          addSectionTitle('pdfVaccinationHistoryCont');
          
          currentX = MARGIN; 
          pdf.setFontSize(8.5);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(...primaryColor);
          tableHeaders.forEach((header, i) => {
            pdf.rect(currentX, yPos, colWidths[i], 10, 'S');
            const headerLines = pdf.splitTextToSize(header, colWidths[i] - 4);
            pdf.text(headerLines, currentX + colWidths[i]/2, yPos + 5, {align: 'center', baseline: 'middle'});
            currentX += colWidths[i];
          });
          yPos += 10;
          pdf.setTextColor(...secondaryColor);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(8);
          currentX = MARGIN; 
        }

        rowData.forEach((text, i) => {
          pdf.setDrawColor(...borderColor);
          pdf.rect(currentX, yPos, colWidths[i], rowHeight, 'S'); 
          const textLines = pdf.splitTextToSize(String(text || getTranslationForPdf('pdfNotApplicable')), colWidths[i] - 4); 
          pdf.text(textLines, currentX + 2, yPos + 4); 
          currentX += colWidths[i];
        });
        yPos += rowHeight;
      });
    } else {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(getTranslationForPdf('pdfNoVaccinesRecorded'), MARGIN, yPos);
      yPos += 8;
    }
    
    if (yPos > PAGE_HEIGHT - MARGIN - 70) { 
        pdf.addPage();
        addHeader();
        yPos = MARGIN + 30; 
    } else {
      yPos += 10; 
    }
    
    addSectionTitle('pdfIssuanceAndVerification');

    pdf.setFontSize(10);
    const issueInfo = [
      {labelKey: 'pdfIssuedOn', value: new Date(issueDate).toLocaleString(localLang, { dateStyle: 'long', timeStyle: 'short' })},
      {labelKey: 'pdfVerificationCode', value: qrCode.split('/').pop()},
      {labelKey: 'pdfIssuingEntity', value: getTranslationForPdf('pdfIssuingEntityName')},
    ];
    
    let qrYPos = yPos;
    const textBlockWidth = CONTENT_WIDTH * 0.6;

    issueInfo.forEach(info => {
      const label = getTranslationForPdf(info.labelKey);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(...primaryColor);
      pdf.text(label, MARGIN, yPos);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(...secondaryColor);
      const valueText = String(info.value);
      const lines = pdf.splitTextToSize(valueText, textBlockWidth - (pdf.getStringUnitWidth(label) * pdf.getFontSize() / pdf.internal.scaleFactor) - 5);
      pdf.text(lines, MARGIN + (pdf.getStringUnitWidth(label) * pdf.getFontSize() / pdf.internal.scaleFactor) + 3 , yPos);
      yPos += (lines.length * 4) + 4;
    });

    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrCode, { width: 150, margin: 1, errorCorrectionLevel: 'M', color: { dark: '#111827', light: '#FFFFFF' } }); 
      pdf.addImage(qrCodeDataURL, 'PNG', MARGIN + textBlockWidth + 5, qrYPos - 2, 40, 40);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(...secondaryColor);
      pdf.text(getTranslationForPdf('pdfScanToVerify'), MARGIN + textBlockWidth + 5 + 20 , qrYPos + 42, { align: 'center' });
    } catch (qrError) {
      console.warn('Error generando QR:', qrError);
    }

    const addFooter = (pageNum, totalPages) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(...secondaryColor);
      pdf.text(getTranslationForPdf('pdfPageInfo', { currentPage: pageNum, totalPages: totalPages }), PAGE_WIDTH / 2, PAGE_HEIGHT - MARGIN + 5, { align: 'center' });
      pdf.setLineWidth(0.1);
      pdf.line(MARGIN, PAGE_HEIGHT - MARGIN + 2, PAGE_WIDTH - MARGIN, PAGE_HEIGHT - MARGIN + 2); 
      pdf.setFontSize(7);
      pdf.text(getTranslationForPdf('pdfDisclaimer'), PAGE_WIDTH / 2, PAGE_HEIGHT - MARGIN + 10, { align: 'center', maxWidth: CONTENT_WIDTH });
    };
    
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      if (i < pageCount || yPos < PAGE_HEIGHT - MARGIN - 40) { 
         addFooter(i, pageCount);
      }
    }
    
    if (yPos >= PAGE_HEIGHT - MARGIN - 40) {
        pdf.setPage(pageCount);
        addFooter(pageCount, pageCount);
    }

    const fileName = `${getTranslationForPdf('pdfTitle').replace(/\s*\/\s*/g, '_').replace(/\s+/g, '_')}_${patientName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw new Error(getTranslationForPdf('errorGeneratingCertificateDesc'));
  }
};