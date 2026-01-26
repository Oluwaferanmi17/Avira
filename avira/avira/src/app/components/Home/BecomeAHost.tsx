const BecomeAHost = () => {
  return (
    <section className="mt-20 mb-20 ml-50 w-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-gradient-to-br from-green-50 via-white to-orange-50 shadow border p-6 items-center hover:border-[#00b894]">
      <div className="p-6">
        <h3 className="text-2xl font-semibold">Become a Host</h3>
        <p className="mt-3 text-gray-500">
          Share your space with travelers, reach local audiences, and earn. We
          make hosting simple and secure.
        </p>
        <div className="mt-6 flex gap-4">
          <a className="px-4 py-3 rounded-xl bg-gradient-to-r from-[#00b894] to-[#00ffee] text-gray-500 font-semibold">
            Start hosting
          </a>
          <a className="px-4 py-3 rounded-xl border border-white/6 text-gray-500">
            Learn more
          </a>
        </div>
      </div>

      <div className="p-6 flex items-center justify-center">
        <div className="w-full max-w-xs rounded-2xl overflow-hidden bg-white/4 border border-white/6">
          <img
            src="https://plus.unsplash.com/premium_photo-1692873058899-624c0f96c5de?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmlnZXJpYW4lMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600format&fit=crop"
            alt="host"
            className="w-full h-48 object-cover"
            draggable={false}
          />
          <div className="p-4">
            <div className="font-semibold">Ifeoma&apos;s Guesthouse</div>
            <div className="text-sm text-gray-500 mt-1">
              Port Harcourt • 4.9 • Superhost
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeAHost;
