import banner1 from "../assets/Banner 1.png";
import banner2 from "../assets/Banner 2.png";
import banner3 from "../assets/Banner 3.png";
import banner4 from "../assets/Banner 4.png";
import banner5 from "../assets/Banner 5.png";

export default function Banners() {
  return (
    <>
      <div className="mt-6 grid grid-cols-5 gap-2">
        {[banner1, banner2, banner3, banner4, banner5].map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt="Promo Banner"
            className="rounded-lg shadow"
          />
        ))}
      </div>
    </>
  );
}
