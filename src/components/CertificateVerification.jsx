import { useEffect, useState } from 'react';
import {
  FaCertificate,
  FaChartLine,
  FaCheckCircle,
  FaDownload,
  FaExclamationCircle,
  FaExpand,
  FaSearch,
  FaShieldAlt,
  FaSpinner,
} from 'react-icons/fa';
import { downloadCertificateImage, verifyCertificate } from '../services/certificates';

function getSearchError(error) {
  if (error?.message?.includes('row-level security')) {
    return 'Certificate search is currently unavailable. Please contact the institute.';
  }
  return error?.message || 'Unable to verify the certificate. Please try again.';
}

function getCertificateFiles(certificate) {
  if (!Array.isArray(certificate?.certificate_files)) return [];

  return certificate.certificate_files.filter(
    (file) => file && typeof file.file_url === 'string' && file.file_url.trim()
  );
}

export default function CertificateVerification() {
  const [rollNumber, setRollNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    const normalizedRoll = rollNumber.trim();
    const normalizedName = studentName.trim();
    if (!normalizedRoll || !normalizedName) {
      setStatus('error');
      setMessage('Please enter both Roll Number and Student Name.');
      setCertificate(null);
      return;
    }

    setStatus('loading');
    setMessage('');
    setCertificate(null);
    try {
      const result = await verifyCertificate(normalizedRoll, normalizedName);
      if (!result) {
        setStatus('not-found');
        setMessage('Certificate Not Found');
        return;
      }
      setCertificate(result);
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setMessage(getSearchError(error));
    }
  };

  const handleDownload = async (file, index) => {
    const downloadId = file.id ?? `certificate-${index}`;
    setDownloadingId(downloadId);
    setMessage('');
    try {
      const extension = file.file_url.split('.').pop()?.split(/[?#]/)[0] || 'jpg';
      await downloadCertificateImage(
        file.file_url,
        `${certificate.Roll_No}-certificate-${index + 1}.${extension}`
      );
    } catch (error) {
      setMessage(error?.message || 'Unable to download this image.');
    } finally {
      setDownloadingId(null);
    }
  };

  const certificateFiles = getCertificateFiles(certificate);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a0f] px-4 pb-20 pt-24 text-white sm:pb-28 sm:pt-28">
      <div className="absolute top-20 left-0 w-80 h-80 rounded-full bg-violet-600/10 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] shadow-2xl shadow-violet-950/30">
          <div className="relative flex min-w-0 flex-col justify-center bg-gradient-to-br from-violet-600/20 via-purple-600/10 to-transparent p-6 sm:p-10 lg:p-16">
            <div className="absolute top-8 right-8 text-violet-400/10" aria-hidden="true">
              <FaCertificate className="text-[150px]" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-7 rounded-2xl bg-violet-500/15 border border-violet-400/20 text-violet-300">
                <FaChartLine className="text-3xl" aria-hidden="true" />
              </div>
              <p className="mb-3 text-sm font-semibold tracking-[0.2em] uppercase text-violet-300">Instel Institute</p>
              <h1 className="max-w-lg text-3xl font-bold leading-tight sm:text-5xl">Verify your achievement with confidence.</h1>
              <p className="max-w-xl mt-5 text-base sm:text-lg leading-relaxed text-gray-400">Enter your Roll Number and Student Name to confirm that your certificate was officially issued by Instel Computer &amp; Coaching Institute.</p>

              <div className="grid sm:grid-cols-2 gap-4 mt-9">
                <div className="flex items-center gap-3 text-gray-300"><FaShieldAlt className="shrink-0 text-violet-400" aria-hidden="true" /><span>Secure verification</span></div>
                <div className="flex items-center gap-3 text-gray-300"><FaCheckCircle className="shrink-0 text-emerald-400" aria-hidden="true" /><span>Instant confirmation</span></div>
              </div>
            </div>
          </div>

          <div className="min-w-0 bg-[#15151b]/90 p-5 backdrop-blur-xl sm:p-10 lg:p-12">
            <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Certificate Verification</h2>
            <p className="mb-8 text-gray-400">Enter both details exactly as shown on the certificate.</p>
            <form onSubmit={handleSearch} className="space-y-6" noValidate>
              <div>
                <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-300 mb-2">Roll Number</label>
                <input type="text" id="rollNumber" value={rollNumber} onChange={(event) => setRollNumber(event.target.value)} className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10 text-white placeholder-gray-600" placeholder="Enter your Roll Number" disabled={status === 'loading'} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-300 mb-2">Student Name</label>
                <input type="text" id="studentName" value={studentName} onChange={(event) => setStudentName(event.target.value)} className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10 text-white placeholder-gray-600" placeholder="Enter Student Name" disabled={status === 'loading'} autoComplete="name" />
              </div>
              <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white font-semibold transition hover:-translate-y-0.5 shadow-lg shadow-violet-900/30 disabled:opacity-60 disabled:translate-y-0">
                {status === 'loading' ? <FaSpinner className="animate-spin" aria-hidden="true" /> : <FaSearch aria-hidden="true" />}
                {status === 'loading' ? 'Verifying...' : 'Verify Certificate'}
              </button>
            </form>

            {(status === 'not-found' || status === 'error') && (
              <div className="flex items-start gap-3 mt-6 p-4 rounded-xl border border-red-500/25 bg-red-500/10 text-red-300" role="alert">
                <FaExclamationCircle className="mt-0.5 shrink-0" aria-hidden="true" />
                <div><p className="font-semibold">{status === 'not-found' ? 'Certificate Not Found' : 'Verification Error'}</p><p className="mt-1 text-sm text-red-300/70">{status === 'not-found' ? 'Please check the Roll Number and try again.' : message}</p></div>
              </div>
            )}
          </div>
        </div>

        {certificate && (
          <div className="mt-8 mb-8 min-w-0 rounded-3xl p-5 glass-card sm:mb-12 sm:p-10" aria-live="polite">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-7 border-b border-white/10">
              <div>
                <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold"><FaCheckCircle aria-hidden="true" /> Certificate Verified</div>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{certificate.Name}</h2>
                <p className="mt-1 text-violet-300">Roll No: {certificate.Roll_No}</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-300">Official Instel Record</div>
            </div>

            {message && <p className="mb-5 text-sm text-red-300" role="alert">{message}</p>}

            {certificateFiles.length > 0 ? (
              <div className={`grid grid-cols-1 items-start gap-8 ${certificateFiles.length === 1 ? 'max-w-3xl mx-auto' : 'lg:grid-cols-2'}`}>
                {certificateFiles.map((file, index) => (
                  <article key={file.id ?? `${file.file_url}-${index}`} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                    <button type="button" onClick={() => setPreviewUrl(file.file_url)} className="group relative block w-full bg-black/30" aria-label={`View certificate image ${index + 1} larger`}>
                      <img src={file.file_url} alt={`${certificate.Name} certificate ${index + 1}`} className="block h-auto max-h-[620px] w-full object-contain" />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/45 transition-colors"><span className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"><FaExpand /> View Larger</span></span>
                    </button>
                    <div className="flex flex-col items-stretch gap-3 p-4 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
                      <p className="font-medium text-gray-300">Certificate Image {index + 1}</p>
                      <button type="button" onClick={() => handleDownload(file, index)} disabled={downloadingId === (file.id ?? `certificate-${index}`)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-violet-500/25 bg-violet-500/15 px-4 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-500/25 disabled:opacity-60">
                        {downloadingId === (file.id ?? `certificate-${index}`) ? <FaSpinner className="animate-spin" /> : <FaDownload />} Download
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-gray-400">This certificate record does not have an image yet.</p>
            )}
          </div>
        )}
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto bg-black/90 p-3 sm:p-4" role="dialog" aria-modal="true" aria-label="Certificate image preview" onClick={() => setPreviewUrl(null)}>
          <button type="button" onClick={() => setPreviewUrl(null)} className="absolute top-3 right-3 z-10 h-11 w-11 rounded-full bg-black/70 text-2xl hover:bg-white/20 sm:top-5 sm:right-5" aria-label="Close preview">×</button>
          <img src={previewUrl} alt="Certificate preview" className="max-h-[calc(100dvh-1.5rem)] max-w-full object-contain rounded-xl" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
