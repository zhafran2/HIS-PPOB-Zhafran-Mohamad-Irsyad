import pgn from "../assets/PGN.png";
import game from "../assets/Game.png";
import kurban from "../assets/Kurban.png";
import listrik from "../assets/Listrik.png";
import musik from "../assets/Musik.png";
import paketData from "../assets/Paket Data.png";
import pbb from "../assets/PBB.png";
import pdam from "../assets/PDAM.png";
import pulsa from "../assets/Pulsa.png";
import tv from "../assets/Televisi.png";
import voucherMakanan from "../assets/Voucher Makanan.png";
import zakat from "../assets/Zakat.png";

export default function Services() {


    return <>
     <div className="grid grid-cols-12 gap-4 mt-6 text-center">
        {[
          { img: pbb, name: "PBB" },
          { img: listrik, name: "Listrik" },
          { img: pulsa, name: "Pulsa" },
          { img: pdam, name: "PDAM" },
          { img: pgn, name: "PGN" },
          { img: tv, name: "TV Langganan" },
          { img: musik, name: "Musik" },
          { img: game, name: "Voucher Game" },
          { img: voucherMakanan, name: "Voucher Makanan" },
          { img: kurban, name: "Kurban" },
          { img: zakat, name: "Zakat" },
          { img: paketData, name: "Paket Data" },
        ].map((service, index) => (
          <div key={index} className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
            <img src={service.img} alt={service.name} className="w-12 h-12" />
            <p className="text-sm mt-2 font-medium">{service.name}</p>
          </div>
        ))}
      </div>
    </>
}