import React from "react";
import "./styles.css";
import Cards from "./card";
import AddCard from "./addCards";
import styled from "styled-components";

export default function App() {
  const [cardList, setCardList] = React.useState([]);
  const [addCard, setCard] = React.useState(false);
  const Container = styled.div`
    width: 100%;
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `;
  return (
    <Container className="App">
      <AddCard
        setCardList={setCardList}
        cardList={cardList}
        addCard={addCard}
        setCard={setCard}
      />
      <div style={{ overflow: "scroll" }}>
        {!addCard &&
          cardList.map((card) => {
            return <Cards card={card} />;
          })}
      </div>
    </Container>
  );
}
