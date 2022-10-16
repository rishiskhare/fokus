import { useState, useEffect } from "react";
import logo from "../logo.png";
import Button from "react-bootstrap/Button";

const Header = ({ toggleView }) => {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  useEffect(() => {
    const url = "https://motivational-quote-api.herokuapp.com/quotes/random";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setQuote(json.quote);
        setAuthor(json.person);
      } catch (error) {}
    };
    fetchData();
  }, []);
  return (
    <div>
      <div className="logo_container">
        <img id="logg" src={logo} className="logo_img" />
        <h1 className="logo_text">Fokus</h1>
        <Button onClick={toggleView} className="switchh" style={{right: "5px"}}>Switch View</Button>
      </div>
      <h2 className="quote_text">{'"' + quote + '"'}</h2>
      <h2 className="quote_author">{"—" + author}</h2>
    </div>
  );
};

export default Header;
