import pdf from 'pdfjs';

export default function generateCertificatePdf(intl, data) {
  const doc = new pdf.Document({});
  doc.text(data.title, { fontSize: 24, textAlign: 'center' });
  doc.text(`${data.subtitle}\n\n`, { fontSize: 6, textAlign: 'center' });
  doc.text(`${intl.formatMessage({ id: 'certificate.data.title' })}\n\n`, {
    fontSize: 10
  });
  doc.text(
    `${intl.formatMessage({ id: 'certificate.sender' })}: ${data.sender}`,
    { fontSize: 8 }
  );
  doc.text(
    `${intl.formatMessage({ id: 'certificate.recipient' })}: ${data.recipient}`,
    { fontSize: 8 }
  );
  doc.text(
    `${intl.formatMessage({ id: 'certificate.rvalue' })}: ${data.rvalue}`,
    { fontSize: 8 }
  );
  doc.text(`${intl.formatMessage({ id: 'certificate.utxo' })}: ${data.utxo}`, {
    fontSize: 8
  });

  const verification = doc.table({ widths: [null, null, null], padding: 5 });
  const row0 = verification.row();
  row0.cell(intl.formatMessage({ id: 'certificate.verification.title' }), {
    fontSize: 10
  });
  row0.cell('');
  row0.cell(data.verificationDate, { fontSize: 8 });

  const row1 = verification.row();
  const valid = intl.formatMessage({ id: 'certificate.verification.valid' });
  row1.cell(`${intl.formatMessage({ id: 'certificate.sender' })}: ${valid}`, {
    fontSize: 8
  });
  row1.cell(
    `${intl.formatMessage({ id: 'certificate.recipient' })}: ${valid}`,
    { fontSize: 8 }
  );
  row1.cell(`${intl.formatMessage({ id: 'certificate.utxo' })}: ${valid}`, {
    fontSize: 8
  });

  const row2 = verification.row();
  row2.cell('');
  row2.cell('');
  row2.cell(
    `${intl.formatMessage({ id: 'certificate.block' })}: ${data.block || ''}`,
    { fontSize: 8 }
  );

  const row3 = verification.row();
  row3.cell(
    `${intl.formatMessage({ id: 'certificate.amount' })}: ${data.amount} STG`,
    { fontSize: 8 }
  );
  row3.cell('');
  row3.cell('');
  return doc;
}
