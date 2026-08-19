import { Component } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

export default class CertificateErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <section className="flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 pt-24 pb-20 text-white">
        <div className="w-full max-w-xl rounded-2xl border border-red-500/25 bg-[#15151b] p-6 text-center sm:p-9" role="alert">
          <FaExclamationCircle className="mx-auto mb-4 text-3xl text-red-300" aria-hidden="true" />
          <h1 className="text-2xl font-bold">Certificate verification is unavailable</h1>
          <p className="mt-3 text-gray-400">The page could not be loaded. Please refresh and try again.</p>
          <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500">
            Reload Page
          </button>
        </div>
      </section>
    );
  }
}
