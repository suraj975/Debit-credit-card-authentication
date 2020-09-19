import React from "react";
import styled from "styled-components";
import { CARDICON, CARDARR, COLORARR } from "./constant";

const CardWrapper = styled.div`
  width: 400px;
  height: 230px;
  border-radius: 8px;
  margin-bottom: 10px;
  background: ${({ colorVal }) => COLORARR[colorVal][0]};
  background: -webkit-linear-gradient(
    to right,
    ${({ colorVal }) => COLORARR[colorVal][0]},
    ${({ colorVal }) => COLORARR[colorVal][1]}
  );
  background: linear-gradient(
    to right,
    ${({ colorVal }) => COLORARR[colorVal][0]},
    ${({ colorVal }) => COLORARR[colorVal][1]}
  );
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const CardNumber = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 33px;
  color: white;
`;
const Header = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  font-size: 30px;
`;
const Bottom = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
`;

const Name = styled.div`
  margin-left: 15px;
  color: white;
`;
const Expiry = styled.div`
  margin-right: 15px;
  color: white;
`;

const Cards = (props) => {
  return (
    <CardWrapper colorVal={Math.floor(Math.random() * 6)}>
      <Card>
        <Header className="header">
          {CARDARR.includes(props.card.cardType) && (
            <img
              style={{ marginLeft: "10px" }}
              src={CARDICON[props.card.cardType]}
              alt="card"
              width="80px"
              height="50px"
            />
          )}
        </Header>
        <CardNumber>{props.card.card}</CardNumber>
        <Bottom>
          <Name>
            <div style={{ fontSize: "15px" }}>CardHodler</div>
            <span style={{ fontSize: "14px" }}>{props.card.cardHodler}</span>
          </Name>
          <Expiry>
            <div style={{ fontSize: "15px" }}>Expiry</div>
            <span style={{ fontSize: "14px" }}>{props.card.expiry}</span>
          </Expiry>
        </Bottom>
      </Card>
    </CardWrapper>
  );
};

export default Cards;
