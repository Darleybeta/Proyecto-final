import { MdLocationOn, MdPhone } from "react-icons/md";
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
import "../style/Footer.css"; 

export default function Footer() {
  return (
    
        <footer className="footer">
      <div className="footer-info">          
  <p><MdLocationOn /> Calle 123 #45-67, Bogotá, Colombia</p>
          <p><MdPhone /> +57 322 727 2926</p>
        </div>
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://x.com" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
        </div>
        <p className="footer-text">© 2026 Bienvenidos a LukySystem</p>
      </footer>
    );
}