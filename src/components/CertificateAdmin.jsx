import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FaCertificate,
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaImages,
  FaSpinner,
  FaTrash,
  FaUpload,
} from 'react-icons/fa';
import {
  createCertificate,
  deleteCertificate,
  listCertificates,
  validateCertificateFiles,
} from '../services/certificates';

const INITIAL_FORM = { rollNumber: '', name: '' };

function getErrorMessage(error) {
  if (error?.message?.includes('row-level security')) {
    return 'Supabase blocked this action. Check the certificates, certificate_files, and storage RLS policies.';
  }
  return error?.message || 'Something went wrong. Please try again.';
}

export default function CertificateAdmin() {
  const formRef = useRef(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [files, setFiles] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [notice, setNotice] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
  );

  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews]);

  const loadCertificates = useCallback(async () => {
    setLoadingList(true);
    try {
      setCertificates(await listCertificates());
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) });
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const loadTimer = window.setTimeout(loadCertificates, 0);
    return () => window.clearTimeout(loadTimer);
  }, [loadCertificates]);

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const fileError = validateCertificateFiles(selectedFiles);
    if (fileError) {
      setFiles([]);
      setNotice({ type: 'error', text: fileError });
      event.target.value = '';
      return;
    }
    setFiles(selectedFiles);
    setNotice(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const rollNumber = form.rollNumber.trim();
    const name = form.name.trim();
    if (!rollNumber || !name) {
      setNotice({ type: 'error', text: 'Roll Number and Student Name are required.' });
      return;
    }
    if (name.length < 2) {
      setNotice({ type: 'error', text: 'Student Name must be at least 2 characters.' });
      return;
    }
    const fileError = validateCertificateFiles(files);
    if (fileError) {
      setNotice({ type: 'error', text: fileError });
      return;
    }

    setSubmitting(true);
    setProgress(0);
    setNotice(null);
    try {
      const created = await createCertificate({
        rollNumber,
        name,
        files,
        onProgress: setProgress,
      });
      setCertificates((current) => [created, ...current]);
      setForm(INITIAL_FORM);
      setFiles([]);
      setNotice({ type: 'success', text: 'Certificate and all selected images uploaded successfully.' });
      formRef.current?.reset();
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (certificate) => {
    if (deletingId || !window.confirm(`Delete certificate for ${certificate.Name}? This cannot be undone.`)) return;

    setDeletingId(certificate.id);
    setNotice(null);
    try {
      const { cleanupWarning } = await deleteCertificate(certificate);
      setCertificates((current) => current.filter((item) => item.id !== certificate.id));
      setNotice({
        type: cleanupWarning ? 'error' : 'success',
        text: cleanupWarning || 'Certificate and its associated files were deleted.',
      });
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-20 px-4 bg-[#0a0a0f] text-white">
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full text-xs font-semibold text-violet-300 border border-violet-500/30 bg-violet-500/10">
            <FaCertificate aria-hidden="true" /> Certificate Management
          </span>
          <h1 className="text-3xl sm:text-5xl font-black">Certificate <span className="gradient-text">Admin</span></h1>
          <p className="mt-3 max-w-2xl text-gray-400">Add student certificates, manage uploaded images, and safely remove outdated records.</p>
        </div>

        {notice && (
          <div className={`flex items-start gap-3 p-4 mb-8 rounded-xl border ${notice.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`} role={notice.type === 'error' ? 'alert' : 'status'}>
            {notice.type === 'success' ? <FaCheckCircle className="mt-0.5 shrink-0" /> : <FaExclamationCircle className="mt-0.5 shrink-0" />}
            <p>{notice.text}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <form ref={formRef} onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Add Certificate</h2>
              <p className="mt-1 text-sm text-gray-400">One or multiple certificate images are supported.</p>
            </div>

            <div>
              <label htmlFor="admin-roll-number" className="block mb-2 text-sm font-medium text-gray-300">Roll Number *</label>
              <input id="admin-roll-number" type="text" value={form.rollNumber} onChange={(event) => setForm((current) => ({ ...current, rollNumber: event.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10" placeholder="Enter unique roll number" disabled={submitting} />
            </div>

            <div>
              <label htmlFor="admin-student-name" className="block mb-2 text-sm font-medium text-gray-300">Student Name *</label>
              <input id="admin-student-name" type="text" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-violet-500/70 focus:ring-4 focus:ring-violet-500/10" placeholder="Enter student's full name" disabled={submitting} />
            </div>

            <div>
              <label htmlFor="certificate-images" className="flex flex-col items-center justify-center min-h-40 px-5 py-8 rounded-2xl border-2 border-dashed border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 transition-colors cursor-pointer text-center">
                <FaImages className="mb-3 text-3xl text-violet-400" aria-hidden="true" />
                <span className="font-semibold">Select certificate images</span>
                <span className="mt-1 text-xs text-gray-500">JPG, JPEG, PNG or WEBP · Max 10 MB each</span>
              </label>
              <input id="certificate-images" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleFiles} className="sr-only" disabled={submitting} />
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {previews.map(({ file, url }) => (
                  <button key={`${file.name}-${file.lastModified}`} type="button" onClick={() => setPreviewUrl(url)} className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/20" aria-label={`Preview ${file.name}`}>
                    <img src={url} alt={file.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <span className="absolute inset-x-0 bottom-0 truncate px-2 py-1 text-[10px] bg-black/70">{file.name}</span>
                  </button>
                ))}
              </div>
            )}

            {submitting && (
              <div aria-live="polite">
                <div className="flex justify-between mb-2 text-sm text-gray-300"><span>Uploading images...</span><span>{progress}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-500 transition-[width]" style={{ width: `${progress}%` }} /></div>
              </div>
            )}

            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-900/30 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:translate-y-0">
              {submitting ? <FaSpinner className="animate-spin" /> : <FaUpload />} {submitting ? 'Uploading...' : 'Upload Certificate'}
            </button>
          </form>

          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div><h2 className="text-2xl font-bold">Uploaded Certificates</h2><p className="mt-1 text-sm text-gray-400">{certificates.length} certificate{certificates.length === 1 ? '' : 's'}</p></div>
              <button type="button" onClick={loadCertificates} disabled={loadingList} className="px-3 py-2 rounded-lg text-sm border border-white/10 hover:bg-white/5 disabled:opacity-50">Refresh</button>
            </div>

            {loadingList ? (
              <div className="flex items-center justify-center min-h-52 text-violet-300"><FaSpinner className="animate-spin text-2xl" /><span className="sr-only">Loading certificates</span></div>
            ) : certificates.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-52 text-center text-gray-500"><FaCertificate className="mb-3 text-4xl text-violet-500/40" /><p>No certificates uploaded yet.</p></div>
            ) : (
              <div className="space-y-4 max-h-[720px] overflow-y-auto pr-1">
                {certificates.map((certificate) => (
                  <article key={certificate.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.025]">
                    <div className="flex items-start justify-between gap-4">
                      <div><h3 className="font-bold text-white">{certificate.Name}</h3><p className="mt-1 text-sm text-violet-300">Roll No: {certificate.Roll_No}</p></div>
                      <button type="button" onClick={() => handleDelete(certificate)} disabled={Boolean(deletingId)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-300 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50" aria-label={`Delete certificate for ${certificate.Name}`}>
                        {deletingId === certificate.id ? <FaSpinner className="animate-spin" /> : <FaTrash />} <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {(certificate.certificate_files ?? []).map((file, index) => (
                        <button key={file.id} type="button" onClick={() => setPreviewUrl(file.file_url)} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-black/30 border border-white/10" aria-label={`View certificate image ${index + 1}`}>
                          <img src={file.file_url} alt={`${certificate.Name} certificate ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/50 transition"><FaEye className="opacity-0 group-hover:opacity-100 transition-opacity" /></span>
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90" role="dialog" aria-modal="true" aria-label="Certificate image preview" onClick={() => setPreviewUrl(null)}>
          <button type="button" onClick={() => setPreviewUrl(null)} className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 text-2xl" aria-label="Close preview">×</button>
          <img src={previewUrl} alt="Certificate preview" className="max-w-full max-h-[88vh] object-contain rounded-xl" onClick={(event) => event.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
