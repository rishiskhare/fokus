import { useState, useEffect } from "react";

const Header = () => {
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
      <h1>Fokus!!</h1>
      <h2 className="quote_text">{'"' + quote + '"'}</h2>
      <h2 className="quote_author">{"—" + author}</h2>
    </div>
  );
};

export default Header;
