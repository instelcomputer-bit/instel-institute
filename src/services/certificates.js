import { supabase } from '../supabase';

const CERTIFICATE_BUCKET = 'certificates';
const PUBLIC_PATH_MARKER = `/storage/v1/object/public/${CERTIFICATE_BUCKET}/`;
const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function validateCertificateFiles(files) {
  if (!files.length) return 'Select at least one certificate image.';

  const invalidType = files.find((file) => !ALLOWED_IMAGE_TYPES.has(file.type));
  if (invalidType) return `${invalidType.name} is not a JPG, PNG, or WEBP image.`;

  const oversized = files.find((file) => file.size > MAX_FILE_SIZE);
  if (oversized) return `${oversized.name} is larger than 10 MB.`;

  return '';
}

export async function findCertificateByRoll(rollNumber) {
  const { data, error } = await supabase
    .from('certificates')
    .select('id, created_at, Roll_No, Name, certificate_files(id, file_url, created_at)')
    .eq('Roll_No', rollNumber.trim())
    .order('created_at', { referencedTable: 'certificate_files', ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function verifyCertificate(rollNumber, studentName) {
  const escapedName = studentName.trim().replace(/[\\%_]/g, '\\$&');
  const { data, error } = await supabase
    .from('certificates')
    .select('id, created_at, Roll_No, Name, certificate_files(id, file_url, created_at)')
    .eq('Roll_No', rollNumber.trim())
    .ilike('Name', escapedName)
    .order('created_at', { referencedTable: 'certificate_files', ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    certificate_files: Array.isArray(data.certificate_files)
      ? data.certificate_files.filter(Boolean)
      : [],
  };
}

export async function listCertificates() {
  const { data, error } = await supabase
    .from('certificates')
    .select('id, created_at, Roll_No, Name, certificate_files(id, file_url, created_at)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

function getFileExtension(file) {
  const nameExtension = file.name.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp'].includes(nameExtension)) return nameExtension;
  if (file.type === 'image/png') return 'png';
  if (file.type === 'image/webp') return 'webp';
  return 'jpg';
}

function createStoragePath(certificateId, file) {
  const uniqueId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${certificateId}/${uniqueId}.${getFileExtension(file)}`;
}

export function getStoragePath(fileUrl) {
  const markerIndex = fileUrl.indexOf(PUBLIC_PATH_MARKER);
  if (markerIndex === -1) return null;
  return decodeURIComponent(fileUrl.slice(markerIndex + PUBLIC_PATH_MARKER.length));
}

export async function createCertificate({ rollNumber, name, files, onProgress }) {
  const normalizedRoll = rollNumber.trim();
  const normalizedName = name.trim();

  const existing = await findCertificateByRoll(normalizedRoll);
  if (existing) throw new Error('A certificate with this Roll Number already exists.');

  const { data: certificate, error: certificateError } = await supabase
    .from('certificates')
    .insert({ Roll_No: normalizedRoll, Name: normalizedName })
    .select('id, created_at, Roll_No, Name')
    .single();

  if (certificateError) throw certificateError;

  const uploadedPaths = [];

  try {
    const fileRecords = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const path = createStoragePath(certificate.id, file);
      const { error: uploadError } = await supabase.storage
        .from(CERTIFICATE_BUCKET)
        .upload(path, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;
      uploadedPaths.push(path);

      const { data: publicUrlData } = supabase.storage
        .from(CERTIFICATE_BUCKET)
        .getPublicUrl(path);

      fileRecords.push({
        certificate_id: certificate.id,
        file_url: publicUrlData.publicUrl,
      });
      onProgress?.(Math.round(((index + 1) / files.length) * 90));
    }

    const { data: certificateFiles, error: filesError } = await supabase
      .from('certificate_files')
      .insert(fileRecords)
      .select('id, file_url, created_at');

    if (filesError) throw filesError;
    onProgress?.(100);

    return { ...certificate, certificate_files: certificateFiles ?? [] };
  } catch (error) {
    if (uploadedPaths.length) {
      await supabase.storage.from(CERTIFICATE_BUCKET).remove(uploadedPaths);
    }
    await supabase.from('certificates').delete().eq('id', certificate.id);
    throw error;
  }
}

export async function deleteCertificate(certificate) {
  const paths = (certificate.certificate_files ?? [])
    .map((file) => getStoragePath(file.file_url))
    .filter(Boolean);

  const { data: deletedCertificates, error: deleteError } = await supabase
    .from('certificates')
    .delete()
    .eq('id', certificate.id)
    .select('id');

  if (deleteError) throw deleteError;
  if (!deletedCertificates?.some(({ id }) => id === certificate.id)) {
    throw new Error('Certificate was not deleted. Check that the authenticated admin has permission to delete this record.');
  }

  if (paths.length) {
    const { error: storageError } = await supabase.storage
      .from(CERTIFICATE_BUCKET)
      .remove(paths);

    if (storageError) {
      return { cleanupWarning: 'Certificate was deleted, but some storage files could not be cleaned up.' };
    }
  }

  return { cleanupWarning: '' };
}

export async function downloadCertificateImage(fileUrl, filename) {
  const path = getStoragePath(fileUrl);
  let blob;

  if (path) {
    const { data, error } = await supabase.storage.from(CERTIFICATE_BUCKET).download(path);
    if (error) throw error;
    blob = data;
  } else {
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error('Unable to download this certificate image.');
    blob = await response.blob();
  }

  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}
