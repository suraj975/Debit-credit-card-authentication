import React from "react";
import MaskedInput from "react-text-mask";
import styled from "styled-components";
import {
  AMERICANEXPRESS,
  OTHERCARDS,
  EXPIRYDATE,
  CVC,
  CARDARR,
  CARDICON
} from "./constant";
import {
  stripeCardNumberValidation,
  stripeCardExpirValidation,
  textWithSpacesOnly,
  minLength
} from "./validations";

const Wrapper = styled.div`
  color: white;
  width: 400px;
  height: 250px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
`;

const Add = styled.div`
  display: flex;
  align-items: center;
  width: 400px;
  height: 60px;
  color: white;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  border:1px solid white;
  }

  :hover{
    background: #ffb347;  /* fallback for old browsers */
background: -webkit-linear-gradient(to top, #ffcc33, #ffb347);  /* Chrome 10-25, Safari 5.1-6 */
background: linear-gradient(to top, #ffcc33, #ffb347); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  }
  .plusFont {
    font-size: 34px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid;
    border-radius: 50%;
    margin-left: 10px;
    height: 50px;
    cursor: pointer;
  }
  .text {
    width: 100%;
    font-weight: 800;
    font-size: 20px;
    text-align: center;
  }
`;

const BottomBox = styled.div`
  display: flex;
  button {
    margin-right: 10px;
  }
  .expiry {
    display: flex;
    flex-direction: column;
  }
  .cvc {
    display: flex;
    flex-direction: column;
  }
`;

const Inputs = styled.div`
  height: 65px;
  width: 90%;
  input {
    width: ${({ inputSize }) => (inputSize === "small" ? "85%" : "100%")};
    height: 30px;
  }
`;

const Buttons = styled.div`
  width: 100%;
  display: flex;

  div {
    margin-left: 25px;

    button {
      padding: 6px;
      border-radius: 10px;
      width: 80px;
    }

    .btn-grad {
      background-image: linear-gradient(
        to right,
        #f09819 0%,
        #edde5d 51%,
        #f09819 100%
      );
    }
    .btn-grad:hover {
      background-position: right center;
    }
  }
`;

const Error = styled.span`
  font-size: 13px;
  font-weight: bold;
  color: red;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "card":
      return { ...state, card: action.data };
    case "expiry":
      return { ...state, expiry: action.data };
    case "securityCode":
      return { ...state, securityCode: action.data };
    case "cardHodler":
      return { ...state, cardHodler: action.data };
    case "cleanState":
      return { ...action.data };
    default:
      return state;
  }
};

function findDebitCardType(cardNumber) {
  const regexPattern = {
    MASTERCARD: /^5[1-5][0-9]{1,}|^2[2-7][0-9]{1,}$/,
    VISA: /^4[0-9]{2,}$/,
    AMERICAN_EXPRESS: /^3[47][0-9]{5,}$/,
    DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{3,}$/,
    DINERS_CLUB: /^3(?:0[0-5]|[68][0-9])[0-9]{4,}$/,
    JCB: /^(?:2131|1800|35[0-9]{3})[0-9]{3,}$/
  };
  for (const card in regexPattern) {
    if (cardNumber.replace(/[^\d]/g, "").match(regexPattern[card])) return card;
  }
  return "";
}

const AddCard = (props) => {
  const [error, setError] = React.useState({});
  const [cardType, setCardType] = React.useState();
  const [state, dispatch] = React.useReducer(reducer, {
    card: "",
    expiry: "",
    securityCode: "",
    cardHodler: ""
  });

  const handleValidations = (type, value) => {
    let errorText;
    switch (type) {
      case "card":
        setCardType(findDebitCardType(value));
        errorText = stripeCardNumberValidation(value);
        setError({ ...error, cardError: errorText });
        break;
      case "cardHodler":
        errorText = value === "" ? "Required" : textWithSpacesOnly(value);
        setError({ ...error, cardHodlerError: errorText });
        break;
      case "expiry":
        errorText =
          value === "" ? "Required" : stripeCardExpirValidation(value);
        setError({ ...error, expiryError: errorText });
        break;
      case "securityCode":
        errorText = value === "" ? "Required" : minLength(3)(value);
        setError({ ...error, securityCodeError: errorText });
        break;
      default:
        break;
    }
  };

  const handleInputData = (e) => {
    dispatch({ type: e.target.name, data: e.target.value });
  };
  const openCard = () => {
    props.setCard(!props.addCard);
  };

  const handleBlur = (e) => {
    handleValidations(e.target.name, e.target.value);
  };

  const checkErrorBeforeSave = () => {
    let errorValue = {};
    let isError = false;
    Object.keys(state).forEach(async (val) => {
      if (state[val] === "") {
        errorValue = { ...errorValue, [`${val + "Error"}`]: "Required" };
        isError = true;
      }
    });
    setError(errorValue);
    return isError;
  };

  const handleSave = (e) => {
    let errorCheck = checkErrorBeforeSave();
    if (!errorCheck) {
      props.setCardList([...props.cardList, { ...state, cardType }]);
      dispatch("cleanState", {
        card: "",
        expiry: "",
        securityCode: "",
        cardHodler: ""
      });
      props.setCard(false);
    }
  };
  return (
    <>
      <Add onClick={openCard}>
        {/* <div onClick={openCard} className="plusFont">
          +
        </div> */}
        <div className="text">Add Card</div>
      </Add>
      <form style={{ marginBottom: "10px" }}>
        {props.addCard && (
          <Wrapper>
            <Inputs>
              <MaskedInput
                mask={
                  ["37", "34"].includes(
                    state && state.card.split("").splice(0, 2).join("")
                  )
                    ? AMERICANEXPRESS
                    : OTHERCARDS
                }
                guide={false}
                placeholderChar={"\u2000"}
                placeholder="Card Number"
                name="card"
                required
                value={state.card}
                onChange={handleInputData}
                onBlur={handleBlur}
              />
              {(!error || !error.cardError) && CARDARR.includes(cardType) && (
                <img
                  style={{
                    float: "right",
                    position: "relative",
                    top: "-35px"
                  }}
                  src={CARDICON[cardType]}
                  alt="card"
                  width="50px"
                  height="33px"
                />
              )}
              {error && error.cardError && error.cardError.length > 1 && (
                <Error>{error.cardError}</Error>
              )}
            </Inputs>
            <Inputs>
              <input
                type="text"
                name="cardHodler"
                required
                placeholder="CardHolder's Name"
                value={state.cardHodler}
                onChange={handleInputData}
                onBlur={handleBlur}
              />
              {error &&
                error.cardHodlerError &&
                error.cardHodlerError.length > 1 && (
                  <Error>{error.cardHodlerError}</Error>
                )}
            </Inputs>
            <Inputs inputSize="small">
              <BottomBox>
                <div className="expiry">
                  <MaskedInput
                    mask={EXPIRYDATE}
                    guide={false}
                    name="expiry"
                    required
                    placeholderChar={"\u2000"}
                    placeholder="Expiry Date (MM/YY)"
                    value={state.expiry}
                    onChange={handleInputData}
                    onBlur={handleBlur}
                  />
                  {error &&
                    error.expiryError &&
                    error.expiryError.length > 1 && (
                      <Error>{error.expiryError}</Error>
                    )}
                </div>
                <div className="cvc">
                  <MaskedInput
                    mask={CVC}
                    guide={false}
                    name="securityCode"
                    required
                    placeholderChar={"\u2000"}
                    placeholder="Secuirty Code"
                    value={state.securityCode}
                    onChange={handleInputData}
                    onBlur={handleBlur}
                  />
                  {error &&
                    error.securityCodeError &&
                    error.securityCodeError.length > 1 && (
                      <Error>{error.securityCodeError}</Error>
                    )}
                </div>
              </BottomBox>
            </Inputs>
            <Buttons>
              <div className="button">
                <button className="btn-grad">Close</button>
              </div>
              <div className="button">
                <button className="btn-grad" type="button" onClick={handleSave}>
                  Add Card
                </button>
              </div>
            </Buttons>
          </Wrapper>
        )}
      </form>
    </>
  );
};

export default AddCard;
