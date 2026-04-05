export default function Gallery() {
  const images = [
    {
      title: "The Harvest Hearth",
      tag: "Gastronomy",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIEAUPkyzWHzRO0pUbqb2wSf9QUHonDakXat9iSWSx4e42HLjUyD1jxmjcxamC-3VTgvDRVUnuAGp-rX03KA8Sf0HHcJtCyjfV5xaqbjXJXf6quM8Vz7ij10OEC0ASWsk0-cu2Zvu4U3N-ui6IO0D7Uw7PRJCQR-UXsKAZEJw7uu5ZR6atreri0h26P_77QpjIcIqRlr9f3h12-RiVqT9svUPaR5GdO5m1ooUAXNWQse-WVjjL1cfZKvAX9pPrBXpVJGkHO_dXE50",
      span: "md:col-span-2 md:row-span-2"
    },
    {
      title: "Ancestral Threads",
      tag: "Heritage",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5w27mi8qqh5vksm75snFsdwGFuQF4KtZkR925JzVbaBPnBJtlm8piiqjpg8vRpYdoNVEykX9eQCxBB_epaVaH7Dzi9uSL4Q0XoSZzAKZqa4xeEOG0lCE86goPbRfSn8YNEKQvmw8UIq01AHoUoWLT_0dt-9MaAI2hMUF4CbMWdmPsa2Ums8ngQM0aKwu6dQ3TbKxdvi_KODsmRS5zr1SBC5GUFAs4fBuowTr6lF0ooXmO2iRewQhMH5scjqW4zhCYJ9iMWsBHO8U",
      span: "md:col-span-1 md:row-span-2"
    },
    {
      title: "Shared Joy",
      tag: null,
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2t_JM7BN54daZLnHs3B3MSQcLkNHu121IrUQ2rNWkPu_ZTTqMdfwfowBZ2Crmct62X8Q3wxBYaz3nn10A_DbKSA-WDdNHlyUdmPTArWBHzocyF83_mmKv_2wwMUkdD4orJLG4Ip7cOAlB8o-hg4s942qS9PtRRO0LL_9WkmsFD1OTdf1uP4HqX_F3BM2WnIDcLgiN9q9geytDWEd7nNt-anZae7iJyUOK8WLRChKXru7KUZbojfT2Q2O6QOnIFS_9z1pfXB730aA",
      span: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Vitality & Play",
      tag: null,
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAl1NEAOtlF0Cjlsq4xFnQPCaWQUzaMSN8mM51V3W5rcyLL-0CuS2JVwKxhWUgfLdr5f2NLFPlslxqC310fVMXKLOsM0RHv4IL2cd9Hk-uQ7ztQybN9E8yrrVfc9Qimb6LgUnAJ8zNe76cNqVJLv6YUDMSKmx6F1TmS0uVP7DNx9Gf6oPp4w3Wdqhd8RTKCbbVAV0-Sgico8ni2vAKvUtZ39DUzhEKT9dEsU2XFXDdZstfb-Hu_yy9y8IRos2OK5aD6qIpu2G2rk7c",
      span: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Crafted Flavors",
      tag: null,
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFlZ-tOuzKPU2_RvJBFCQyKf_ZJG5qvCIhZOaVx7nEwdggmKqc3pN6xrdPMMRaeyTE0bPvWF9rayaq4bAk9NmwwfNYjQ4nXXKy41N3WAlONwQobexOllcLY9qwyXYgN13kceRpRTynzXauifIpY87Mowp5ilJ5mTUmecFNpDrmRj7KDCbIIADCGaU8s7YF5e0f7Z-3GsHYljz7W4bGFbIjmf7S2nEi973SDZ7SZCq3r7p5xRYOC6tQuaQMRpgQ0Ku96xr-zDpirD4",
      span: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Highland Echoes",
      tag: "Exploration",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWzwY1DA6Lsv_0RBBEbeGxVD0HY24YFwIkN9x3ulmsC0cv_2lHjI3OKPoVbcIXXUHqkeijKtLT1M87ccdtJZOO1zdLORn9aXK5cATZnvnVyV5QT1v9srXJ4V_Z7XZ1kYlI-e-l9ota_2P1gNhBwU-yinXQeD9idL1LAoNnwvOhDKh_-gcASYyPQcuXkEoXKIK9kuPvQOvsj4BxdVEbeIWexFBDrxSY843liPGxYGFySHaijpwljS8OGFVqdzHMaDiHJ9fB87872lU",
      span: "md:col-span-2 md:row-span-1"
    },
    {
      title: "Rhythm of Earth",
      tag: null,
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDuDapRe8VFYmQi9pCdyCpTQVuq4Djc5e1uHwnYIyMSvMUuNn1LGejhYueeENW1-q0ZkBLn4Qvv2izSRa_trkmmcKkah9uezhf_Nu5Kd6ln-mjvNkiVVSPhEE4R6dD3apLMOiz7NI_ceSb9I-opioKI1EV67udIAwtspHzLKmeT5oDte7z8u-YUeP11JvZ66Ma9LoUetOxvtvdgUM2mlgrb3aJ_-Fe492dCqtX_zHlX9cJS6T4KDpIiWwUqLYPLDeUZtGH96PmRIDY",
      span: "md:col-span-1 md:row-span-1"
    }
  ];

  return (
    <main className="pt-36 md:pt-64 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="mb-20 text-center md:text-left">
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold text-on-background tracking-tighter mb-6">
          Captured Moments <br className="hidden md:block" /> of the Highlands.
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl leading-relaxed">
          Journey through the lens into the heart of Kigezi. From the warmth of our hearths to the rhythm of our dances, explore the vibrant soul of Bakiga culture.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
        {images.map((img, idx) => (
          <div key={idx} className={`${img.span} relative group overflow-hidden rounded-xl bg-surface-container`}>
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={img.src} alt={img.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f1b13]/80 via-transparent to-transparent flex flex-col justify-end p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              {img.tag && <span className="text-primary-container font-bold text-sm tracking-widest uppercase mb-2">{img.tag}</span>}
              <h3 className="text-on-primary-container text-2xl font-headline font-bold">{img.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-32 rounded-[32px] bg-surface-container-high p-12 md:p-24 flex flex-col items-center text-center">
        <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-6">Join the Story</span>
        <h2 className="font-headline text-4xl md:text-6xl font-black text-on-surface mb-8 leading-tight">
          Beyond the Frame, <br /> Experience the Soul.
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <button className="bg-primary hover:bg-primary-container text-on-primary px-10 py-5 rounded-xl font-headline font-bold text-lg transition-all shadow-lg shadow-primary/20">
            Book Your Experience
          </button>
          <button className="bg-transparent hover:bg-surface-variant text-primary px-10 py-5 rounded-xl font-headline font-bold text-lg transition-all border-2 border-primary">
            View Pricing
          </button>
        </div>
      </section>
    </main>
  );
}
