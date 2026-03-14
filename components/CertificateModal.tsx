export default function CertificateModal({ userName, courseTitle, onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-4xl w-full rounded-lg shadow-2xl overflow-hidden relative">
        <div className="p-12 border-[20px] border-yellow-600 m-4 text-center">
          <h1 className="text-yellow-600 text-5xl font-serif mb-6">Certificate of Completion</h1>
          <p className="text-gray-400 uppercase tracking-widest text-sm mb-8">This honors the achievement of</p>
          <h2 className="text-4xl font-bold text-gray-900 border-b-2 border-gray-900 inline-block px-12 pb-2 mb-8">{userName}</h2>
          <p className="text-gray-600 text-lg mb-4">for successfully mastering the curriculum of</p>
          <h3 className="text-2xl font-bold text-gray-800 mb-12 italic">"{courseTitle}"</h3>
          <div className="flex justify-between items-end mt-16 px-10">
            <div className="text-left"><p className="font-bold">EduVibe Academy</p><p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p></div>
            <div className="w-40 border-t border-gray-400 pt-2 text-xs italic text-gray-400">Official Signature</div>
          </div>
        </div>
        <div className="bg-gray-100 p-4 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 font-semibold">Close</button>
          <button onClick={() => window.print()} className="bg-yellow-600 text-white px-8 py-2 rounded-lg font-bold">Print as PDF</button>
        </div>
      </div>
    </div>
  );
}