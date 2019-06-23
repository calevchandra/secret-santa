import React, { useState } from "react";
import PropTypes from "prop-types";
import { Container, Button, Table, Alert } from "react-bootstrap";
import { toast } from "react-toastify";

import { API_BASE_URL } from "../../config";

const GiftPartners = ({
  assignGiftPartners,
  giftExchange,
  resetGiftExchange
}) => {
  const [disableAssignButton, setDisableAssignButton] = useState(false);

  /**
   * sendToAll sends an email to each of the participant,
   * informing who they are gifting to in the secret santa exchange
   */
  const sendToAll = () => {
    giftExchange.map(data => {
      sendEmailAlert(data.name, data.email, data.giftTo);
    });
  };

  return (
    <Container style={{ padding: 20 }}>
      <div>
        <Button
          disabled={disableAssignButton}
          onClick={() => {
            assignGiftPartners();
            setDisableAssignButton(true);
          }}
          variant="dark"
        >
          Assign
        </Button>
      </div>
      {giftExchange && giftExchange.length > 1 ? (
        <>
          <Table borderless responsive striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gifting to</th>
              </tr>
            </thead>
            <tbody>
              {giftExchange.map((data, idx) => {
                return (
                  <tr key={idx}>
                    <td>
                      {data.name.charAt(0).toUpperCase() + data.name.slice(1)}
                    </td>
                    <td>
                      {data.giftTo.charAt(0).toUpperCase() +
                        data.giftTo.slice(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>

          <Button
            block
            onClick={() => {
              sendToAll();
              setDisableAssignButton(false);
              resetGiftExchange();
            }}
            variant="info"
          >
            Notify
          </Button>
        </>
      ) : (
        <div style={{ paddingTop: 10 }}>
          <Alert variant="info">Staffs not allocated to a partner</Alert>
        </div>
      )}
    </Container>
  );
};

/**
 * sendEmailAlert calls an API that uses sendGrid to send emails.
 * The API server automatically starts with 'npm start'
 */
const sendEmailAlert = (name, email, giftingTo) => {
  return fetch(`${API_BASE_URL}send-email/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      recipient: email,
      sender: "cbkavit@gmail.com",
      topic: "Secret Santa",
      text: `Hi ${name.charAt(0).toUpperCase() +
        name.slice(1)}, you are selected to gift ${giftingTo
        .charAt(0)
        .toUpperCase() + giftingTo.slice(1)}. All the best `
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.msg === "Sent") toast.success("Email sent.");
    })
    .catch(error => error.message);
};

GiftPartners.propTypes = {
  assignGiftPartners: PropTypes.func.isRequired,
  giftExchange: PropTypes.array.isRequired,
  resetGiftExchange: PropTypes.func.isRequired
};

export default GiftPartners;
