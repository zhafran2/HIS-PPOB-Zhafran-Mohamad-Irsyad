

export default function Saldo() {
  return (
    <>
      <div className="bg-red-500 text-white p-4 rounded-lg mt-4 text-center relative">
        <p className="text-lg font-semibold">Saldo Anda</p>
        <p className="text-2xl font-bold">Rp ••••••••</p>
        <button className="absolute bottom-2 right-4 text-sm underline">
          Lihat Saldo
        </button>
      </div>
    </>
  );
}
