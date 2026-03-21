import Link from "next/link";

export default function TambahProdukDetail() {
  return (
    <div className="flex h-screen w-full bg-[#1e1b4b] font-display text-slate-100 overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 flex flex-col z-50 border-r border-slate-200" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 flex items-center justify-center rounded-xl overflow-hidden shrink-0">
            <img src="/image/logo.png" alt="Keranjangin Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-900 dark:text-slate-100">Seller Center</h1>
            <p className="text-[10px] uppercase tracking-wider text-primary font-bold">Powered by Keranjangin</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/">
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/pesanan">
            <span className="material-symbols-outlined">shopping_bag</span>
            <span>Pesanan</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary font-semibold" href="/produk">
            <span className="material-symbols-outlined">package_2</span>
            <span>Produk</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/marketing">
            <span className="material-symbols-outlined">campaign</span>
            <span>Marketing</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/analytics">
            <span className="material-symbols-outlined">analytics</span>
            <span>Analytics</span>
          </Link>
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/keuangan">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span>Keuangan</span>
          </Link>
          <div className="pt-4 mt-4 border-t border-slate-200">
            <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors hover:text-primary" href="/pengaturan">
              <span className="material-symbols-outlined">settings</span>
              <span>Pengaturan</span>
            </Link>
          </div>
        </nav>
        <div className="p-4 shrink-0">
          <div className="rounded-xl bg-primary p-4 text-white">
            <p className="text-xs font-medium opacity-80 mb-2">Pusat Edukasi</p>
            <p className="text-sm font-bold mb-3">Tingkatkan omset toko kamu!</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all cursor-pointer">Pelajari Sekarang</button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col h-screen">

        {/* Header */}
        <header className="h-20 shrink-0 flex items-center justify-between px-8 bg-[#9288f8] shadow-md z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm font-bold text-white tracking-wide">
              <Link className="hover:underline" href="/produk">My Products</Link>
              <span className="material-symbols-outlined mx-2 text-base">chevron_right</span>
              <span>Add New Product</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative w-64 hidden md:block">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              <input className="pl-12 pr-4 py-2 border-none rounded-full text-sm focus:ring-2 focus:ring-white/20 bg-white shadow-md focus:outline-none w-full text-slate-800" placeholder="Search..." type="text" />
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative text-white cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 size-3 bg-red-500 border-2 border-[#9288f8] rounded-full text-[9px] flex items-center justify-center font-bold text-white">25</span>
              </button>
              <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer">
                <span className="material-symbols-outlined">mail</span>
              </button>
              <div className="h-8 w-px bg-white/20 mx-2"></div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block text-white">
                  <p className="text-sm font-bold leading-none">Indo Tech Store</p>
                  <p className="text-[10px] opacity-80 mt-1">Official Partner</p>
                </div>
                <div
                  className="size-11 rounded-full bg-cover bg-center border-2 border-white/50 shadow-md cursor-pointer"
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCC1zmp7YYt6oMDsTdv1bNgxpofyoEuLVBqeQp-WLWWxuCGBXro5gXoPacDjyc8StdsGIVlwRoEr5t7Xak65p2AslTeE34eGi8903dOn73Rf-mO7PLaCLN8Z-2vUEE_8c6-eYnPJ_jIjcMdn94sglqgz27H0DkIuLuI7bU-B_8ViI4gAP6iWS2_kVYpMgc96DNl77_JqmMc0sOcmKeKAmcyDz-iNwONuFY0d435TR9QNZyX-SXPbAHql7w_jiLXRpRy3UBmfLpnq7iW')" }}
                ></div>
              </div>
            </div>
          </div>
        </header>

        {/* Layout Wrapper Konten Bawah */}
        <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pt-8 px-8">

          {/* Kolom Kiri */}
          <div className="flex-1 flex flex-col h-full min-h-0">

            {/* Bagian Atas Kolom Kiri (Progress Stepper) - Diam */}
            <div className="shrink-0 mb-6 pr-2 lg:pr-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Step 2: Deskripsi dan Informasi Penjualan</h2>
                  <p className="text-indigo-200/70">Lengkapi detail deskripsi dan pengaturan penjualan produk Anda</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">66% Complete</span>
                </div>
              </div>
              <div className="relative w-full bg-white/10 h-3 rounded-full overflow-hidden shadow-inner">
                {/* Progress bar diset menjadi w-2/4 (50%) */}
                <div className="bg-indigo-600 h-full w-2/3 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
              </div>
            </div>

            {/* Bagian Bawah Kolom Kiri (Form) - Scrollable */}
            <div className="flex-1 overflow-y-auto pr-2 pb-12 lg:pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/20 hover:[&::-webkit-scrollbar-thumb]:bg-white/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

              {/* Sections Container */}
              <div className="space-y-6">

                {/* Product Description */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                  <label className="block text-sm font-bold text-slate-700 mb-3">Deskripsi Produk</label>
                  <textarea className="w-full min-h-[160px] rounded-lg border-slate-400 bg-slate-50 focus:border-primary focus:ring-primary p-4 text-sm outline-none placeholder:text-slate-400 text-slate-800" placeholder="Masukkan deskripsi produk Anda di sini..."></textarea>
                </div>

                {/* Price and Stock */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Harga</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-slate-500 font-medium">Rp</span>
                        </div>
                        <input className="w-full pl-12 pr-4 py-3 rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm outline-none text-slate-800" placeholder="0" type="text" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-3">Stok</label>
                      <input className="w-full px-4 py-3 rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm outline-none text-slate-800" placeholder="0" type="number" />
                    </div>
                  </div>
                </div>

                {/* Purchase Limits */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Min. Jumlah Pembelian</label>
                    <input className="w-full px-4 py-3 rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm mb-2 outline-none text-slate-800" placeholder="1" type="number" />
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Min. jumlah pembelian adalah min. jumlah yang harus dipesan Pembeli untuk membeli produk atau variasi. Pembeli tidak dapat membuat pesanan jika stok kurang dari min. jumlah pembelian.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Maks. Jumlah Pembelian</label>
                    <div className="relative">
                      <select className="w-full px-4 py-3 appearance-none rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary text-sm outline-none text-slate-800 cursor-pointer">
                        <option>Tanpa Batas</option>
                        <option>Batas Per Pesanan</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="mt-10 flex items-center justify-between pb-8">
                <Link href="/produk/tambah" className="px-8 py-2.5 rounded-lg border border-slate-400/50 text-slate-200 font-bold hover:bg-white/10 transition-colors cursor-pointer">
                  Kembali
                </Link>
                <Link href="/produk/tambah/step3" className="px-10 py-2.5 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all transform active:scale-95 cursor-pointer flex items-center justify-center border-none">
                  Selanjutnya
                </Link>
              </div>

            </div>
          </div>

          {/* Kolom Kanan (Preview) - Diam */}
          <aside className="w-full lg:w-[350px] xl:w-[380px] shrink-0 pb-8">
            <div className="bg-[#b3b0ec]/90 rounded-2xl p-6 shadow-xl border border-white/20 h-fit">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Preview</h2>
              <p className="text-xs text-slate-700/70 mb-6">Rincian Produk</p>

              {/* Image Box Placeholder */}
              <div className="bg-[#9c97eb] rounded-xl border-2 border-dashed border-[#7e78d9] aspect-square flex items-center justify-center mb-6 shadow-inner">
                <span className="material-symbols-outlined text-6xl text-white/50">add_photo_alternate</span>
              </div>

              {/* Product Info */}
              <p className="text-sm font-bold text-slate-900 mb-2 px-1">Nama Produk</p>

              {/* User / Store Info Box */}
              <div className="bg-[#c2c0f0] rounded-lg p-2.5 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full bg-slate-300 bg-cover bg-center border border-white/50"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCC1zmp7YYt6oMDsTdv1bNgxpofyoEuLVBqeQp-WLWWxuCGBXro5gXoPacDjyc8StdsGIVlwRoEr5t7Xak65p2AslTeE34eGi8903dOn73Rf-mO7PLaCLN8Z-2vUEE_8c6-eYnPJ_jIjcMdn94sglqgz27H0DkIuLuI7bU-B_8ViI4gAP6iWS2_kVYpMgc96DNl77_JqmMc0sOcmKeKAmcyDz-iNwONuFY0d435TR9QNZyX-SXPbAHql7w_jiLXRpRy3UBmfLpnq7iW')" }}
                  ></div>
                  <span className="text-sm font-bold text-slate-800">username</span>
                </div>
                <button className="text-[11px] bg-white/90 text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 font-bold shadow-sm hover:bg-white transition-colors cursor-pointer border border-slate-200/50">
                  Kunjungi
                </button>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}